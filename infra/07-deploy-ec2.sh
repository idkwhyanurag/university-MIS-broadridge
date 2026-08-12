#!/usr/bin/env bash
# Deploy / refresh MIS API container on EC2 from ECR (App Runner alternative).
# Prerequisites: infra/out/rds.env + ecr.env; Docker on the instance; SSH access.
# Optional: infra/out/apprunner.env for JWT_SECRET / CORS_ORIGINS reuse.
#
# Usage:
#   EC2_HOST=<public-ip-or-eip> EC2_PEM=~/path/to.pem ./infra/07-deploy-ec2.sh
#   EC2_HOST=<ip> EC2_SSH_KEY=~/path/to.pem ./infra/07-deploy-ec2.sh
#
# Env: EC2_HOST (required), EC2_PEM or EC2_SSH_KEY (PEM path), EC2_USER (default ec2-user),
#      CORS_ORIGINS, JWT_SECRET, AWS_REGION

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -f "$ROOT/infra/out/rds.env" || ! -f "$ROOT/infra/out/ecr.env" ]]; then
  echo "ERROR: Need infra/out/rds.env and infra/out/ecr.env (run 01 + 02 first)." >&2
  exit 1
fi

# shellcheck disable=SC1091
source "$ROOT/infra/out/rds.env"
# shellcheck disable=SC1091
source "$ROOT/infra/out/ecr.env"
if [[ -f "$ROOT/infra/out/apprunner.env" ]]; then
  # shellcheck disable=SC1091
  source "$ROOT/infra/out/apprunner.env"
fi

EC2_HOST="${EC2_HOST:-}"
EC2_USER="${EC2_USER:-ec2-user}"
EC2_PEM="${EC2_PEM:-${EC2_SSH_KEY:-}}"
AWS_REGION="${AWS_REGION:-us-east-1}"
CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:3000,http://localhost:3002}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 48 | tr -d '\n')}"
REMOTE_ENV="/home/${EC2_USER}/mis-api.env"
CONTAINER_NAME="mis-api"

if [[ -z "$EC2_HOST" ]]; then
  echo "ERROR: Set EC2_HOST to the instance public IP / Elastic IP." >&2
  exit 1
fi
if [[ -z "$EC2_PEM" || ! -f "$EC2_PEM" ]]; then
  echo "ERROR: Set EC2_PEM or EC2_SSH_KEY to a readable PEM file path." >&2
  exit 1
fi
if [[ -z "${DB_URL:-}" || -z "${DB_USER:-}" || -z "${DB_PASSWORD:-}" ]]; then
  echo "ERROR: DB_URL / DB_USER / DB_PASSWORD missing after sourcing rds.env." >&2
  echo "       Ensure DB_URL is single-quoted in infra/out/rds.env (re-run 01-create-rds.sh)." >&2
  exit 1
fi
if [[ -z "${ECR_IMAGE:-}" || -z "${ECR_URI:-}" ]]; then
  echo "ERROR: ECR_IMAGE / ECR_URI missing — run ./infra/02-push-ecr.sh first." >&2
  exit 1
fi

chmod 400 "$EC2_PEM" 2>/dev/null || true
SSH=(ssh -i "$EC2_PEM" -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes)
SCP=(scp -i "$EC2_PEM" -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes)

mkdir -p "$ROOT/infra/out"
LOCAL_ENV="$ROOT/infra/out/mis-api.env"
# Docker --env-file: KEY=VALUE lines (no shell quoting needed for & in DB_URL).
cat > "$LOCAL_ENV" <<EOF
DB_URL=${DB_URL}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
JWT_SECRET=${JWT_SECRET}
CORS_ORIGINS=${CORS_ORIGINS}
PORT=8080
EOF

echo "==> SCP env-file → ${EC2_USER}@${EC2_HOST}:${REMOTE_ENV}"
"${SCP[@]}" "$LOCAL_ENV" "${EC2_USER}@${EC2_HOST}:${REMOTE_ENV}"

ECR_REGISTRY="$(echo "$ECR_URI" | cut -d/ -f1)"
echo "==> ECR login on host ($ECR_REGISTRY)"
ECR_PASS=$(aws ecr get-login-password --region "$AWS_REGION")
"${SSH[@]}" "${EC2_USER}@${EC2_HOST}" \
  "echo '$ECR_PASS' | sudo docker login --username AWS --password-stdin '$ECR_REGISTRY'"

echo "==> Pull ${ECR_IMAGE}"
"${SSH[@]}" "${EC2_USER}@${EC2_HOST}" "sudo docker pull '${ECR_IMAGE}'"

echo "==> Restart container ${CONTAINER_NAME} on :8080"
"${SSH[@]}" "${EC2_USER}@${EC2_HOST}" bash -s <<REMOTE
set -euo pipefail
sudo docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
sudo docker run -d --name ${CONTAINER_NAME} --restart unless-stopped \
  -p 8080:8080 \
  --env-file ${REMOTE_ENV} \
  '${ECR_IMAGE}'
sudo docker ps --filter name=${CONTAINER_NAME}
REMOTE

SERVICE_URL="http://${EC2_HOST}:8080"
API_BASE="${SERVICE_URL}/api"
cat > "$ROOT/infra/out/apprunner.env" <<EOF
AWS_REGION=$AWS_REGION
SERVICE_NAME=university-mis-api-ec2
SERVICE_ARN=manual-ec2
SERVICE_URL=$SERVICE_URL
API_BASE=$API_BASE
JWT_SECRET=$JWT_SECRET
CORS_ORIGINS=$CORS_ORIGINS
EC2_HOST=$EC2_HOST
EOF

echo "==> Wrote infra/out/apprunner.env (EC2 path)"
echo "    SERVICE_URL=$SERVICE_URL"
echo "==> Smoke health"
curl -fsS "${SERVICE_URL}/actuator/health" || true
echo

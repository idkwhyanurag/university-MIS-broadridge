#!/usr/bin/env bash
# Run full cloud deploy pipeline (EC2-first):
#   RDS → ECR → EC2 API → S3/CloudFront frontend → CORS on EC2
# App Runner (03) is optional and often blocked on Free plan — see CLOUD_DEPLOY.md.
#
# Prerequisites: aws CLI, Docker, Node.js, openssl.
# Required for EC2 steps: EC2_HOST and EC2_PEM (or EC2_SSH_KEY) pointing at a PEM file.
# Usage: EC2_HOST=<eip> EC2_PEM=~/key.pem ./infra/deploy-all.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${EC2_HOST:-}" ]]; then
  echo "ERROR: Set EC2_HOST (Elastic IP / public IP of the API instance)." >&2
  exit 1
fi
if [[ -z "${EC2_PEM:-${EC2_SSH_KEY:-}}" ]]; then
  echo "ERROR: Set EC2_PEM or EC2_SSH_KEY to the SSH PEM path." >&2
  exit 1
fi

chmod +x infra/01-create-rds.sh infra/02-push-ecr.sh infra/03-create-apprunner.sh \
  infra/04-deploy-frontend.sh infra/05-update-cors.sh infra/06-github-secrets.sh \
  infra/07-deploy-ec2.sh

echo "========== 1/5 RDS =========="
./infra/01-create-rds.sh

echo "========== 2/5 ECR (linux/amd64) =========="
./infra/02-push-ecr.sh

echo "========== 3/5 EC2 API =========="
./infra/07-deploy-ec2.sh

echo "========== 4/5 Frontend CDN =========="
./infra/04-deploy-frontend.sh

echo "========== 5/5 CORS on EC2 + smoke =========="
# shellcheck disable=SC1091
source infra/out/frontend.env
export CORS_ORIGINS="${CLOUDFRONT_DOMAIN}"
./infra/07-deploy-ec2.sh

echo "========== GitHub secrets checklist =========="
./infra/06-github-secrets.sh

echo
echo "DONE. Open the site URL from infra/out/frontend.env"
echo "(App Runner script 03 is skipped — Free plan often blocks it; use 07/EC2.)"
cat infra/out/frontend.env

#!/usr/bin/env bash
# Build and push Spring Boot image to Amazon ECR (linux/amd64 for EC2).
# Usage: ./infra/02-push-ecr.sh

set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
APP_NAME="${APP_NAME:-university-mis}"
ECR_REPO="${ECR_REPO:-$APP_NAME-backend}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"

echo "==> Account $ACCOUNT_ID  Region $AWS_REGION"
echo "==> Ensure ECR repo $ECR_REPO"
aws ecr describe-repositories --repository-names "$ECR_REPO" --region "$AWS_REGION" >/dev/null 2>&1 \
  || aws ecr create-repository --repository-name "$ECR_REPO" --region "$AWS_REGION" >/dev/null

echo "==> Login to ECR"
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

echo "==> Build & push linux/amd64 → ${ECR_URI}:latest"
# Quote "${ECR_URI}:latest" (bash-safe; avoids zsh :latest history expansion pitfalls).
docker buildx build --platform linux/amd64 -t "${ECR_URI}:latest" --push .

mkdir -p infra/out
cat > infra/out/ecr.env <<EOF
AWS_REGION=$AWS_REGION
ACCOUNT_ID=$ACCOUNT_ID
ECR_REPO=$ECR_REPO
ECR_URI=$ECR_URI
ECR_IMAGE=${ECR_URI}:latest
EOF

echo "==> Wrote infra/out/ecr.env"
echo "    ECR_IMAGE=${ECR_URI}:latest"

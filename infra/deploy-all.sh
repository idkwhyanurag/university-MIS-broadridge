#!/usr/bin/env bash
# Run full cloud deploy pipeline (RDS → ECR → App Runner → S3/CloudFront → CORS).
# Prerequisites: aws CLI configured, Docker running, Node.js, openssl.
# Usage: ./infra/deploy-all.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

chmod +x infra/01-create-rds.sh infra/02-push-ecr.sh infra/03-create-apprunner.sh \
  infra/04-deploy-frontend.sh infra/05-update-cors.sh infra/06-github-secrets.sh

echo "========== 1/5 RDS =========="
./infra/01-create-rds.sh

echo "========== 2/5 ECR =========="
./infra/02-push-ecr.sh

echo "========== 3/5 App Runner =========="
./infra/03-create-apprunner.sh

echo "========== 4/5 Frontend CDN =========="
./infra/04-deploy-frontend.sh

echo "========== 5/5 CORS + smoke =========="
./infra/05-update-cors.sh

echo "========== GitHub secrets checklist =========="
./infra/06-github-secrets.sh

echo
echo "DONE. Open the CloudFront URL from infra/out/frontend.env"
cat infra/out/frontend.env

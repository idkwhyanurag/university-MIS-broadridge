#!/usr/bin/env bash
# Update App Runner CORS_ORIGINS to the CloudFront URL, then smoke-test login.
# Prerequisites: infra/out/{rds,ecr,apprunner,frontend}.env
# Usage: ./infra/05-update-cors.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/infra/out/rds.env"
# shellcheck disable=SC1091
source "$ROOT/infra/out/ecr.env"
# shellcheck disable=SC1091
source "$ROOT/infra/out/apprunner.env"
# shellcheck disable=SC1091
source "$ROOT/infra/out/frontend.env"

AWS_REGION="${AWS_REGION:-us-east-1}"
CORS_ORIGINS="$CLOUDFRONT_DOMAIN"

ROLE_ARN=$(aws apprunner describe-service --region "$AWS_REGION" --service-arn "$SERVICE_ARN" \
  --query 'Service.SourceConfiguration.AuthenticationConfiguration.AccessRoleArn' --output text)

echo "==> Updating App Runner CORS_ORIGINS=$CORS_ORIGINS"

export ROLE_ARN ECR_IMAGE DB_URL DB_USER DB_PASSWORD JWT_SECRET CORS_ORIGINS
python3 - <<'PY' > /tmp/apprunner-source.json
import json, os
cfg = {
  "AuthenticationConfiguration": {"AccessRoleArn": os.environ["ROLE_ARN"]},
  "AutoDeploymentsEnabled": True,
  "ImageRepository": {
    "ImageIdentifier": os.environ["ECR_IMAGE"],
    "ImageRepositoryType": "ECR",
    "ImageConfiguration": {
      "Port": "8080",
      "RuntimeEnvironmentVariables": {
        "DB_URL": os.environ["DB_URL"],
        "DB_USER": os.environ["DB_USER"],
        "DB_PASSWORD": os.environ["DB_PASSWORD"],
        "JWT_SECRET": os.environ["JWT_SECRET"],
        "CORS_ORIGINS": os.environ["CORS_ORIGINS"],
        "PORT": "8080",
      },
    },
  },
}
print(json.dumps(cfg))
PY

aws apprunner update-service --region "$AWS_REGION" --service-arn "$SERVICE_ARN" \
  --source-configuration file:///tmp/apprunner-source.json >/dev/null

echo "==> Waiting for update..."
for i in $(seq 1 40); do
  STATUS=$(aws apprunner describe-service --region "$AWS_REGION" --service-arn "$SERVICE_ARN" --query 'Service.Status' --output text)
  echo "    status=$STATUS ($i/40)"
  [[ "$STATUS" == "RUNNING" ]] && break
  sleep 15
done

aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" >/dev/null

echo "==> API health"
curl -fsS "${SERVICE_URL}/actuator/health"; echo
echo "==> Login with CloudFront Origin"
curl -fsS -X POST "${SERVICE_URL}/api/auth/login" \
  -H 'Content-Type: application/json' \
  -H "Origin: $CLOUDFRONT_DOMAIN" \
  -d '{"email":"admin@mis.edu","password":"Admin@123"}'
echo

perl -i -pe "s|^CORS_ORIGINS=.*|CORS_ORIGINS=$CORS_ORIGINS|" "$ROOT/infra/out/apprunner.env"

echo
echo "==> Open $CLOUDFRONT_DOMAIN"
echo "    Login: admin@mis.edu / Admin@123"

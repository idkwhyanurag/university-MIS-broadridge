#!/usr/bin/env bash
# Create / update AWS App Runner service for the MIS API.
# Prerequisites: infra/out/rds.env and infra/out/ecr.env from prior scripts.
# Usage: ./infra/03-create-apprunner.sh
#
# Note: Many Free-plan AWS accounts return SubscriptionRequiredException for App Runner.
# Prefer ./infra/07-deploy-ec2.sh unless App Runner is unlocked on the account.
# rds.env must single-quote DB_URL (see 01-create-rds.sh) so JDBC & params survive `source`.

set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
SERVICE_NAME="${SERVICE_NAME:-university-mis-api}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -f "$ROOT/infra/out/rds.env" || ! -f "$ROOT/infra/out/ecr.env" ]]; then
  echo "ERROR: Need infra/out/rds.env and infra/out/ecr.env (run 01 + 02 first)." >&2
  exit 1
fi

# shellcheck disable=SC1091
source "$ROOT/infra/out/rds.env"
# shellcheck disable=SC1091
source "$ROOT/infra/out/ecr.env"

if [[ -z "${DB_URL:-}" ]]; then
  echo "ERROR: DB_URL empty after sourcing rds.env." >&2
  echo "       Re-run ./infra/01-create-rds.sh so DB_URL is written with single quotes." >&2
  exit 1
fi

JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 48 | tr -d '\n')}"
CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:3000,http://localhost:3002}"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_NAME="AppRunnerECRAccessRole-mis"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

echo "==> Ensure IAM role $ROLE_NAME for App Runner → ECR"
if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  cat > /tmp/apprunner-trust.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "build.apprunner.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
  aws iam create-role --role-name "$ROLE_NAME" \
    --assume-role-policy-document file:///tmp/apprunner-trust.json >/dev/null
  aws iam attach-role-policy --role-name "$ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
  echo "==> Waiting for IAM role propagation..."
  sleep 15
fi

EXISTING=$(aws apprunner list-services --region "$AWS_REGION" \
  --query "ServiceSummaryList[?ServiceName=='$SERVICE_NAME'].ServiceArn | [0]" \
  --output text 2>/dev/null || echo "None")

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

apprunner_err() {
  local msg="$1"
  if echo "$msg" | grep -qi 'SubscriptionRequiredException'; then
    echo "ERROR: App Runner is not available on this AWS account (SubscriptionRequiredException)." >&2
    echo "       Free-plan accounts often block App Runner. Use EC2 instead:" >&2
    echo "         EC2_HOST=<eip> EC2_PEM=~/path/to.pem ./infra/07-deploy-ec2.sh" >&2
    echo "       Or upgrade the account plan, then re-run this script." >&2
    return 0
  fi
  return 1
}

if [[ -z "$EXISTING" || "$EXISTING" == "None" ]]; then
  echo "==> Creating App Runner service $SERVICE_NAME"
  set +e
  CREATE_OUT=$(aws apprunner create-service --region "$AWS_REGION" \
    --service-name "$SERVICE_NAME" \
    --source-configuration file:///tmp/apprunner-source.json \
    --health-check-configuration '{
      "Protocol": "HTTP",
      "Path": "/actuator/health",
      "Interval": 10,
      "Timeout": 5,
      "HealthyThreshold": 1,
      "UnhealthyThreshold": 5
    }' \
    --instance-configuration '{"Cpu":"1024","Memory":"2048"}' 2>&1)
  CREATE_RC=$?
  set -e
  if [[ $CREATE_RC -ne 0 ]]; then
    echo "$CREATE_OUT" >&2
    if apprunner_err "$CREATE_OUT"; then
      exit 1
    fi
    exit "$CREATE_RC"
  fi
  SERVICE_ARN=$(echo "$CREATE_OUT" | python3 -c "import sys,json; print(json.load(sys.stdin)['Service']['ServiceArn'])")
else
  SERVICE_ARN="$EXISTING"
  echo "==> App Runner service exists: $SERVICE_ARN — applying latest image/env"
  set +e
  UPDATE_OUT=$(aws apprunner update-service --region "$AWS_REGION" --service-arn "$SERVICE_ARN" \
    --source-configuration file:///tmp/apprunner-source.json 2>&1)
  UPDATE_RC=$?
  set -e
  if [[ $UPDATE_RC -ne 0 ]]; then
    echo "$UPDATE_OUT" >&2
    if apprunner_err "$UPDATE_OUT"; then
      exit 1
    fi
    # Non-subscription failures on update: keep prior behavior soft
    true
  fi
fi

echo "==> Waiting for service RUNNING (can take several minutes)..."
for i in $(seq 1 60); do
  STATUS=$(aws apprunner describe-service --region "$AWS_REGION" --service-arn "$SERVICE_ARN" \
    --query 'Service.Status' --output text)
  echo "    status=$STATUS ($i/60)"
  [[ "$STATUS" == "RUNNING" ]] && break
  [[ "$STATUS" == "CREATE_FAILED" || "$STATUS" == "DELETE_FAILED" ]] && exit 1
  sleep 20
done

SERVICE_URL=$(aws apprunner describe-service --region "$AWS_REGION" --service-arn "$SERVICE_ARN" \
  --query 'Service.ServiceUrl' --output text)

mkdir -p "$ROOT/infra/out"
cat > "$ROOT/infra/out/apprunner.env" <<EOF
AWS_REGION=$AWS_REGION
SERVICE_NAME=$SERVICE_NAME
SERVICE_ARN=$SERVICE_ARN
SERVICE_URL=https://$SERVICE_URL
API_BASE=https://$SERVICE_URL/api
JWT_SECRET=$JWT_SECRET
CORS_ORIGINS=$CORS_ORIGINS
EOF

echo "==> Wrote infra/out/apprunner.env"
echo "    SERVICE_URL=https://$SERVICE_URL"

echo "==> Smoke health"
curl -fsS "https://$SERVICE_URL/actuator/health" || true
echo
echo "==> Smoke login"
curl -fsS -X POST "https://$SERVICE_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@mis.edu","password":"Admin@123"}' || true
echo

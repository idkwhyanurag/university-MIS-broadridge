# Practical AWS deployment for University MIS
#
# Architecture:
#   Users → CloudFront → S3 (React SPA)
#                      → App Runner (Spring Boot) → RDS MySQL
#
# Prerequisites: AWS CLI configured, Docker, Node.js, an AWS account.

set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
APP_NAME="${APP_NAME:-university-mis}"
ECR_REPO="${ECR_REPO:-$APP_NAME-backend}"
S3_BUCKET="${S3_BUCKET:-$APP_NAME-frontend}"
DB_INSTANCE="${DB_INSTANCE:-$APP_NAME-db}"

echo "==> Region: $AWS_REGION"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"

echo "==> Ensure ECR repository"
aws ecr describe-repositories --repository-names "$ECR_REPO" --region "$AWS_REGION" >/dev/null 2>&1 \
  || aws ecr create-repository --repository-name "$ECR_REPO" --region "$AWS_REGION"

echo "==> Login to ECR"
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

echo "==> Build & push backend image"
docker build -t "$ECR_REPO:latest" .
docker tag "$ECR_REPO:latest" "$ECR_URI:latest"
docker push "$ECR_URI:latest"

echo "==> Ensure S3 bucket for frontend"
aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null \
  || aws s3 mb "s3://$S3_BUCKET" --region "$AWS_REGION"

echo "==> Build frontend"
# Set REACT_APP_API_URL to your App Runner service URL + /api before running in CI.
pushd mis-frontend >/dev/null
npm ci
npm run build
aws s3 sync build/ "s3://$S3_BUCKET" --delete
popd >/dev/null

cat <<EOF

Done pushing artifacts.

Next (one-time console or CLI):
1. Create RDS MySQL (db.t3.micro), DB name university_mis, note endpoint/user/password.
2. Create App Runner service from ECR image $ECR_URI:latest
   Port: 8080
   Env:
     DB_URL=jdbc:mysql://<rds-endpoint>:3306/university_mis?useSSL=true&serverTimezone=UTC
     DB_USER=...
     DB_PASSWORD=...
     JWT_SECRET=<long random string>
     CORS_ORIGINS=https://<your-cloudfront-domain>
   Health check: /actuator/health
3. Create CloudFront distribution with S3 origin; SPA error pages → /index.html
4. Set frontend REACT_APP_API_URL=https://<apprunner-url>/api and rebuild/sync.
5. Open CloudFront URL and login with seeded users (admin@mis.edu / Admin@123).

EOF

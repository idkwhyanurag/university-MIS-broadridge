#!/usr/bin/env bash
# Build React SPA against App Runner API, sync to S3, create CloudFront distribution.
# Prerequisites: infra/out/apprunner.env
# Usage: ./infra/04-deploy-frontend.sh

set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/infra/out/apprunner.env"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
S3_BUCKET="${S3_BUCKET:-university-mis-frontend-${ACCOUNT_ID}}"
DIST_COMMENT="University MIS SPA"

echo "==> Build frontend with REACT_APP_API_URL=$API_BASE"
cd "$ROOT/mis-frontend"
export REACT_APP_API_URL="$API_BASE"
npm ci
npm run build

echo "==> Ensure S3 bucket $S3_BUCKET"
if ! aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
  if [[ "$AWS_REGION" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION"
  else
    aws s3api create-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION"
  fi
fi

# Keep bucket private; CloudFront OAC will read it
aws s3api put-public-access-block --bucket "$S3_BUCKET" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo "==> Sync build/"
aws s3 sync build/ "s3://$S3_BUCKET" --delete \
  --cache-control "public,max-age=31536000,immutable" --exclude "index.html" --exclude "asset-manifest.json"
aws s3 cp build/index.html "s3://$S3_BUCKET/index.html" --cache-control "no-cache"
aws s3 cp build/asset-manifest.json "s3://$S3_BUCKET/asset-manifest.json" --cache-control "no-cache" 2>/dev/null || true

# OAC + CloudFront
OAC_NAME="mis-frontend-oac"
OAC_ID=$(aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='$OAC_NAME'].Id | [0]" --output text 2>/dev/null || echo "None")
if [[ -z "$OAC_ID" || "$OAC_ID" == "None" ]]; then
  OAC_ID=$(aws cloudfront create-origin-access-control --origin-access-control-config "{
    \"Name\": \"$OAC_NAME\",
    \"Description\": \"MIS frontend OAC\",
    \"SigningProtocol\": \"sigv4\",
    \"SigningBehavior\": \"always\",
    \"OriginAccessControlOriginType\": \"s3\"
  }" --query 'OriginAccessControl.Id' --output text)
fi
echo "==> OAC $OAC_ID"

EXISTING_DIST=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='$DIST_COMMENT'].Id | [0]" --output text 2>/dev/null || echo "None")

if [[ -z "$EXISTING_DIST" || "$EXISTING_DIST" == "None" ]]; then
  CALLER_REF="mis-frontend-$(date +%s)"
  cat > /tmp/cf-config.json <<EOF
{
  "CallerReference": "$CALLER_REF",
  "Comment": "$DIST_COMMENT",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "s3-mis-frontend",
        "DomainName": "${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com",
        "S3OriginConfig": { "OriginAccessIdentity": "" },
        "OriginAccessControlId": "$OAC_ID"
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-mis-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] } },
    "Compress": true,
    "ForwardedValues": { "QueryString": false, "Cookies": { "Forward": "none" } },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      { "ErrorCode": 403, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 0 },
      { "ErrorCode": 404, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 0 }
    ]
  }
}
EOF
  DIST_ID=$(aws cloudfront create-distribution --distribution-config file:///tmp/cf-config.json \
    --query 'Distribution.Id' --output text)
else
  DIST_ID="$EXISTING_DIST"
  echo "==> Reusing CloudFront distribution $DIST_ID"
fi

DOMAIN=$(aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName' --output text)
DIST_ARN=$(aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.ARN' --output text)

# Bucket policy for OAC
cat > /tmp/s3-oac-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalRead",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${S3_BUCKET}/*",
      "Condition": {
        "StringEquals": { "AWS:SourceArn": "${DIST_ARN}" }
      }
    }
  ]
}
EOF
aws s3api put-bucket-policy --bucket "$S3_BUCKET" --policy file:///tmp/s3-oac-policy.json

mkdir -p "$ROOT/infra/out"
cat > "$ROOT/infra/out/frontend.env" <<EOF
AWS_REGION=$AWS_REGION
S3_BUCKET=$S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID=$DIST_ID
CLOUDFRONT_DOMAIN=https://$DOMAIN
REACT_APP_API_URL=$API_BASE
EOF

echo "==> Wrote infra/out/frontend.env"
echo "    Site: https://$DOMAIN"
echo "    (CloudFront may take a few minutes to deploy globally)"

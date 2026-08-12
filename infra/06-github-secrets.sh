#!/usr/bin/env bash
# Print / optionally set GitHub Actions secrets from infra/out/*.env
# Requires: GitHub CLI (gh) authenticated with repo write access.
# Usage:
#   ./infra/06-github-secrets.sh           # print values to set manually
#   ./infra/06-github-secrets.sh --apply   # gh secret set (needs gh)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APPLY=false
[[ "${1:-}" == "--apply" ]] && APPLY=true

need() { [[ -f "$1" ]] || { echo "Missing $1 — run prior deploy steps first"; exit 1; }; }
need "$ROOT/infra/out/ecr.env"
need "$ROOT/infra/out/apprunner.env"
need "$ROOT/infra/out/frontend.env"

# shellcheck disable=SC1091
source "$ROOT/infra/out/ecr.env"
# shellcheck disable=SC1091
source "$ROOT/infra/out/apprunner.env"
# shellcheck disable=SC1091
source "$ROOT/infra/out/frontend.env"

cat <<EOF
GitHub repo secrets / variables to configure:

  Variable AWS_REGION = $AWS_REGION

  Secret ECR_REPOSITORY = $ECR_REPO
  Secret S3_BUCKET = $S3_BUCKET
  Secret CLOUDFRONT_DISTRIBUTION_ID = $CLOUDFRONT_DISTRIBUTION_ID
  Secret REACT_APP_API_URL = $REACT_APP_API_URL

  Secret AWS_ROLE_ARN = <create IAM OIDC role for GitHub Actions, or use access keys>
    Example trust for repo owner/name with OIDC provider token.actions.githubusercontent.com

EOF

if [[ "$APPLY" == true ]]; then
  if ! command -v gh >/dev/null; then
    echo "gh CLI not installed. Install from https://cli.github.com/ then re-run with --apply"
    exit 1
  fi
  gh variable set AWS_REGION --body "$AWS_REGION"
  gh secret set ECR_REPOSITORY --body "$ECR_REPO"
  gh secret set S3_BUCKET --body "$S3_BUCKET"
  gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "$CLOUDFRONT_DISTRIBUTION_ID"
  gh secret set REACT_APP_API_URL --body "$REACT_APP_API_URL"
  echo "==> Set ECR_REPOSITORY, S3_BUCKET, CLOUDFRONT_DISTRIBUTION_ID, REACT_APP_API_URL, AWS_REGION"
  echo "==> Still set AWS_ROLE_ARN manually (OIDC role ARN)."
fi

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

REACT_APP_API_URL="${REACT_APP_API_URL:-${API_BASE:-}}"
EC2_HOST="${EC2_HOST:-}"
if [[ -z "$EC2_HOST" && -n "${SERVICE_URL:-}" ]]; then
  EC2_HOST="${SERVICE_URL#http://}"
  EC2_HOST="${EC2_HOST#https://}"
  EC2_HOST="${EC2_HOST%%:*}"
fi
EC2_PEM="${EC2_PEM:-${EC2_SSH_KEY_FILE:-$HOME/Downloads/university-mis-api.pem}}"
ROLE_ARN="${AWS_ROLE_ARN:-}"
if [[ -z "$ROLE_ARN" && -f "$ROOT/infra/out/gha-role.arn" ]]; then
  ROLE_ARN="$(tr -d '[:space:]' < "$ROOT/infra/out/gha-role.arn")"
fi

cat <<EOF
GitHub repo secrets / variables to configure:

  Variable AWS_REGION = $AWS_REGION

  Secret ECR_REPOSITORY = $ECR_REPO
  Secret S3_BUCKET = $S3_BUCKET
  Secret REACT_APP_API_URL = $REACT_APP_API_URL
  Secret EC2_HOST = $EC2_HOST
  Secret EC2_SSH_KEY = <PEM contents from $EC2_PEM>
  Secret AWS_ROLE_ARN = ${ROLE_ARN:-<create IAM OIDC role GitHubActionsMisDeploy>}
  Secret CLOUDFRONT_DISTRIBUTION_ID = (omit unless real CloudFront ID; do not use n/a-*)

EOF

if [[ "$APPLY" == true ]]; then
  if ! command -v gh >/dev/null; then
    echo "gh CLI not installed. Install from https://cli.github.com/ then re-run with --apply"
    exit 1
  fi
  gh variable set AWS_REGION --body "$AWS_REGION"
  gh secret set ECR_REPOSITORY --body "$ECR_REPO"
  gh secret set S3_BUCKET --body "$S3_BUCKET"
  gh secret set REACT_APP_API_URL --body "$REACT_APP_API_URL"
  if [[ -n "$EC2_HOST" ]]; then
    gh secret set EC2_HOST --body "$EC2_HOST"
  fi
  if [[ -f "$EC2_PEM" ]]; then
    gh secret set EC2_SSH_KEY < "$EC2_PEM"
  else
    echo "WARN: PEM not found at $EC2_PEM — set EC2_SSH_KEY manually" >&2
  fi
  if [[ -n "$ROLE_ARN" ]]; then
    gh secret set AWS_ROLE_ARN --body "$ROLE_ARN"
  else
    echo "WARN: AWS_ROLE_ARN missing — set after creating GitHubActionsMisDeploy" >&2
  fi
  # Never push placeholder CloudFront IDs
  if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" && "$CLOUDFRONT_DISTRIBUTION_ID" != n/a* ]]; then
    gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "$CLOUDFRONT_DISTRIBUTION_ID"
  fi
  echo "==> Applied GitHub Actions secrets/variables for EC2 + S3 deploy path"
fi

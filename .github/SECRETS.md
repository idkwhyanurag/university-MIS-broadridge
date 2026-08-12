# GitHub Actions secrets for University MIS

After `./infra/deploy-all.sh` succeeds, configure the GitHub repository.

## Quick apply (needs [GitHub CLI](https://cli.github.com/))

```bash
gh auth login
./infra/06-github-secrets.sh --apply
```

Then create an IAM OIDC role for GitHub Actions and set:

```bash
gh secret set AWS_ROLE_ARN --body "arn:aws:iam::ACCOUNT_ID:role/GitHubActionsMisDeploy"
```

## Manual (GitHub → Settings → Secrets and variables → Actions)

| Type | Name | Value |
|------|------|--------|
| Variable | `AWS_REGION` | `us-east-1` |
| Secret | `ECR_REPOSITORY` | from `infra/out/ecr.env` → `ECR_REPO` |
| Secret | `S3_BUCKET` | from `infra/out/frontend.env` |
| Secret | `CLOUDFRONT_DISTRIBUTION_ID` | from `infra/out/frontend.env` |
| Secret | `REACT_APP_API_URL` | from `infra/out/frontend.env` / `apprunner.env` `API_BASE` |
| Secret | `AWS_ROLE_ARN` | IAM role trusting `token.actions.githubusercontent.com` |

Workflows: [`.github/workflows/backend.yml`](workflows/backend.yml), [`frontend.yml`](workflows/frontend.yml) on branches `main` and `Final-Product`.

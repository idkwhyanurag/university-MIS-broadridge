# GitHub Actions secrets for University MIS

After `./infra/deploy-all.sh` succeeds (EC2 path), configure the GitHub repository.

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
| Variable | `AWS_REGION` | `us-east-1` (ECR/RDS region; EC2 may be elsewhere) |
| Secret | `ECR_REPOSITORY` | from `infra/out/ecr.env` → `ECR_REPO` |
| Secret | `S3_BUCKET` | from `infra/out/frontend.env` |
| Secret | `REACT_APP_API_URL` | `http://<ElasticIP>:8080/api` (EC2 API; pin with EIP) |
| Secret | `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM user `github-actions-mis` (preferred on Free tier) |
| Secret | `AWS_ROLE_ARN` | Optional OIDC role; used only if access keys are unset |
| Secret | `EC2_HOST` | Elastic IP / public IP of the API instance |
| Secret | `EC2_SSH_KEY` | Full PEM private key contents (same key as `EC2_PEM`) |
| Secret | `CLOUDFRONT_DISTRIBUTION_ID` | **Optional.** Real CloudFront ID only. Omit or leave empty for S3 website; do **not** set `n/a-s3-website` |

### EC2 continuous deploy

`backend.yml` builds/pushes **linux/amd64** to ECR, then if `EC2_HOST` + `EC2_SSH_KEY` are set, SSHs to the host, pulls `:latest`, and restarts `mis-api` with the existing `/home/ec2-user/mis-api.env` (created by a one-time `./infra/07-deploy-ec2.sh`).

### Frontend

`frontend.yml` syncs to S3. CloudFront invalidation runs only when `CLOUDFRONT_DISTRIBUTION_ID` is set and does not start with `n/a`.

Workflows: [`.github/workflows/backend.yml`](workflows/backend.yml), [`frontend.yml`](workflows/frontend.yml) on branches `main` and `Final-Product`.

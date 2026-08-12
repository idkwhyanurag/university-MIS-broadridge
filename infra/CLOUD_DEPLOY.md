# Cloud deployment guide — University MIS

End state:

```
Users → CloudFront (HTTPS) → S3 (React SPA)
Users → App Runner (HTTPS) → RDS MySQL
```

## One-command deploy (after AWS CLI + Docker work)

```bash
# From repo root, on your machine (not inside a restricted sandbox):
aws configure          # once
aws sts get-caller-identity
docker info            # Docker Desktop must be running

chmod +x infra/*.sh
./infra/deploy-all.sh
```

Artifacts (passwords included — gitignored) land in `infra/out/`:

| File | Contents |
|------|----------|
| `rds.env` | DB endpoint, user, password, JDBC URL |
| `ecr.env` | ECR image URI |
| `apprunner.env` | API URL, JWT secret |
| `frontend.env` | CloudFront URL, S3 bucket |

## Manual step order (same as scripts)

1. `./infra/01-create-rds.sh` — wait until RDS available  
2. `./infra/02-push-ecr.sh` — build/push Docker image  
3. `./infra/03-create-apprunner.sh` — API service + health/login smoke  
4. `./infra/04-deploy-frontend.sh` — build SPA with production `REACT_APP_API_URL`, S3 + CloudFront  
5. `./infra/05-update-cors.sh` — set `CORS_ORIGINS` to CloudFront URL  
6. Open CloudFront URL → login `admin@mis.edu` / `Admin@123`  
7. `./infra/06-github-secrets.sh` (print) or `--apply` with `gh` authenticated  

## GitHub Actions

After deploy, set secrets listed by `06-github-secrets.sh`, plus `AWS_ROLE_ARN` for OIDC.
Pushes to `Final-Product` / `main` run [`.github/workflows/backend.yml`](../.github/workflows/backend.yml) and [`frontend.yml`](../.github/workflows/frontend.yml).

## Local still works

```bash
docker compose up --build -d
cd mis-frontend && npm start
```

## Cost tip

Delete App Runner + RDS when not demoing to avoid charges.

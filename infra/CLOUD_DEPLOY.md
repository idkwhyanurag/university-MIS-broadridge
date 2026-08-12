# Cloud deployment guide — University MIS

Default path (works on Free plan without App Runner):

```
Users → CloudFront (or S3 website) → React SPA
Users → EC2 :8080 (Docker mis-api) → RDS MySQL
```

App Runner (`./infra/03-create-apprunner.sh`) is **optional** and often returns
`SubscriptionRequiredException` on restricted Free-plan accounts. Prefer EC2 (`07`).

## One-command deploy (after AWS CLI + Docker work)

```bash
# From repo root:
aws configure          # once
aws sts get-caller-identity
docker info            # Docker Desktop must be running

chmod +x infra/*.sh
EC2_HOST=<elastic-ip-or-public-ip> \
EC2_PEM=~/Downloads/university-mis-api.pem \
  ./infra/deploy-all.sh
```

Artifacts (passwords included — gitignored) land in `infra/out/`:

| File | Contents |
|------|----------|
| `rds.env` | DB endpoint, user, password, **single-quoted** `DB_URL` |
| `ecr.env` | ECR image URI (linux/amd64) |
| `apprunner.env` | API URL / JWT (written by `07` for EC2, or by `03` for App Runner) |
| `mis-api.env` | Docker `--env-file` copied to the EC2 host |
| `frontend.env` | CloudFront/S3 URL, bucket |

## Manual step order (EC2-first)

1. `./infra/01-create-rds.sh` — wait until RDS available  
2. `./infra/02-push-ecr.sh` — build/push **linux/amd64** image  
3. `EC2_HOST=<ip> EC2_PEM=~/key.pem ./infra/07-deploy-ec2.sh` — pull & run `mis-api` on `:8080`  
4. `./infra/04-deploy-frontend.sh` — build SPA with production `REACT_APP_API_URL`, S3 + CloudFront  
5. CORS update — re-run `07` with `CORS_ORIGINS` set to the site origin (e.g. CloudFront URL), or let `deploy-all.sh` do it  
6. Open the frontend URL → login `admin@mis.edu` / `Admin@123`  
7. `./infra/06-github-secrets.sh` (print) or `--apply` with `gh` authenticated  

Optional (paid / unlocked App Runner only): `./infra/03-create-apprunner.sh` then `./infra/05-update-cors.sh`.

### `rds.env` quoting

`DB_URL` **must** be single-quoted in `infra/out/rds.env` so `source` keeps JDBC `&` query params. Script `01` writes it that way. If you hand-edit, use:

```bash
DB_URL='jdbc:mysql://host:3306/university_mis?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC'
```

## GitHub Actions

After deploy, set secrets listed by `06-github-secrets.sh`, plus `AWS_ROLE_ARN` for OIDC,
and for EC2 CD: `EC2_HOST`, `EC2_SSH_KEY` (PEM contents). Set `REACT_APP_API_URL` to
`http://<ElasticIP>:8080/api`. CloudFront invalidation is optional — omit
`CLOUDFRONT_DISTRIBUTION_ID` or leave it empty (do not use placeholder `n/a-…` values).

Pushes to `Final-Product` / `main` run [`.github/workflows/backend.yml`](../.github/workflows/backend.yml)
and [`frontend.yml`](../.github/workflows/frontend.yml).

## Local still works

```bash
docker compose up --build -d
cd mis-frontend && npm start
```

## Cost tip

Stop the EC2 instance and delete RDS when not demoing to avoid charges.

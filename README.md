# University Management Information System (University MIS)

Full-stack university MIS: **unified Spring Boot API** + **React** frontend, with JWT auth and a practical AWS deployment path (S3/CloudFront + App Runner + RDS).

## Architecture

```
Browser → React (mis-frontend)
              ↓ JWT Bearer
         Spring Boot (single API :8080)
              ↓
           MySQL (university_mis)
```

Legacy epic folders (`mis-backend-epic2|3|4`) are archived source from the team split. **Run only the root backend.**

## Tech stack

| Layer | Stack |
|-------|--------|
| Backend | Java 21, Spring Boot 4.1, Security + JWT, JPA, MySQL |
| Frontend | React (CRA), React Router, Axios |
| Local | Docker Compose (MySQL + API) |
| Cloud | S3 + CloudFront, App Runner (ECR image), RDS MySQL |

## Quick start (local)

### 1. Backend + database

```bash
docker compose up --build -d
```

API: http://localhost:8080  
Health: http://localhost:8080/actuator/health

### Demo profile (no MySQL)

If Docker/MySQL are not available:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=demo
```

Uses in-memory H2. Seed users still apply.

If port 8080 is already taken by an old Java process, either kill it or run:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=demo -Dspring-boot.run.arguments=--server.port=8083
```

Then point the frontend at it:

```bash
cd mis-frontend
REACT_APP_API_URL=http://localhost:8083/api npm start
# or: REACT_APP_API_URL=http://localhost:8083/api npm run build && python3 ../scripts/serve-frontend.py
```

### 2. Frontend

```bash
cd mis-frontend
npm install
npm start
```

Open http://localhost:3000 — you will be redirected to login.

### Demo users (seeded on first boot)

| Email | Password | Role |
|-------|----------|------|
| admin@mis.edu | Admin@123 | ADMIN |
| faculty@mis.edu | Faculty@123 | FACULTY |
| student@mis.edu | Student@123 | STUDENT |

## Main API surface

All routes under `/api` require `Authorization: Bearer <token>` except `POST /api/auth/login`.

- Auth: `/api/auth/login`, `/api/auth/me`, `/api/auth/register` (ADMIN)
- Academics: students, admissions, attendance, courses, registrations, timetable, departments, faculty, subjects, examinations, grades
- Hostel & fees: `/api/fees`, `/api/hostels`, `/api/rooms`
- Comms: notifications, announcements, events, analytics
- Resources: `/api/library/books`, `/api/inventory`

## Environment variables (backend)

| Variable | Default | Purpose |
|----------|---------|---------|
| `DB_URL` | localhost MySQL URL | JDBC URL |
| `DB_USER` / `DB_PASSWORD` | root / root | DB credentials |
| `JWT_SECRET` | (dev default) | HS256 signing key (change in prod) |
| `CORS_ORIGINS` | localhost:3000,5173 | Comma-separated origins |
| `PORT` | 8080 | HTTP port |

Frontend: `REACT_APP_API_URL` (default `http://localhost:8080/api`).

## AWS deployment (practical)

See [`infra/deploy.sh`](infra/deploy.sh):

1. Build/push backend image to **ECR**
2. Run container on **App Runner** with RDS env vars + health `/actuator/health`
3. Build React with production `REACT_APP_API_URL` → sync to **S3**
4. Put **CloudFront** in front of S3 (SPA fallback to `index.html`)
5. Set `CORS_ORIGINS` to the CloudFront URL

GitHub Actions: [`.github/workflows/backend.yml`](.github/workflows/backend.yml) and [`frontend.yml`](.github/workflows/frontend.yml). Configure secrets `AWS_ROLE_ARN`, `AWS_REGION`, `ECR_REPOSITORY`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `REACT_APP_API_URL` when ready to deploy.

## Project layout

```
├── src/                    # Unified Spring Boot API
├── mis-frontend/           # React SPA
├── docker-compose.yml
├── Dockerfile
├── infra/deploy.sh
├── mis-backend-epic2|3|4/  # Legacy epic archives (do not run)
└── mis-frontend-stage2/    # Incomplete snapshot (ignore)
```

## License / course

University MIS Broadridge team project.

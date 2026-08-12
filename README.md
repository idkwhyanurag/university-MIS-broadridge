# University Management Information System (University MIS)

Full-stack **University MIS** for academic and administrative operations: a unified **Spring Boot** REST API, a **React** single-page app, JWT authentication with role-based navigation, MySQL persistence, and an AWS cloud deployment path.

| | |
|--|--|
| **Repository** | `university-MIS-broadridge` |
| **Primary branch** | `Final-Product` |
| **Team** | Broadridge university project |

---

## Table of contents

1. [What this app does](#what-this-app-does)
2. [Architecture](#architecture)
3. [Tech stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Quick start (local) — recommended](#quick-start-local--recommended)
6. [Demo login accounts](#demo-login-accounts)
7. [Alternative local runs](#alternative-local-runs)
8. [Project structure](#project-structure)
9. [Features by module](#features-by-module)
10. [API overview](#api-overview)
11. [Environment variables](#environment-variables)
12. [Cloud deployment (AWS)](#cloud-deployment-aws)
13. [Continuous deployment (GitHub Actions)](#continuous-deployment-github-actions)
14. [Troubleshooting](#troubleshooting)
15. [Team conventions](#team-conventions)

---

## What this app does

University MIS is an end-to-end campus operations console. After login, users see a role-aware sidebar and can manage:

- **Academics** — students, admissions, attendance, courses, timetable, departments, faculty, subjects, grades, examinations  
- **Hostel & fees** — hostel allocations, rooms, fee records  
- **Resources** — library books, campus inventory  
- **Communication** — notifications, announcements, events, analytics  
- **Account** — profile and (admin) settings  

The frontend talks only to the backend over HTTPS/HTTP JSON APIs under `/api`, using a JWT `Authorization: Bearer <token>` header after login.

---

## Architecture

```
┌─────────────┐     JWT + JSON      ┌──────────────────┐      JDBC      ┌────────────┐
│  React SPA  │ ──────────────────► │  Spring Boot API │ ─────────────► │   MySQL    │
│ mis-frontend│                     │  :8080  /api/*   │                │university_mis│
└─────────────┘                     └──────────────────┘                └────────────┘
```

**Local:** Docker Compose runs MySQL + the API; the React app runs with `npm start` (or a static build).

**Cloud (current team deploy):**

```
Browser → S3 static website (React)
Browser → EC2 :8080 (Docker API image from ECR) → RDS MySQL
```

App Runner is optional and often blocked on AWS Free-plan accounts. Prefer the EC2 path documented in [`infra/CLOUD_DEPLOY.md`](infra/CLOUD_DEPLOY.md).

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | Java **21**, Spring Boot **4.1**, Spring Security + JWT, Spring Data JPA |
| Database | MySQL **8** (local Docker / AWS RDS); H2 for `demo` profile |
| Frontend | React (Create React App), React Router, Axios |
| Auth | JWT (HS256); roles `ADMIN`, `FACULTY`, `STUDENT` (UI also uses `admin` / `teacher` / `student`) |
| Containers | Docker, Docker Compose |
| Cloud | Amazon ECR, EC2, RDS, S3 (optional CloudFront), GitHub Actions |

---

## Prerequisites

Install these on your machine before the first run:

| Tool | Version / notes | Check |
|------|-----------------|--------|
| **Git** | Any recent | `git --version` |
| **Docker Desktop** | Running (whale icon in menu bar) | `docker info` |
| **Node.js** | **20 LTS** recommended | `node -v` / `npm -v` |
| **Java / Maven** | Only if you run the API *without* Docker (`mvn`) | `java -version` / `mvn -v` |
| **AWS CLI** | Only for cloud deploy | `aws --version` |

Clone the repo:

```bash
git clone https://github.com/idkwhyanurag/university-MIS-broadridge.git
cd university-MIS-broadridge
git checkout Final-Product
```

---

## Quick start (local) — recommended

This is the path every teammate should use first.

### 1. Start API + MySQL

From the **repository root**:

```bash
docker compose up --build -d
```

Wait until containers are healthy:

```bash
docker compose ps
curl -s http://localhost:8080/actuator/health
```

You want `"status":"UP"` (and DB component UP).

| Service | URL |
|---------|-----|
| API | http://localhost:8080 |
| Health | http://localhost:8080/actuator/health |
| MySQL | `localhost:3306` (user `root` / password `root`, DB `university_mis`) |

### 2. Start the React UI

```bash
cd mis-frontend
npm install
REACT_APP_API_URL=http://localhost:8080/api npm start
```

- Default CRA port: **http://localhost:3000**  
- If 3000 is busy, CRA may offer another port, or force one:

```bash
PORT=3002 REACT_APP_API_URL=http://localhost:8080/api npm start
```

Open the printed Local URL → you should land on the **Login** page.

### 3. Log in

Use a demo account from the table below. After login you see the dashboard and role-filtered navigation.

### Stop local services

```bash
# Frontend: Ctrl+C in the npm terminal

# Backend + MySQL:
cd /path/to/university-MIS-broadridge
docker compose down
# Add -v to also wipe the MySQL volume (fresh DB next time):
# docker compose down -v
```

---

## Demo login accounts

Seeded automatically on first backend boot:

| Email | Password | Role | Typical access |
|-------|----------|------|----------------|
| `admin@mis.edu` | `Admin@123` | ADMIN | Full CRUD / settings |
| `faculty@mis.edu` | `Faculty@123` | FACULTY | Teaching / academics (limited admin) |
| `student@mis.edu` | `Student@123` | STUDENT | Student-facing views |

> These credentials are for **demo / coursework only**. Change secrets before any real production use.

---

## Alternative local runs

### A. Backend without Docker (H2 in-memory)

Useful when Docker is unavailable:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=demo
```

API still on http://localhost:8080. Data resets when the process stops. Seed users still apply.

If **8080 is already in use**:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=demo -Dspring-boot.run.arguments=--server.port=8083
```

Point the frontend at the new port:

```bash
cd mis-frontend
REACT_APP_API_URL=http://localhost:8083/api npm start
```

### B. Frontend static build (no CRA dev server)

```bash
cd mis-frontend
REACT_APP_API_URL=http://localhost:8080/api npm run build
python3 ../scripts/serve-frontend.py
```

Serve script listens on a local port (see script output). Ensure `CORS_ORIGINS` on the API includes that origin (Docker Compose already allows common localhost ports).

### C. Port already taken

| Symptom | Fix |
|---------|-----|
| `Bind for 0.0.0.0:8080 failed` | Stop old containers: `docker compose down`, or find PID: `lsof -iTCP:8080 -sTCP:LISTEN` |
| `Something is already running on port 3000` | Use `PORT=3002 ... npm start` |
| Stale UI / wrong API | Hard refresh; confirm `REACT_APP_API_URL` matches the running API |

---

## Project structure

```
university-MIS-broadridge/
├── src/                          # ★ Unified Spring Boot backend (USE THIS)
│   └── main/java/com/mis/mis_backend/
│       ├── auth/                 # Login, JWT, users, roles
│       ├── student/, admission/, attendance/, …
│       ├── fee/, hostel/, library/, inventory/
│       ├── announcement/, event/, notification/, analytics/
│       └── config/               # Security, CORS, data seeder
├── mis-frontend/                 # ★ React SPA (USE THIS)
│   └── src/
│       ├── pages/                # Feature screens
│       ├── components/           # Sidebar, topbar, shared UI
│       ├── services/             # Axios API clients
│       ├── context/              # AuthContext
│       └── config/navigation.js  # Role-aware nav
├── docker-compose.yml            # Local MySQL + API
├── Dockerfile                    # Production API image
├── infra/                        # AWS deploy scripts
│   ├── CLOUD_DEPLOY.md
│   ├── deploy-all.sh             # EC2-first full pipeline
│   ├── 01-create-rds.sh … 07-deploy-ec2.sh
│   └── out/                      # Generated *.env (gitignored — secrets)
├── .github/workflows/            # CI/CD (backend + frontend)
├── mis-backend-epic2|3|4/        # Legacy archives — do NOT run
└── mis-frontend-stage2/          # Incomplete snapshot — ignore
```

**Important:** Run only the **root** backend (`src/`) and **`mis-frontend/`**. Epic folders are historical team splits kept for reference.

---

## Features by module

| Area | Screens / capabilities |
|------|-------------------------|
| Auth | Login (show/hide password), JWT session, logout, role-based menu |
| Dashboard | Landing overview after login |
| Students / Admissions | Student records; admission workflows (admin) |
| Attendance / Courses / Timetable | Academic scheduling and tracking |
| Departments / Faculty / Subjects | Org structure and catalog |
| Grades / Examinations | Assessment records |
| Hostel / Rooms / Fees | Housing and fee management |
| Library / Inventory | Books and campus assets |
| Notifications / Announcements / Events | Campus communications |
| Analytics | Summary / risk-style views (staff roles) |
| Profile / Settings | Account info; admin settings |

Navigation visibility is controlled in [`mis-frontend/src/config/navigation.js`](mis-frontend/src/config/navigation.js) via per-item `roles`.

---

## API overview

Base path: **`/api`**.

| Rule | Detail |
|------|--------|
| Public | `POST /api/auth/login` |
| Authenticated | All other `/api/**` routes need `Authorization: Bearer <jwt>` |
| Admin-only examples | User register, some settings / destructive ops |

**Grouped endpoints (representative):**

- **Auth:** `/api/auth/login`, `/api/auth/me`, `/api/auth/register`
- **Academics:** students, admissions, attendance, courses, registrations, timetable, departments, faculty, subjects, examinations, grades
- **Hostel & fees:** `/api/fees`, `/api/hostels`, `/api/rooms`
- **Comms:** notifications, announcements, events, analytics
- **Resources:** `/api/library/books`, `/api/inventory`

Health (no auth): `GET /actuator/health`

---

## Environment variables

### Backend

| Variable | Local Docker default | Purpose |
|----------|----------------------|---------|
| `DB_URL` | JDBC URL to Compose MySQL | Datasource |
| `DB_USER` / `DB_PASSWORD` | `root` / `root` | DB credentials |
| `JWT_SECRET` | Dev default in Compose | Token signing — **change in cloud** |
| `CORS_ORIGINS` | localhost:3000–3010,5173 | Allowed browser origins (comma-separated) |
| `PORT` | `8080` | HTTP listen port |

### Frontend (build / start time)

| Variable | Example | Purpose |
|----------|---------|---------|
| `REACT_APP_API_URL` | `http://localhost:8080/api` | Axios base URL for the API |

CRA bakes `REACT_APP_*` in at **build/start** time. Changing the API URL requires restarting `npm start` or rebuilding.

---

## Cloud deployment (AWS)

Detailed steps: **[`infra/CLOUD_DEPLOY.md`](infra/CLOUD_DEPLOY.md)**.

### Current live demo (team)

| Layer | URL / resource |
|-------|----------------|
| **Website** | http://university-mis-frontend-667195563054.s3-website-us-east-1.amazonaws.com |
| **API** | http://13.238.88.81:8080 |
| **Health** | http://13.238.88.81:8080/actuator/health |
| **Region (RDS/ECR/S3)** | `us-east-1` |
| **API host region** | `ap-southeast-2` (EC2 + Elastic IP) |

Login with the same demo users as local.

> Elastic IP `13.238.88.81` should stay stable. If the API moves, update `REACT_APP_API_URL`, rebuild/sync the SPA, and GitHub secret `REACT_APP_API_URL`.

### One-command deploy (maintainers)

```bash
aws configure
aws sts get-caller-identity
docker info

chmod +x infra/*.sh
EC2_HOST=<elastic-ip> \
EC2_PEM=~/path/to/key.pem \
  ./infra/deploy-all.sh
```

Pipeline: **RDS → ECR (linux/amd64) → EC2 `mis-api` → S3 frontend → CORS**.

Generated files under `infra/out/` are **gitignored** (passwords). Never commit them.

### Cost tip

Stop the EC2 instance and delete/stop RDS when not demoing to limit AWS charges.

---

## Continuous deployment (GitHub Actions)

On push to **`Final-Product`** or **`main`**:

| Workflow | What it does |
|----------|----------------|
| [`.github/workflows/backend.yml`](.github/workflows/backend.yml) | Maven build; push **linux/amd64** image to ECR; SSH to EC2 and restart `mis-api` |
| [`.github/workflows/frontend.yml`](.github/workflows/frontend.yml) | `npm` build with `REACT_APP_API_URL`; sync to S3 |

Secrets setup: [`.github/SECRETS.md`](.github/SECRETS.md) and `./infra/06-github-secrets.sh --apply` (requires `gh auth login`).

Free-tier note: this project may use IAM access keys (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) when OIDC assume-role is unavailable.

---

## Troubleshooting

| Problem | Likely cause | What to do |
|---------|--------------|------------|
| Frontend loads but login fails / Network Error | API down or wrong `REACT_APP_API_URL` | `curl localhost:8080/actuator/health`; restart frontend with correct URL |
| CORS error in browser console | Origin not in `CORS_ORIGINS` | Add your UI origin (e.g. `http://localhost:3002`) to Compose/`CORS_ORIGINS` and recreate backend |
| Docker build fails on Apple Silicon for EC2 | Image must be amd64 | Use `infra/02-push-ecr.sh` (buildx `linux/amd64`) |
| `InvalidClientTokenId` (AWS) | Bad/old access keys or deactivated account | Recreate IAM keys; `aws sts get-caller-identity` |
| Empty curl to an old EC2 IP | Instance got a new public IP | Use Elastic IP; update SPA + secrets |
| `Access denied for user 'misadmin'` | RDS password ≠ `rds.env` | Reset master password to match `infra/out/rds.env`, restart container |
| App Runner `SubscriptionRequiredException` | Free plan restriction | Use EC2 path (`07-deploy-ec2.sh`), not App Runner |
| Seed users missing | DB volume from older run | `docker compose down -v && docker compose up --build -d` |

---

## Team conventions

1. **Develop on `Final-Product`** (or a feature branch merged into it).  
2. **Do not run** `mis-backend-epic*` or `mis-frontend-stage2` for day-to-day work.  
3. Prefer **Docker Compose** for the API so everyone shares the same MySQL setup.  
4. Never commit `infra/out/*.env`, `.pem` files, or real AWS secrets.  
5. After cloud URL changes, update GitHub `REACT_APP_API_URL` and redeploy the frontend.  
6. For questions about AWS scripts, read [`infra/CLOUD_DEPLOY.md`](infra/CLOUD_DEPLOY.md) first.

---

## License / course

University MIS — Broadridge team coursework project.

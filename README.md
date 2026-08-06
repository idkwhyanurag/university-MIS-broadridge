# mis-backend-epic1

Owner: Person 1 — Student Lifecycle Management (Epic 1)

## What's inside
- `admission/` — application intake and status workflow (APPLIED → UNDER_REVIEW →
  APPROVED/REJECTED → ENROLLED). `AdmissionService.enroll()` creates the matching
  `Student` record directly once an applicant is approved.
- `student/` — student profile and academic record (department, semester, CGPA, status).
- `course/` — course catalog, student course registrations, and the class timetable.
- `attendance/` — daily attendance marking per student/course, plus
  `AttendanceService.getAttendancePercentage()` for other modules (e.g. Person 4/5's
  risk-check) to call directly instead of accepting it as raw input.

## Running locally

1. Copy the properties template:
   ```
   cp src/main/resources/application-example.properties src/main/resources/application.properties
   ```
2. Fill in your local MySQL credentials in `application.properties`. This file is
   gitignored — never commit real credentials.
3. Make sure MySQL is running and the `university_mis` database exists, OR use
   the shared `docker-compose.yml` (see below) to spin up MySQL automatically.
4. Run:
   ```
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

## Running via Docker

From the repo root, once `docker-compose.yml` includes the snippet from
`shared-config/docker-compose-snippet.yml`:
```
docker compose up --build
```

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | /api/students | Create a student directly (bypassing admissions) |
| GET | /api/students | List all students |
| GET | /api/students/{id} | Get one student |
| PUT | /api/students/{id} | Update student profile/academic info |
| DELETE | /api/students/{id} | Delete a student |
| POST | /api/admissions | Submit a new application |
| GET | /api/admissions | List all applications |
| GET | /api/admissions/{id} | Get one application |
| PATCH | /api/admissions/{id}/status | Update status (APPLIED/UNDER_REVIEW/APPROVED/REJECTED) |
| POST | /api/admissions/{id}/enroll | Convert an APPROVED applicant into a Student |
| DELETE | /api/admissions/{id} | Delete an application |
| POST | /api/courses | Create a course |
| GET | /api/courses | List all courses |
| GET | /api/courses/{id} | Get one course |
| DELETE | /api/courses/{id} | Delete a course |
| POST | /api/registrations | Register a student for a course |
| GET | /api/registrations/student/{studentId} | A student's registrations |
| GET | /api/registrations/course/{courseId} | A course's roster |
| PATCH | /api/registrations/{id}/status | REGISTERED / DROPPED / COMPLETED |
| POST | /api/timetable | Add a class slot for a course |
| GET | /api/timetable | List all timetable entries |
| GET | /api/timetable/course/{courseId} | Get a course's schedule |
| POST | /api/attendance | Mark attendance (upserts per student/course/date) |
| GET | /api/attendance/student/{studentId} | A student's full attendance history |
| GET | /api/attendance/course/{courseId}?date=YYYY-MM-DD | Attendance for a course on a day |
| GET | /api/attendance/percentage?studentId=1&courseId=2 | Attendance % for at-risk reporting |

## Integration points with teammates (agree on these in Sprint 1)
- **Person 1 (auth)**: once JWT auth exists, `AdmissionController.updateStatus()`
  should check the caller's role instead of trusting the request body — same gap
  Person 4/5 flagged for their `AnnouncementController`.
- **Person 4/5 (Analytics)**: their `RiskCheckRequest` currently accepts
  `attendancePercentage` as raw input with a note that it should eventually be
  fetched from this module — call `AttendanceService.getAttendancePercentage()`
  (inject it as a dependency, or hit `/api/attendance/percentage`) instead.
- **Fee module (Epic 3)**: will need `studentId` from this module as a foreign
  key reference once it's built.
- **Port conflict to resolve as a team**: this module and Person 4/5's module
  both default to port 8080 and both docker-compose snippets map host port 8080.
  Either agree on distinct host ports per service, or plan to merge into a single
  Spring Boot app before deployment.

## Not yet implemented (flagging for team awareness)
- No global exception handler — same as Person 4/5's module, `IllegalArgumentException`
  (not found) and `IllegalStateException` (bad state transitions) currently bubble up
  as Spring's default error response rather than a clean custom one. Worth the team
  agreeing on one shared approach before merging everyone's modules together.
- Pagination on list endpoints.

## Tests
```
mvn test
```

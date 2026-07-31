# mis-backend-epic4

Owner: Person 4 — Communication & Collaboration (Epic 4) + Analytics & Compliance (Epic 5)

## What's inside
- `notification/` — in-app + email notifications. Other modules call
  `NotificationService.sendNotification(recipientId, message, type)` directly
  to trigger notifications (e.g. "fee due", "grade published").
- `announcement/` — role-gated announcement board (STUDENT / FACULTY / ALL).
- `event/` — calendar events, filterable by month, plus an "upcoming" feed.
- `analytics/` — `/api/analytics/summary` aggregates counts from this module;
  `/api/analytics/risk-check` is the baseline at-risk-student rule.

## Running locally

1. Copy the properties template:
   ```
   cp src/main/resources/application-example.properties src/main/resources/application.properties
   ```
2. Fill in your local MySQL credentials and (optional) Mailtrap credentials in
   `application.properties`. This file is gitignored — never commit real credentials.
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
| POST | /api/notifications | Send a notification |
| GET | /api/notifications/{userId} | List a user's notifications |
| PUT | /api/notifications/{id}/read | Mark as read |
| POST | /api/announcements | Post an announcement |
| GET | /api/announcements?role=STUDENT | List announcements for a role |
| DELETE | /api/announcements/{id} | Delete an announcement |
| POST | /api/events | Create an event |
| GET | /api/events?year=2026&month=8 | Get events for a month |
| GET | /api/events/upcoming | Get upcoming events |
| GET | /api/analytics/summary | Basic aggregated counts |
| POST | /api/analytics/risk-check | Rule-based at-risk-student check |

## Integration points with teammates (agree on these in Sprint 1)
- **Person 1 (auth)**: once JWT auth exists, `AnnouncementController.create()`
  should check the caller's role instead of trusting the request body, and
  `NotificationService.resolveEmailForUser()` should call the real user lookup
  instead of the stub.
- **Person 1/2/3**: when something notification-worthy happens in their module
  (grade published, fee due, course reg confirmed), they call
  `notificationService.sendNotification(userId, message, NotificationType.APP)`
  directly (inject `NotificationService` as a dependency in their service).
- **Analytics summary**: once Person 1/2/3 expose their own summary endpoints,
  call them from `AnalyticsController.summary()` (via `RestTemplate`/`WebClient`)
  and merge into one response.

## Tests
```
mvn test
```

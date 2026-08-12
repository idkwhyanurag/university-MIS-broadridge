# 🎓 University Management Information System (University MIS)

A modern, full-stack **University Management Information System (MIS)** built using **Spring Boot**, **React.js**, and **MySQL**. The project is designed to streamline academic and administrative operations within a university through a modular architecture developed across multiple epics.

---

## 📌 Project Overview

The University MIS provides a centralized platform for managing students, admissions, academics, faculty, hostel facilities, fees, library resources, notifications, events, and institutional analytics.

The system follows a **modular architecture**, where each major feature set is developed as an independent backend module (Epic) and integrated into a unified frontend.

---

## ✨ Features

### 🎓 Student & Academic Management
- Student Registration
- Student Management
- Admission Processing
- Course Registration
- Attendance Management
- Timetable Management
- Course Management

### 👨‍🏫 Faculty & Department Management
- Department Management
- Faculty Management
- Subject Management
- Grade Management
- Examination Management

### 🏠 Hostel & Finance
- Hostel Room Management
- Hostel Allocation
- Fee Management

### 📚 Library Management
- Book Management
- Book Issue & Return

### 📢 Communication
- Notifications
- Announcement Board
- Event Calendar

### 📊 Analytics Dashboard
- Total Notifications
- Total Announcements
- Upcoming Events
- Institutional Summary

---

# 🏗 Project Architecture

```
University-MIS
│
├── src/                     # Epic 1 Backend
│
├── mis-backend-epic2/       # Academic Management
│
├── mis-backend-epic3/       # Hostel & Fee Management
│
├── mis-backend-epic4/       # Library, Notifications, Events, Analytics
│
└── mis-frontend/            # React Frontend
```

---

# 🛠 Tech Stack

## Backend

- Java 21
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- Maven
- MySQL

## Frontend

- React.js
- Axios
- CSS3

## Database

- MySQL

## Version Control

- Git
- GitHub

---

# 📂 Epic Breakdown

## ✅ Epic 1 — Student Information Management

Features

- Student CRUD
- Admissions
- Attendance
- Course Registration
- Timetable
- Course Management

---

## ✅ Epic 2 — Academic Administration

Features

- Department Management
- Faculty Management
- Subjects
- Grades
- Examination Management

---

## ✅ Epic 3 — Hostel & Finance

Features

- Hostel Rooms
- Hostel Allocation
- Fee Management

---

## ✅ Epic 4 — Campus Services & Communication

Features

- Library Management
- Inventory Management
- Notifications
- Announcement Board
- Event Calendar
- Analytics Dashboard

---

# 📡 REST APIs

## Student

```
POST    /students
GET     /students
PUT     /students/{id}
DELETE  /students/{id}
```

## Admission

```
POST    /admissions
GET     /admissions
PUT     /admissions/{id}
```

## Attendance

```
POST    /attendance
GET     /attendance
```

## Department

```
POST    /departments
GET     /departments
PUT     /departments/{id}
DELETE  /departments/{id}
```

## Faculty

```
POST    /faculty
GET     /faculty
```

## Hostel

```
POST    /hostel
GET     /hostel
```

## Fee

```
POST    /fees
GET     /fees
```

## Library

```
POST    /books
GET     /books
```

## Notifications

```
POST    /api/notifications

GET     /api/notifications/{userId}

PUT     /api/notifications/{id}/read
```

## Announcements

```
POST    /api/announcements

GET     /api/announcements
```

## Events

```
POST    /api/events

GET     /api/events
```

## Analytics

```
GET     /api/analytics/summary
```

---

# 💻 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/idkwhyanurag/university-MIS-broadridge.git

cd university-MIS-broadridge
```

---

## 2. Configure Database

Create a MySQL database

```sql
CREATE DATABASE university_mis;
```

Copy

```
application-example.properties
```

to

```
application.properties
```

and update your local database credentials.

---

## 3. Run Backend

Example

```bash
cd mis-backend-epic4

./mvnw spring-boot:run
```

or

```bash
mvn spring-boot:run
```

Repeat similarly for other backend modules if required.

---

## 4. Run Frontend

```bash
cd mis-frontend

npm install

npm start
```

---

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:8080
```

---

# 📷 Screens

The application includes:

- Dashboard
- Student Management
- Admissions
- Attendance
- Departments
- Faculty
- Courses
- Hostel
- Fees
- Library
- Notifications
- Announcement Board
- Event Calendar
- Analytics Dashboard

---

# 🧪 Testing

Backend endpoints were verified using:

- Postman
- cURL
- Browser
- React Frontend Integration

---

# 🔒 Security Notes

Sensitive configuration files are intentionally excluded from version control.

The repository only contains:

```
application-example.properties
```

Developers should create their own:

```
application.properties
```

with local database credentials.

---

# 🚀 Future Improvements

- JWT Authentication
- Role-Based Access Control (RBAC)
- Email Notifications
- Password Encryption
- File Uploads
- Student Portal
- Faculty Portal
- Parent Portal
- Admin Dashboard
- Real-time Notifications
- Dark Mode
- Charts & Reports
- Docker Deployment
- CI/CD Pipeline
- Cloud Deployment (AWS / Azure)

---

# 👨‍💻 Contributors

- **Anurag Majumdar**
- **Ahinsha**
- **Lipra Routray**

---

# 📄 License

This project was developed as part of an academic full-stack software engineering project.

---

# ⭐ Acknowledgements

Built using

- Spring Boot
- React.js
- MySQL
- Maven
- GitHub

---

> **University MIS** aims to provide a scalable, modular, and user-friendly platform for efficient university administration by integrating academic, administrative, financial, and communication services into a single unified system.


## Local Database Setup (Team Standard)

This project uses a shared local dev database convention so the app
runs immediately after cloning, with zero config needed.

Run this once after installing MySQL:

```sql
CREATE DATABASE university_mis;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Anurag@1';
FLUSH PRIVILEGES;
```

`application.properties` in each backend module is intentionally
committed with these shared credentials — this database is local-only
(never exposed to the internet), so this is a team dev convention,
not a real secret.
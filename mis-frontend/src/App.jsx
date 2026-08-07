import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import PagePlaceholder from "./pages/PagePlaceholder";
import "./styles/global.css";

// Every route below renders PagePlaceholder until its real page
// is built in a later stage. Swap the element as each page ships.
const PLACEHOLDER_ROUTES = [
  ["/students", "Students"],
  ["/admissions", "Admissions"],
  ["/attendance", "Attendance"],
  ["/courses", "Courses"],
  ["/timetable", "Timetable"],
  ["/departments", "Departments"],
  ["/faculty", "Faculty"],
  ["/subjects", "Subjects"],
  ["/grades", "Grades"],
  ["/examinations", "Examinations"],
  ["/hostel", "Hostel"],
  ["/rooms", "Rooms"],
  ["/fees", "Fee Management"],
  ["/notifications", "Notifications"],
  ["/announcements", "Announcements"],
  ["/events", "Events"],
  ["/analytics", "Analytics"],
  ["/settings", "Settings"],
  ["/profile", "Profile"],
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          {PLACEHOLDER_ROUTES.map(([path, title]) => (
            <Route key={path} path={path} element={<PagePlaceholder title={title} />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

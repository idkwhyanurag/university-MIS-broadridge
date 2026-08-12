import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import PagePlaceholder from "./pages/PagePlaceholder";
import NotificationsPage from "./pages/NotificationsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import EventsPage from "./pages/EventsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import "./styles/global.css";

// Routes still on placeholders — one epic at a time gets wired
// in as its backend is confirmed and its page gets built.
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
  ["/settings", "Settings"],
  ["/profile", "Profile"],
];

export default function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            {PLACEHOLDER_ROUTES.map(([path, title]) => (
              <Route key={path} path={path} element={<PagePlaceholder title={title} />} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}

import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import NotificationsPage from "./pages/NotificationsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import EventsPage from "./pages/EventsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import StudentsPage from "./pages/StudentsPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import AttendancePage from "./pages/AttendancePage";
import CoursesPage from "./pages/CoursesPage";
import TimetablePage from "./pages/TimetablePage";
import DepartmentsPage from "./pages/DepartmentsPage";
import FacultyPage from "./pages/FacultyPage";
import SubjectsPage from "./pages/SubjectsPage";
import GradesPage from "./pages/GradesPage";
import ExaminationsPage from "./pages/ExaminationsPage";
import HostelPage from "./pages/HostelPage";
import RoomsPage from "./pages/RoomsPage";
import FeesPage from "./pages/FeesPage";
import LibraryPage from "./pages/LibraryPage";
import InventoryPage from "./pages/InventoryPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import "./styles/global.css";
import "./styles/crud.css";

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/examinations" element={<ExaminationsPage />} />
            <Route path="/hostel" element={<HostelPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/fees" element={<FeesPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

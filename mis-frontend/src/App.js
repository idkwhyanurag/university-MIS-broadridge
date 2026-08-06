import NotificationBell from "./components/NotificationBell";
import AnnouncementBoard from "./components/AnnouncementBoard";
import EventCalendar from "./components/EventCalendar";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  const currentUser = { id: 1, role: "STUDENT" };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>University MIS — Epic 4/5 Demo</h1>
      <NotificationBell userId={currentUser.id} />
      <hr />
      <AnnouncementBoard currentUser={currentUser} />
      <hr />
      <EventCalendar />
      <hr />
      <AnalyticsDashboard />
    </div>
  );
}

export default App;
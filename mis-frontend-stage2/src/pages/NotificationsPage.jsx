import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import "./NotificationsPage.css";

// Mock user id until real auth exists — same convention used
// across the app (see RoleContext.jsx).
const MOCK_USER_ID = 1;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    getNotifications(MOCK_USER_ID)
      .then((data) => {
        setNotifications(data);
        setError(null);
      })
      .catch(() => setError("Couldn't load notifications."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleMarkRead = (id) => {
    markAsRead(id).then(load);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Notifications</h1>

      {loading && <p className="muted">Loading...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <EmptyState title="No notifications yet" description="New notifications will appear here as they come in." />
      )}

      <div className="notification-list">
        {notifications.map((n) => (
          <Card tab="comms" key={n.id} className={n.read ? "" : "notification-unread"}>
            <div className="notification-row">
              <div>
                <p className="notification-message">{n.message}</p>
                <span className="notification-meta mono">
                  {n.type} &middot; {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              {!n.read && (
                <button className="mark-read-btn" onClick={() => handleMarkRead(n.id)}>
                  Mark as read
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

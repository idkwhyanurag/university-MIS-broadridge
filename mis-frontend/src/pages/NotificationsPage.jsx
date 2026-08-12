import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Loading from "../components/ui/Loading";
import { useAuth } from "../context/AuthContext";
import "./NotificationsPage.css";

export default function NotificationsPage() {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    if (!userId) return;
    setLoading(true);
    getNotifications(userId)
      .then((data) => {
        setNotifications(data);
        setError(null);
      })
      .catch(() => setError("Couldn't load notifications."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [userId]);

  const handleMarkRead = (id) => {
    markAsRead(id).then(load);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Notifications</h1>

      {loading && <Loading />}
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

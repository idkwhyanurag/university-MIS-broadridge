import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";

// Usage: <NotificationBell userId={currentUser.id} />
export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const loadNotifications = () => {
    getNotifications(userId)
      .then(setNotifications)
      .catch((err) => console.error("Failed to load notifications", err));
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id) => {
    markAsRead(id).then(loadNotifications);
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "2rem",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ddd",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {notifications.length === 0 && <p style={{ padding: "1rem" }}>No notifications.</p>}
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "0.75rem",
                borderBottom: "1px solid #eee",
                background: n.read ? "white" : "#f3f8ff",
              }}
            >
              <p style={{ margin: 0 }}>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
              {!n.read && (
                <div>
                  <button onClick={() => handleMarkRead(n.id)}>Mark as read</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

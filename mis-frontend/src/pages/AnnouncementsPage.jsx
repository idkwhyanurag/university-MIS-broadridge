import React, { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from "../services/announcementService";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import "./AnnouncementsPage.css";

const ROLE_TO_BACKEND = { student: "STUDENT", teacher: "FACULTY", admin: "ALL" };
const CAN_POST = { student: false, teacher: true, admin: true };

export default function AnnouncementsPage() {
  const { navRole, userId } = useAuth();
  const role = navRole || "student";
  const backendRole = ROLE_TO_BACKEND[role];
  const canPost = CAN_POST[role];

  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetRole, setTargetRole] = useState("ALL");
  const [error, setError] = useState(null);

  const load = () => {
    getAnnouncements(backendRole)
      .then((data) => {
        setAnnouncements(data);
        setError(null);
      })
      .catch(() => setError("Couldn't load announcements."));
  };

  useEffect(load, [backendRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAnnouncement(userId, title, body, targetRole).then(() => {
      setTitle("");
      setBody("");
      load();
    });
  };

  const handleDelete = (id) => {
    deleteAnnouncement(id).then(load);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Announcements</h1>

      {error && <p className="dashboard-error">{error}</p>}

      {canPost && (
        <Card tab="comms" title="Post an announcement" className="announcement-form-card">
          <form onSubmit={handleSubmit} className="announcement-form">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Write the announcement..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={3}
            />
            <div className="announcement-form-footer">
              <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                <option value="ALL">Everyone</option>
                <option value="STUDENT">Students only</option>
                <option value="FACULTY">Faculty only</option>
              </select>
              <button type="submit" className="post-btn">Post announcement</button>
            </div>
          </form>
        </Card>
      )}

      {announcements.length === 0 && !error && (
        <EmptyState title="No announcements yet" description="Announcements posted here will show up for everyone in their target audience." />
      )}

      <div className="announcement-list">
        {announcements.map((a) => (
          <Card tab="comms" key={a.id}>
            <div className="announcement-header">
              <h3>{a.title}</h3>
              {canPost && (
                <button className="delete-btn" onClick={() => handleDelete(a.id)} aria-label="Delete announcement">
                  Delete
                </button>
              )}
            </div>
            <p className="announcement-body">{a.body}</p>
            <span className="notification-meta mono">{new Date(a.createdAt).toLocaleString()}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

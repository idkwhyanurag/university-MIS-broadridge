import React, { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from "../services/announcementService";

// Usage: <AnnouncementBoard currentUser={{ id: 1, role: "FACULTY" }} />
export default function AnnouncementBoard({ currentUser }) {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetRole, setTargetRole] = useState("ALL");

  const canPost = currentUser.role === "FACULTY" || currentUser.role === "ADMIN";

  const loadAnnouncements = () => {
    getAnnouncements(currentUser.role).then(setAnnouncements);
  };

  useEffect(() => {
    loadAnnouncements();
  }, [currentUser.role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAnnouncement(currentUser.id, title, body, targetRole).then(() => {
      setTitle("");
      setBody("");
      loadAnnouncements();
    });
  };

  const handleDelete = (id) => {
    deleteAnnouncement(id).then(loadAnnouncements);
  };

  return (
    <div>
      <h2>Announcements</h2>

      {canPost && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <br />
          <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
            <option value="ALL">Everyone</option>
            <option value="STUDENT">Students only</option>
            <option value="FACULTY">Faculty only</option>
          </select>
          <br />
          <button type="submit">Post Announcement</button>
        </form>
      )}

      {announcements.map((a) => (
        <div key={a.id} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "0.5rem" }}>
          <h3>{a.title}</h3>
          <p>{a.body}</p>
          <small>{new Date(a.createdAt).toLocaleString()}</small>
          {canPost && (
            <div>
              <button onClick={() => handleDelete(a.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

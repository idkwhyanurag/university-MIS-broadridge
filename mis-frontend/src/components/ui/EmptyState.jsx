import React from "react";
import "./EmptyState.css";

// An empty screen is an invitation to act, not a dead end.
export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-mark">&#8213;</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

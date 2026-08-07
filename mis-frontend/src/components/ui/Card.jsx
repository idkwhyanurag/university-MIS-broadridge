import React from "react";
import "./Card.css";

// The signature element: every card carries a small colored corner tab,
// like a library card-catalog entry, keyed to its epic group.
// tab: 'academics' | 'hostel' | 'comms' | 'admin' | undefined (neutral)
export default function Card({ tab, title, children, className = "" }) {
  return (
    <div className={`card ${className}`} data-tab={tab}>
      {tab && <span className="card-tab" />}
      {title && <div className="card-title">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
}

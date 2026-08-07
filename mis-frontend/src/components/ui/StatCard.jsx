import React from "react";
import "./StatCard.css";

// A ledger-style stat: a mono-numeral total with a label,
// carrying its epic group's tab color.
export default function StatCard({ tab, label, value, hint }) {
  return (
    <div className="stat-card" data-tab={tab}>
      <span className="card-tab" />
      <div className="stat-value mono">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}

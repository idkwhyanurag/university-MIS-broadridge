import React from "react";
import EmptyState from "../components/ui/EmptyState";

// Used for every epic page not yet built in this stage.
// Each real page (Students, Departments, Fees, etc.) will
// replace its route's <PagePlaceholder /> in a later stage.
export default function PagePlaceholder({ title }) {
  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>{title}</h1>
      <EmptyState
        title="This page is on the way"
        description={`${title} isn't wired up yet — this section is scheduled for the next build stage.`}
      />
    </div>
  );
}

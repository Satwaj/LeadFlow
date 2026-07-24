import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import Loader from "../common/Loader.jsx";
import { formatDateTime } from "../../utils/formatDate.js";

const actionTitle = {
  lead_created: "Lead created",
  status_changed: "Status changed",
  lead_assigned: "Lead assigned",
  lead_request_rejected: "Request rejected",
  note_added: "Note added",
};

const describe = (activity) => {
  if (activity.action === "status_changed") {
    return `${activity.meta?.from || "—"} → ${activity.meta?.to || "—"}`;
  }
  if (activity.action === "lead_assigned") {
    const assignee = activity.meta?.assigneeName || (activity.meta?.to?.length > 20 ? "Member" : activity.meta?.to) || "Member";
    const performer = activity.performedBy?.name || activity.meta?.performedByName || "Admin";
    return `Assigned to ${assignee} by ${performer}`;
  }
  if (activity.action === "lead_request_rejected") {
    const performer = activity.performedBy?.name || activity.meta?.performedByName || "Admin";
    return `Lead request rejected by ${performer}`;
  }
  if (activity.action === "note_added") return "Internal note added";
  return "Public enquiry received";
};

const ActivityTimeline = ({ activities = [], status, error, onRetry }) => (
  <section className="panel p-5">
    <h3 className="mb-4 text-lg font-semibold">Activity</h3>
    {status === "loading" ? <Loader label="Loading activity" /> : null}
    {status === "failed" ? <ErrorState description={error} onAction={onRetry} /> : null}
    {status === "succeeded" && activities.length === 0 ? <EmptyState title="No activity yet" description="Meaningful lead changes will appear here." /> : null}
    {status === "succeeded" && activities.length > 0 ? (
      <ol className="relative space-y-4 border-l border-[var(--border-brand)] pl-4">
        {activities.map((activity) => (
          <li key={activity._id} className="relative">
            <span className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[var(--brand)]" aria-hidden="true" />
            <p className="text-sm font-semibold">{actionTitle[activity.action] || activity.action}</p>
            <p className="text-sm text-[var(--text-secondary)]">{describe(activity)}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {activity.performedBy?.name || "Public visitor"} · {formatDateTime(activity.createdAt)}
            </p>
          </li>
        ))}
      </ol>
    ) : null}
  </section>
);

export default ActivityTimeline;

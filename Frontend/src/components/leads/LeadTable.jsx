import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import StatusBadge from "../common/StatusBadge.jsx";
import { formatDate } from "../../utils/formatDate.js";

const LeadTable = ({ leads, requests = [], userRole = "member" }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden overflow-hidden rounded-t-[var(--radius-lg)] md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border-default)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Company</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Assigned To</th>
            <th className="px-4 py-3 font-semibold">Request Status</th>
            <th className="px-4 py-3 font-semibold">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-default)] bg-white">
          {leads.map((lead) => {
            // Find lead request associated with this lead
            const req = requests.find(
              (r) => r.lead?._id === lead._id || r.lead === lead._id
            );
            const hasPendingRequest = userRole === "admin" && requests.some(
              (r) => (r.lead?._id === lead._id || r.lead === lead._id) && r.status === "pending"
            );

            return (
              <tr
                key={lead._id}
                tabIndex={0}
                role="link"
                className="cursor-pointer transition duration-200 hover:bg-[var(--brand-soft)]/45 focus:bg-[var(--brand-soft)]"
                onClick={() => navigate(`/app/leads/${lead._id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") navigate(`/app/leads/${lead._id}`);
                }}
              >
                <td className="px-4 py-4">
                  <p className="font-semibold text-[var(--text-primary)]">{lead.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{lead.email}</p>
                </td>
                <td className="px-4 py-4 text-[var(--text-secondary)]">{lead.company || "—"}</td>
                <td className="px-4 py-4"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-4 font-medium text-[var(--text-secondary)]">
                  {lead.assignedTo?.name ? (
                    <span className="text-[var(--text-primary)] font-semibold">{lead.assignedTo.name}</span>
                  ) : hasPendingRequest ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--warning)]">
                      <Clock className="h-3 w-3" /> Request Pending
                    </span>
                  ) : (
                    <span className="text-[var(--text-muted)]">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {req ? (
                    req.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-soft)] px-2 py-0.5 text-xs font-bold text-[var(--warning)]">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    ) : req.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2 py-0.5 text-xs font-bold text-[var(--success)]">
                        <CheckCircle2 className="h-3 w-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--danger-soft)] px-2 py-0.5 text-xs font-bold text-[var(--danger)]">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-[var(--text-secondary)]">{formatDate(lead.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;

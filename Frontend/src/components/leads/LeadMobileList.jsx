import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge.jsx";
import { formatDate } from "../../utils/formatDate.js";

const LeadMobileList = ({ leads }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 md:hidden">
      {leads.map((lead) => (
        <button
          key={lead._id}
          type="button"
          className="w-full rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white p-4 text-left shadow-sm transition duration-200 hover:border-[var(--border-brand)] hover:shadow-[var(--shadow-soft)]"
          onClick={() => navigate(`/app/leads/${lead._id}`)}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{lead.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{lead.company || "No company"}</p>
            </div>
            <StatusBadge status={lead.status} />
          </div>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{lead.email}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Assigned: {lead.assignedTo?.name || "Unassigned"}</span>
            <span>{formatDate(lead.createdAt)}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default LeadMobileList;

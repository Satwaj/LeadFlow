import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge.jsx";
import { formatDate } from "../../utils/formatDate.js";

const LeadTable = ({ leads }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden overflow-hidden rounded-t-[var(--radius-lg)] md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Company</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Assigned To</th>
            <th className="px-4 py-3 font-semibold">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-default)] bg-white">
          {leads.map((lead) => (
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
              <td className="px-4 py-4 text-[var(--text-secondary)]">{lead.assignedTo?.name || "Unassigned"}</td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;

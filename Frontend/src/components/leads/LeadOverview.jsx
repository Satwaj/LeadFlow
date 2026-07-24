import { Building2, CalendarDays, Mail, Phone, Send, UserCheck } from "lucide-react";
import { formatDateTime } from "../../utils/formatDate.js";

const itemClass = "flex gap-3 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-3";

const LeadOverview = ({ lead }) => (
  <section className="panel p-5">
    <h3 className="mb-4 text-lg font-semibold">Lead Information</h3>
    <div className="grid gap-3">
      <div className={itemClass}>
        <Mail className="mt-0.5 h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Email</p>
          <p className="break-all text-sm">{lead.email}</p>
        </div>
      </div>
      <div className={itemClass}>
        <Phone className="mt-0.5 h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Phone</p>
          <p className="text-sm">{lead.phone || "—"}</p>
        </div>
      </div>
      <div className={itemClass}>
        <Building2 className="mt-0.5 h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Company</p>
          <p className="text-sm">{lead.company || "—"}</p>
        </div>
      </div>
      <div className={itemClass}>
        <UserCheck className="mt-0.5 h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Assigned To</p>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            {lead.assignedTo?.name ? lead.assignedTo.name : "Unassigned"}
          </p>
        </div>
      </div>
      <div className={itemClass}>
        <Send className="mt-0.5 h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Service / Source</p>
          <p className="text-sm">{lead.service} · {lead.source || "website"}</p>
        </div>
      </div>
      <div className={itemClass}>
        <CalendarDays className="mt-0.5 h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Created</p>
          <p className="text-sm">{formatDateTime(lead.createdAt)}</p>
        </div>
      </div>
      {lead.message ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white p-3">
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Message</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{lead.message}</p>
        </div>
      ) : null}
    </div>
  </section>
);

export default LeadOverview;

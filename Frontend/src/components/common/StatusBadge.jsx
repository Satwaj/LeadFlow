const styles = {
  New: "bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border-default)]",
  Contacted: "bg-[#eaf2f5] text-[#315766] border-[#c8dde4]",
  Qualified: "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--border-brand)]",
  Proposal: "bg-[var(--warning-soft)] text-[var(--warning)] border-[#f6d889]",
  Won: "bg-[var(--success-soft)] text-[var(--success)] border-[#afd9bc]",
  Lost: "bg-[var(--danger-soft)] text-[var(--danger)] border-[#f6b8b4]",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.New}`}
  >
    {status || "—"}
  </span>
);

export default StatusBadge;

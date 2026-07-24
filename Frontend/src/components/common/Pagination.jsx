import Button from "./Button.jsx";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  const { page, limit, total, totalPages } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border-default)] px-4 py-4 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing <span className="font-semibold text-[var(--text-primary)]">{start}</span>–<span className="font-semibold text-[var(--text-primary)]">{end}</span> of{" "}
        <span className="font-semibold text-[var(--text-primary)]">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <span className="rounded-full bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

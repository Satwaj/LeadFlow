import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange, onLimitChange, limitOptions = [5, 10, 25, 50] }) => {
  if (!pagination) return null;

  const { page, limit, total, totalPages } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const maxPages = Math.max(totalPages, 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(maxPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--border-default)] bg-white px-4 py-3.5 text-xs text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between rounded-b-[var(--radius-xl)]">
      {/* Range summary & limit selector */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-medium">
          Showing <span className="font-bold text-[var(--text-primary)]">{start}</span>–<span className="font-bold text-[var(--text-primary)]">{end}</span> of{" "}
          <span className="font-bold text-[var(--text-primary)]">{total}</span> items
        </p>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 border-l border-[var(--border-default)] pl-3">
            <span className="text-[var(--text-muted)] font-medium">Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-muted)] px-2 py-1 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className="rounded-lg border border-[var(--border-default)] p-1.5 text-[var(--text-primary)] hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="First Page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-[var(--border-default)] px-2.5 py-1.5 font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </button>

        {/* Numeric page buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                pageNum === page
                  ? "bg-[var(--brand)] text-white shadow-xs"
                  : "border border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={page >= maxPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-[var(--border-default)] px-2.5 py-1.5 font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          disabled={page >= maxPages}
          onClick={() => onPageChange(maxPages)}
          className="rounded-lg border border-[var(--border-default)] p-1.5 text-[var(--text-primary)] hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="Last Page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

const Select = ({ label, error, id, children, className = "", ...props }) => {
  const selectId = id || props.name;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={errorId}
        className={`min-h-11 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-[var(--text-primary)] transition duration-200 focus:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-70 ${error ? "border-[var(--danger)]" : "border-[var(--border-default)]"} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default Select;

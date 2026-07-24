const Input = ({ label, error, id, className = "", rightElement, ...props }) => {
  const inputId = id || props.name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          className={`min-h-11 w-full rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-[var(--text-primary)] transition duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--brand)] ${rightElement ? "pr-10" : ""} ${error ? "border-[var(--danger)]" : "border-[var(--border-default)]"} ${className}`}
          {...props}
        />
        {rightElement ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default Input;

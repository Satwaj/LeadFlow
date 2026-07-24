const Textarea = ({ label, error, id, className = "", ...props }) => {
  const textareaId = id || props.name;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={errorId}
        className={`min-h-28 w-full resize-y rounded-[var(--radius-md)] border bg-white px-3 py-2 text-sm text-[var(--text-primary)] transition duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--brand)] ${error ? "border-[var(--danger)]" : "border-[var(--border-default)]"} ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default Textarea;

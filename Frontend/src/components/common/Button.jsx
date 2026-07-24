import { LoaderCircle } from "lucide-react";

const variants = {
  primary:
    "border-transparent bg-[var(--brand)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] active:translate-y-px",
  secondary:
    "border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:border-[var(--border-brand)] hover:bg-[var(--brand-soft)]",
  ghost:
    "border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-muted)]",
  danger:
    "border-transparent bg-[var(--danger)] text-white hover:brightness-95",
};

const Button = ({ children, variant = "primary", loading = false, className = "", disabled, type = "button", ...props }) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    {...props}
  >
    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
    <span>{children}</span>
  </button>
);

export default Button;

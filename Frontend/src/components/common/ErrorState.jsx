import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";

const ErrorState = ({ title = "Something went wrong", description, actionLabel = "Try again", onAction }) => (
  <div className="rounded-[var(--radius-lg)] border border-[var(--danger-soft)] bg-white p-6 text-sm shadow-sm">
    <div className="flex gap-3">
      <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--danger)]" aria-hidden="true" />
      <div>
        <h2 className="font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-1 text-[var(--text-secondary)]">{description}</p>
        {onAction ? (
          <Button className="mt-4" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  </div>
);

export default ErrorState;

import { Inbox } from "lucide-react";
import Button from "./Button.jsx";

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="flex min-h-44 flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-white/70 p-8 text-center">
    <Inbox className="mb-3 h-8 w-8 text-[var(--brand-secondary)]" aria-hidden="true" />
    <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
    <p className="mt-1 max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
    {actionLabel ? (
      <Button className="mt-4" variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </div>
);

export default EmptyState;

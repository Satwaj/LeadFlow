import { CheckCircle2, X } from "lucide-react";

const Toast = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm animate-in items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-brand)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-soft)]">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--success)]" aria-hidden="true" />
      <p className="text-[var(--text-primary)]">{message}</p>
      <button type="button" aria-label="Close notification" className="rounded-full p-1 hover:bg-[var(--surface-muted)]" onClick={onClose}>
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;

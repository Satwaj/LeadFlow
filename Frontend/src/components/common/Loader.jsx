import { LoaderCircle } from "lucide-react";

const Loader = ({ label = "Loading" }) => (
  <div className="flex min-h-40 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-white/70 p-8 text-sm text-[var(--text-secondary)]">
    <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[var(--brand)]" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default Loader;

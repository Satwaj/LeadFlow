import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button.jsx";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 bg-[var(--background)]">
      <section className="panel max-w-md p-8 text-center bg-white border border-[var(--border-default)] shadow-xl rounded-[var(--radius-xl)] space-y-4">
        <span className="inline-block rounded-full bg-[var(--warning-soft)] px-3 py-1 text-xs font-extrabold text-[var(--warning)] tracking-wider">
          404 ERROR
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Page Not Found</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          The page or route you requested does not exist or has been moved.
        </p>

        <div className="pt-4 flex flex-col gap-2.5">
          <Button
            className="w-full justify-center gap-2 bg-[var(--brand)] text-xs font-bold py-2.5"
            onClick={() => navigate("/app/dashboard", { replace: true })}
          >
            <LayoutDashboard className="h-4 w-4" /> Go to Workspace Dashboard
          </Button>

          <Link
            to="/"
            replace
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-white transition"
          >
            <Home className="h-4 w-4 text-[var(--brand)]" /> View Public Welcome Page
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] pt-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Go back to previous page
          </button>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;

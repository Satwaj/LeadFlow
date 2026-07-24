import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="grid min-h-screen place-items-center px-4 py-10">
    <section className="panel max-w-md p-8 text-center">
      <p className="text-sm font-semibold text-[var(--brand)]">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">The page you requested does not exist or has moved.</p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] transition hover:bg-[var(--brand-hover)]"
      >
        Go to public form
      </Link>
    </section>
  </main>
);

export default NotFoundPage;

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="border-t border-[var(--border-default)] bg-white/70 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-[var(--border-default)]">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3">
            <span className="text-xl font-bold text-[var(--text-primary)]">LeadFlow</span>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Turn ideas into opportunities. Capture, assign, and close qualified conversations with clarity and focus.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Role-Based CRM
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Platform</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/" className="hover:text-[var(--brand)] transition">Welcome Page</Link>
              </li>
              <li>
                <a href="/#services" className="hover:text-[var(--brand)] transition">Services & Capabilities</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[var(--brand)] transition">How It Works</a>
              </li>
              <li>
                <a href="/#start-project" className="hover:text-[var(--brand)] transition">Start a Project</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Workspace & Auth */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Workspace</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/app/dashboard" className="font-semibold text-[var(--brand)] hover:underline">Go to Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/app/leads" className="hover:text-[var(--brand)] transition">Leads Pipeline</Link>
                  </li>
                  <li>
                    <Link to="/app/profile" className="hover:text-[var(--brand)] transition">User Profile</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-[var(--brand)] transition">Team Sign In</Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-[var(--brand)] transition">Create Member Account</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 4: Service Areas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Service Areas</h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Web Dev", "SaaS & CRM", "UI/UX", "Ecommerce", "Mobile Apps", "Growth SEO"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-[var(--border-default)] bg-white px-2 py-0.5 text-xs text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Credit & Exchange Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} LeadFlow CRM. All rights reserved.</p>

          <a
            href="https://digitalheroesco.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand)] bg-[var(--brand-soft)] px-6 py-3 text-base sm:text-lg font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Built for Digital Heroes Training Task <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

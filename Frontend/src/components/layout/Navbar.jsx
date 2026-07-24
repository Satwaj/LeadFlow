import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, Menu, Sparkles, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <span className="rounded-full border border-[var(--border-brand)] bg-white px-3.5 py-1 text-base font-bold shadow-xs transition group-hover:border-[var(--brand)] group-hover:text-[var(--brand)]">
            LeadFlow
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <button
            type="button"
            onClick={() => handleNavClick("services")}
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand)] transition cursor-pointer"
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("how-it-works")}
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand)] transition cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("start-project")}
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand)] transition cursor-pointer"
          >
            Start a Project
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Prominent Start Project CTA */}
          <button
            type="button"
            onClick={() => handleNavClick("start-project")}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-[var(--brand-hover)] transition cursor-pointer hover:shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Start a Project
          </button>

          {/* Logged in vs Guest links */}
          {isAuthenticated ? (
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)] bg-[var(--brand-soft)] px-4 py-1.5 text-sm font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition shadow-xs"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-[var(--brand)] hover:bg-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-[var(--border-default)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--text-primary)] md:hidden hover:bg-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[var(--border-default)] bg-white px-4 py-4 md:hidden"
          >
            <div className="flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => handleNavClick("services")}
                className="text-left text-sm font-medium text-[var(--text-primary)] py-1 cursor-pointer"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("how-it-works")}
                className="text-left text-sm font-medium text-[var(--text-primary)] py-1 cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("start-project")}
                className="text-left text-sm font-medium text-[var(--text-primary)] py-1 cursor-pointer"
              >
                Start a Project
              </button>

              <div className="pt-3 border-t border-[var(--border-default)] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick("start-project")}
                  className="w-full text-center rounded-full bg-[var(--brand)] py-2 text-sm font-semibold text-white cursor-pointer"
                >
                  Start a Project ✨
                </button>

                {isAuthenticated ? (
                  <Link
                    to="/app/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-full border border-[var(--brand)] bg-[var(--brand-soft)] py-2 text-sm font-bold text-[var(--brand)]"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center rounded-full border border-[var(--border-default)] py-2 text-sm font-semibold text-[var(--brand)]"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center rounded-full border border-[var(--border-default)] py-2 text-sm font-semibold text-[var(--text-primary)]"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

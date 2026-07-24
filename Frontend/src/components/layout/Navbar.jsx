import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
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
    <header className="sticky top-0 z-50 py-3 bg-[var(--background)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <span className="rounded-full border border-[var(--border-brand)] bg-white px-4 py-1.5 text-base font-extrabold text-[var(--text-primary)] shadow-xs transition group-hover:border-[var(--brand)] group-hover:text-[var(--brand)]">
            LeadFlow
          </span>
        </Link>

        {/* Floating Pill Capsule Bar matching screenshot */}
        <nav className="hidden items-center rounded-full border border-[#dcd6c8] bg-[#f9f6f0]/95 px-8 py-3 shadow-xs md:flex gap-7 backdrop-blur-md">
          <Link
            to="/"
            className="text-sm font-extrabold text-[#121915] hover:text-[var(--brand)] transition"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={() => handleNavClick("services")}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#404a43] hover:text-[var(--brand)] transition cursor-pointer"
          >
            Services <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("how-it-works")}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#404a43] hover:text-[var(--brand)] transition cursor-pointer"
          >
            How It Works <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("start-project")}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#404a43] hover:text-[var(--brand)] transition cursor-pointer"
          >
            Start a Project <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </nav>

        {/* Right Action Capsule Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)] bg-[var(--brand-soft)] px-5 py-2 text-xs font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition shadow-xs"
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-[#121915] hover:text-[var(--brand)] px-2 transition"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick("start-project")}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--brand-hover)] transition cursor-pointer hover:shadow-md"
              >
                Start a Project <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="rounded-full border border-[#dcd6c8] bg-[#f9f6f0] p-2.5 text-[var(--text-primary)] md:hidden hover:bg-white focus:outline-none shadow-xs"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[var(--border-default)] bg-[#f9f6f0] px-4 py-4 md:hidden shadow-lg"
          >
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-sm font-bold text-[#121915] py-1"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick("services")}
                className="text-left text-sm font-medium text-[#404a43] py-1 cursor-pointer"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("how-it-works")}
                className="text-left text-sm font-medium text-[#404a43] py-1 cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("start-project")}
                className="text-left text-sm font-medium text-[#404a43] py-1 cursor-pointer"
              >
                Start a Project
              </button>

              <div className="pt-3 border-t border-[var(--border-default)] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick("start-project")}
                  className="w-full text-center rounded-full bg-[var(--brand)] py-2.5 text-sm font-bold text-white cursor-pointer shadow-xs"
                >
                  Start a Project ↗
                </button>

                {isAuthenticated ? (
                  <Link
                    to="/app/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-full border border-[var(--brand)] bg-[var(--brand-soft)] py-2.5 text-sm font-bold text-[var(--brand)]"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center rounded-full border border-[var(--border-default)] py-2.5 text-sm font-semibold text-[var(--text-primary)]"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center rounded-full border border-[var(--border-default)] py-2.5 text-sm font-semibold text-[var(--text-primary)]"
                    >
                      Create Member Account
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

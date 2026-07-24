import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import LoginForm from "../components/auth/LoginForm.jsx";
import Navbar from "../components/layout/Navbar.jsx";

const LoginPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="soft-grid min-h-screen text-[var(--text-primary)] flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-white shadow-xl grid lg:grid-cols-[1fr_0.95fr]"
          >
            {/* Dark Brand Sidebar Panel */}
            <div className="bg-[var(--surface-dark)] p-8 text-[var(--text-inverse)] sm:p-10 flex flex-col justify-between">
              <div>
                <Link
                  to="/"
                  className="inline-flex rounded-full border border-white/15 px-3.5 py-1 text-xs font-bold tracking-wider text-white/90 hover:bg-white/10 transition"
                >
                  LEADFLOW PLATFORM
                </Link>
                <h1 className="mt-10 max-w-md text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                  Manage every qualified opportunity with focus.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                  LeadFlow equips teams to review enquiries, assign leads, update pipelines, and keep qualified conversations moving forward.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/10 text-[var(--brand-secondary)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/90">Cookie-Based Authentication</p>
                  <p className="text-xs text-white/60">Encrypted sessions for Admins & Members</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
              {isAuthenticated ? (
                <div className="space-y-6 text-center py-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                    <LayoutDashboard className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">You are currently signed in</h2>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      Signed in as <span className="font-semibold">{user?.email}</span> ({user?.role})
                    </p>
                  </div>
                  <Link
                    to="/app/dashboard"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-hover)] transition"
                  >
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Team Portal</p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Sign in to workspace</h2>
                  <p className="mb-6 mt-1 text-sm text-[var(--text-secondary)]">
                    Enter your registered email address and password.
                  </p>

                  <LoginForm />

                  <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold text-[var(--brand)] hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      
    </div>
  );
};

export default LoginPage;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, UserPlus } from "lucide-react";
import RegisterForm from "../components/auth/RegisterForm.jsx";
import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Navbar.jsx";

const RegisterPage = () => {
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
                  PUBLIC REGISTRATION
                </Link>
                <h1 className="mt-10 max-w-md text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                  Join the LeadFlow team workspace.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                  Register as a Team Member to access your assigned leads, update pipeline status, log timestamped notes, and collaborate on qualified opportunities.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand-secondary)] shrink-0" />
                  <span className="text-xs font-semibold text-white/90">Member-scoped pipeline access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand-secondary)] shrink-0" />
                  <span className="text-xs font-semibold text-white/90">Secure cookie authentication</span>
                </div>
              </div>
            </div>

            {/* Registration Form Container */}
            <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus className="h-4 w-4 text-[var(--brand)]" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Get Started</p>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Create Member Account</h2>
                <p className="mb-6 mt-1 text-sm text-[var(--text-secondary)]">
                  Public registration automatically provisions a Team Member account.
                </p>

                <RegisterForm />
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;

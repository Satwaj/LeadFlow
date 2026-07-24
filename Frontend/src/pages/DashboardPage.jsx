import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { fetchLeads } from "../redux/slices/leadSlice.js";
import { formatDate } from "../utils/formatDate.js";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, pagination, status, error } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads({ page: 1, limit: 5 }));
  }, [dispatch]);

  const newCount = items.filter((lead) => lead.status === "New").length;
  const qualifiedCount = items.filter((lead) => lead.status === "Qualified").length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Welcome Banner Card */}
      <div className="panel overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-xl)] bg-white shadow-md">
        <div className="soft-grid p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold text-[var(--brand)] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              {user?.role === "admin" ? "Admin Workspace" : "Member Workspace"}
            </span>
            <Link to="/" className="text-xs font-semibold text-[var(--brand)] hover:underline ml-auto">
              View Public Welcome Page →
            </Link>
          </div>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-4xl">
                Welcome back, {user?.name}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
                Review your qualified leads, manage pipeline status, and track opportunity progress. Scoped for your <span className="font-semibold capitalize text-[var(--brand)]">{user?.role}</span> account permissions.
              </p>
            </div>
            <Link
              to="/app/leads"
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-hover)] shadow-xs"
            >
              View all leads <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Accessible Leads", value: pagination?.total ?? 0, icon: UsersRound },
          { label: "New Leads (Recent)", value: newCount, icon: Sparkles },
          { label: "Qualified (Recent)", value: qualifiedCount, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="panel p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white border border-[var(--border-default)] rounded-[var(--radius-lg)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
              <div className="p-2 rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[var(--text-primary)]">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Leads List Panel */}
      <div className="panel overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-xl)] bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 text-[var(--brand)]" aria-hidden="true" />
            <h3 className="font-bold text-[var(--text-primary)]">Recent Lead Activity</h3>
          </div>
          <Link className="text-xs font-bold uppercase tracking-wider text-[var(--brand)] hover:underline" to="/app/leads">
            View All Pipeline →
          </Link>
        </div>

        <div className="p-4 sm:p-6">
          {status === "loading" ? <Loader label="Loading recent leads" /> : null}
          {status === "failed" ? <ErrorState description={error} onAction={() => dispatch(fetchLeads({ page: 1, limit: 5 }))} /> : null}
          {status === "succeeded" && items.length === 0 ? (
            <EmptyState title="No leads found" description="New enquiries submitted on the public website form will appear here." />
          ) : null}
          {status === "succeeded" && items.length > 0 ? (
            <div className="divide-y divide-[var(--border-default)]">
              {items.map((lead) => (
                <Link
                  key={lead._id}
                  to={`/app/leads/${lead._id}`}
                  className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] p-3 transition hover:bg-[var(--brand-soft)]/60 group"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition">{lead.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {lead.company ? `${lead.company} · ` : ""}{lead.email} · {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lead.status} />
                    <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--brand)] transition" />
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
};

export default DashboardPage;

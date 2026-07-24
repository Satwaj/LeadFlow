import { useSelector } from "react-redux";
import { Calendar, Mail, ShieldCheck, User as UserIcon } from "lucide-react";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto max-w-2xl">
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--surface-dark)] text-xl font-bold text-[var(--text-inverse)]">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user?.name || "User Profile"}</h1>
              <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
            </div>
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                isAdmin
                  ? "bg-[var(--surface-dark)] text-[var(--text-inverse)]"
                  : "bg-[var(--brand-soft)] text-[var(--brand)]"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {user?.role || "member"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Account Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-muted)]/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] mb-1">
                <UserIcon className="h-4 w-4 text-[var(--brand)]" />
                Full Name
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-muted)]/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] mb-1">
                <Mail className="h-4 w-4 text-[var(--brand)]" />
                Email Address
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.email}</p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-muted)]/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] mb-1">
                <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />
                Role & Permissions
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{user?.role} Access</p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-muted)]/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] mb-1">
                <Calendar className="h-4 w-4 text-[var(--brand)]" />
                Member Since
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{formattedDate}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;

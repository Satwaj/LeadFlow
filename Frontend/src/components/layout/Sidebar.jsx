import { BarChart3, Clock, Globe, LogOut, User, UserPlus, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import Button from "../common/Button.jsx";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/app/leads", label: "Leads", icon: UsersRound },
  { to: "/app/profile", label: "Profile", icon: User },
];

const Sidebar = ({ user, onLogout, loggingOut = false }) => (
  <aside className="hidden lg:flex lg:flex-col sticky top-0 h-screen w-60 shrink-0 border-r border-white/10 bg-[var(--surface-dark)] p-4 text-[var(--text-inverse)] z-30 overflow-y-auto no-scrollbar">
    <div className="mb-8">
      <div className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80">
        LeadFlow
      </div>
      <p className="mt-4 text-2xl font-bold leading-tight">Digital lead operations.</p>
    </div>

    <nav className="space-y-2 flex-1" aria-label="Primary navigation">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition duration-200 ${
              isActive ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"
            }`
          }
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </NavLink>
      ))}

      {user?.role === "admin" && (
        <>
          <NavLink
            to="/app/lead-requests"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition duration-200 ${
                isActive ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            <Clock className="h-4 w-4 text-[var(--brand-secondary)]" aria-hidden="true" />
            Lead Requests
          </NavLink>

          <NavLink
            to="/app/create-user"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition duration-200 ${
                isActive ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Create User
          </NavLink>
        </>
      )}

      <NavLink
        to="/"
        className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/8 hover:text-white transition duration-200"
      >
        <Globe className="h-4 w-4 text-[var(--brand-secondary)]" aria-hidden="true" />
        Welcome Page
      </NavLink>
    </nav>

    <div className="mt-auto border-t border-white/10 pt-4">
      <p className="truncate text-sm font-semibold">{user?.name || "User"}</p>
      <p className="mb-3 text-xs capitalize text-white/60">{user?.role}</p>
      <Button variant="ghost" className="w-full justify-start border-white/10 text-white hover:bg-white/10" onClick={onLogout} loading={loggingOut}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </Button>
    </div>
  </aside>
);

export default Sidebar;

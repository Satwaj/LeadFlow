import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import Button from "../common/Button.jsx";

const MobileNav = ({ open, onClose, user, onLogout }) => (
  <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
    <div className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
    <div
      className={`absolute left-0 top-0 h-full w-72 max-w-[86vw] bg-[var(--surface-dark)] p-4 text-[var(--text-inverse)] shadow-2xl transition-transform duration-250 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="rounded-full border border-white/15 px-3 py-1 text-sm font-semibold">LeadFlow</span>
        <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label="Close navigation" onClick={onClose}>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <nav className="space-y-2" aria-label="Mobile navigation">
        <NavLink to="/app/dashboard" onClick={onClose} className="block rounded-[var(--radius-md)] px-3 py-3 font-semibold hover:bg-white/10">
          Dashboard
        </NavLink>
        <NavLink to="/app/leads" onClick={onClose} className="block rounded-[var(--radius-md)] px-3 py-3 font-semibold hover:bg-white/10">
          Leads
        </NavLink>
        <NavLink to="/app/profile" onClick={onClose} className="block rounded-[var(--radius-md)] px-3 py-3 font-semibold hover:bg-white/10">
          Profile
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/app/create-user" onClick={onClose} className="block rounded-[var(--radius-md)] px-3 py-3 font-semibold hover:bg-white/10">
            Create User
          </NavLink>
        )}
        <NavLink to="/" onClick={onClose} className="block rounded-[var(--radius-md)] px-3 py-3 font-semibold hover:bg-white/10 text-[var(--brand-secondary)]">
          View Welcome Page →
        </NavLink>
      </nav>
      <div className="mt-8 border-t border-white/10 pt-4">
        <p className="font-semibold">{user?.name}</p>
        <p className="mb-3 text-xs capitalize text-white/60">{user?.role}</p>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  </div>
);

export default MobileNav;

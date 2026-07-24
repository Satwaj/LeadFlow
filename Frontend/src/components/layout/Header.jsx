import { ArrowUpRight, Globe, Home, Menu, User, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = ({ title, user, onOpenMobileNav }) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[var(--border-default)] bg-[var(--background)]/90 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white p-2 lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] md:text-2xl">{title}</h1>
        </div>
      </div>

      {/* Header Quick Nav & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Home / View Public Welcome Page Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-brand)] bg-white px-3.5 py-1.5 text-xs font-bold text-[var(--brand)] shadow-xs hover:bg-[var(--brand-soft)] transition"
          title="View Public Welcome Page"
        >
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">View Public Welcome Page →</span>
          <span className="sm:hidden">Home</span>
        </Link>

        {/* Leads Pipeline Button */}
        <Link
          to="/app/leads"
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs ${
            location.pathname.includes("/leads")
              ? "bg-[var(--brand)] text-white"
              : "border border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
          }`}
          title="View Leads Pipeline"
        >
          <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Leads</span>
        </Link>

        {/* User Profile Quick Link */}
        <Link
          to="/app/profile"
          className="flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-white p-1 pr-3 hover:bg-[var(--surface-muted)] transition shadow-xs"
          title="View Profile"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-dark)] text-xs font-bold text-[var(--text-inverse)]">
            {user?.name?.charAt(0)?.toUpperCase() || <User className="h-3.5 w-3.5" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">{user?.name?.split(" ")[0]}</p>
            <p className="text-[10px] capitalize text-[var(--text-muted)] leading-tight">{user?.role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;

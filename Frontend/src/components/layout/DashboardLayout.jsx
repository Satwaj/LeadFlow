import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { logout } from "../../redux/slices/authSlice.js";
import Header from "./Header.jsx";
import MobileNav from "./MobileNav.jsx";
import Sidebar from "./Sidebar.jsx";

const titleFromPath = (pathname) => {
  if (pathname.includes("/create-user")) return "Create User";
  if (pathname.includes("/profile")) return "User Profile";
  if (pathname.includes("/leads/")) return "Lead Details";
  if (pathname.includes("/leads")) return "Leads";
  return "Dashboard";
};

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = useMemo(() => titleFromPath(location.pathname), [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-start bg-[var(--background)]">
      <Sidebar user={user} onLogout={handleLogout} loggingOut={status === "loading"} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} user={user} onLogout={handleLogout} />
      
      <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch min-h-screen">
        <div>
          <Header title={title} user={user} onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:py-8">
            <Outlet />
          </main>
        </div>

        {/* Compact App Footer for Dashboard, Leads, Profile, and Create User pages */}
        <footer className="border-t border-[var(--border-default)] bg-white/70 py-4 px-4 md:px-6 mt-8">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
            <p>© {new Date().getFullYear()} LeadFlow CRM. All rights reserved.</p>

            <a
              href="https://digitalheroesco.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-brand)] bg-[var(--brand-soft)] px-3.5 py-1 text-xs font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition shadow-xs"
            >
              Built for Digital Heroes Training Task <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

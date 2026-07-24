import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import LeadDetailPage from "../pages/LeadDetailPage.jsx";
import LeadsPage from "../pages/LeadsPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import AdminCreateUserPage from "../pages/AdminCreateUserPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import PublicLeadFormPage from "../pages/PublicLeadFormPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicLeadFormPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/:id" element={<LeadDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="create-user" element={<AdminCreateUserPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

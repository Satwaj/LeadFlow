import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { restoreSession } from "../redux/slices/authSlice.js";
import Loader from "../components/common/Loader.jsx";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, sessionChecked, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!sessionChecked) {
      dispatch(restoreSession());
    }
  }, [dispatch, sessionChecked]);

  if (!sessionChecked || status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <Loader label="Restoring session" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

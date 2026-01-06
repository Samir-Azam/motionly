// src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // While auth is being resolved, do not redirect yet
  if (isLoading) {
    return null; // or a small spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

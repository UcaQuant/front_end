import { type ReactNode, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

type Props = {
  requiredRole?: string | string[];
  children?: ReactNode;
};

export default function ProtectedRoute({
  requiredRole,
  children,
}: Props) {
  const { auth } = useContext(AuthContext);

  const isAuthenticated = auth.isAuthenticated && auth.token;


  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }


  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    if (!auth.role || !allowedRoles.includes(auth.role)) {
      return <Navigate to="/403" replace />;
    }
  }


  return children ? <>{children}</> : <Outlet />;
}

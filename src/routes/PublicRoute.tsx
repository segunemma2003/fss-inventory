import { useAuthentication } from "@/hooks/useAuthentication";
import { Outlet } from "react-router";
import { Navigate } from "react-router";


export const PublicRoute = () => {
  const isAuthenticated = useAuthentication();
  return isAuthenticated ? <Navigate to="/dashboard/" /> : <Outlet />;
};

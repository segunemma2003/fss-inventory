import { useAuthentication } from "@/hooks/useAuthentication";
import { getRequest } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Navigate } from "react-router";


export const PublicRoute = () => {
  const isAuthenticated = useAuthentication();
  useQuery({
    queryKey: ['priviledges'],
    queryFn: async () => await getRequest('auth/priviledges'),
    refetchOnWindowFocus: true,
  })
  return isAuthenticated ? <Navigate to="/dashboard/" /> : <Outlet />;
};

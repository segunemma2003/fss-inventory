import AuthorityGuard from "@/components/layouts/AuthorityGuard";
import { Outlet } from "react-router";

export const ProtectedRoute = () => {
  return (
    <AuthorityGuard>
      <Outlet />
    </AuthorityGuard>
  );
};

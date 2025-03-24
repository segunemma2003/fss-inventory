import AuthorityGuard from "./AuthGuard";
import { Outlet } from "react-router";

export const ProtectedRoute = () => {
  return (
    <AuthorityGuard>
      <Outlet />
    </AuthorityGuard>
  );
};

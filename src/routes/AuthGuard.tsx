import { ReactNode } from "react";
import { generatePageIdentity } from "@/lib/utils";
import { Navigate, useLocation } from "react-router";
import { useAccess } from "@/hooks/useAuthority/useAccess";
import { useAuthentication } from "@/hooks/useAuthentication";

type AuthorityGuard = { children: ReactNode };

const pageIdentifier = generatePageIdentity([
  "/dashboard",
  "/dashboard/add-product",
  "/dashboard/product-inventory",
  "/dashboard/sales-performance",
  "/dashboard/sales-analytics",
  "/dashboard/customer-order",
  "/dashboard/user-profile",
  "/dashboard/settings",
  "/dashboard/business-id",
  "/dashboard/business-id/create",
  "/dashboard/business-id/details",
]);

const AuthGuard = (props: AuthorityGuard) => {
  const { children } = props;
  const location = useLocation();
  const currentPageIdentity = pageIdentifier[
    location.pathname === "/dashboard/" ? "/dashboard" : location.pathname
  ]

  const { canView } = useAccess(currentPageIdentity);

  const isAuthenticated = useAuthentication();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthGuard;

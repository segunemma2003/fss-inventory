import { ReactNode } from "react";
// import { generatePageIdentity } from "@/lib/utils";
import { Navigate, useLocation } from "react-router";
import { useAccess } from "@/hooks/useAuthority/useAccess";
import { useAuthentication } from "@/hooks/useAuthentication";
import { UnAuthorized } from "@/pages/Unauthorise";

type AuthorityGuard = { children: ReactNode };

const pageIdentifier = {
  "/dashboard": "products",
  "/dashboard/add-product": "products",
  "/dashboard/product-inventory": "products",
  "/dashboard/sales-performance": "products",
  "/dashboard/sales-analytics": "products",
  "/dashboard/customer-order": "orders",
  "/dashboard/user-profile": "profile",
  "/dashboard/settings": "activity",
  "/dashboard/orders": "orders",
  "/dashboard/roles": "roles",
  "/dashboard/business-id": "businesses",
};

const AuthGuard = (props: AuthorityGuard) => {
  const { children } = props;
  const location = useLocation();
  const currentPageIdentity =
    pageIdentifier[
      location.pathname === "/dashboard/" ? "/dashboard" : location.pathname as keyof typeof pageIdentifier
    ];

  //   console.log(currentPageIdentity)

  const { canView } = useAccess(currentPageIdentity);

  const isAuthenticated = useAuthentication();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!canView) {
    return <UnAuthorized />;
  }

  return children;
};

export default AuthGuard;

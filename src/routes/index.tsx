import { Dashboard } from "@/layouts/Dashboard";
import { ErrorFallback } from "@/components/layouts/Error";
import { ProtectedRoute } from "./PrivateRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { NotFound } from "@/layouts/NotFound";
import { PublicRoute } from "./PublicRoute";
import { Login } from "@/pages/Login";
import { ProfileSelection } from "@/pages/ProfileSelection";
import { Register } from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import { RegisterOne } from "@/pages/Register/RegisterOne";
import { RegisterTwo } from "@/pages/Register/RegisterTwo";
import { Verification } from "@/pages/Verification";
import TermsCondition from "@/pages/TermsCondition";
import WelcomeOnBoard from "@/pages/WelcomeOnBoard";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProductInventory } from '@/pages/ProductInventory';
import SalesPerformance from '@/pages/SalesPerformance';
import SalesAnalytics from '@/pages/SalesAnalytics';
import { AddProduct } from '@/pages/AddProduct';
import CustomerOrder from '@/pages/CustomerOrder';
import { Users } from '@/pages/Users';
import Settings from '@/pages/settings'
import Business from "@/pages/Business";
import CreateBusiness from "@/pages/Business/Create";
import BusinessDetails from "@/pages/Business/Details";
import Roles from '@/pages/Roles';
import { Routes, Route } from "react-router";

export const AppRoutes = () => {
  const publicRoutes = [
    { path: "/", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/profile-selection", element: <ProfileSelection /> },
    { path: "/business-registration", element: <RegisterOne /> },
    { path: "/personal-registration", element: <RegisterTwo /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verification", element: <Verification /> },
    { path: "/terms-conditions", element: <TermsCondition /> },
    { path: "/welcome", element: <WelcomeOnBoard /> },
  ];

  const privateRoutes = [
    { path: "/dashboard/", element: <DashboardPage /> },
    { path: "/dashboard/add-product", element: <AddProduct /> },
    { path: "/dashboard/product-inventory", element: <ProductInventory /> },
    { path: "/dashboard/sales-performance", element: <SalesPerformance /> },
    { path: "/dashboard/sales-analytics", element: <SalesAnalytics /> },
    { path: "/dashboard/customer-order", element: <CustomerOrder /> },
    { path: "/dashboard/user-profile", element: <Users /> },
    { path: "/dashboard/settings", element: <Settings /> },
    { path: "/dashboard/roles", element: <Roles /> },
    { path: "/dashboard/business-id", element: <Business /> },
    { path: "/dashboard/business-id/create", element: <CreateBusiness /> },
    { path: "/dashboard/business-id/details", element: <BusinessDetails /> },
  ];

  return (
    <Routes>
      <Route element={<AuthLayout />} errorElement={<NotFound />}>
        <Route element={<PublicRoute />}>
          {publicRoutes.map((item, index) => (
            <Route key={index} {...item} />
          ))}
        </Route>
      </Route>

      <Route
        path="/dashboard"
        errorElement={<ErrorFallback />}
        element={<Dashboard />}
      >
        <Route element={<ProtectedRoute />}>
          {privateRoutes.map((item, index) => (
            <Route key={index} {...item} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

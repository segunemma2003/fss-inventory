import { Dashboard } from "@/layouts/Dashboard";
import { ErrorFallback } from "@/components/layouts/Error";
import { ProtectedRoute } from "./PrivateRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { NotFound } from "@/layouts/NotFound";
import { PublicRoute } from "./PublicRoute";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import ForgotPassword from '@/pages/ForgotPassword';
import { DashboardPage } from "@/pages/DashboardPage";
import { Routes, Route } from "react-router";

export const AppRoutes = () => {
  const publicRoutes = [
    { path: "/", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
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

      {/* <Route
    path="/dashboard"
    errorElement={<ErrorFallback />}
    element={<Dashboard />}
  >
    {[{ path: "/dashboard/home", element: <DashboardPage /> }].map(
      (item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            <ProtectedRoute key={index}>{item.element}</ProtectedRoute>
          }
        />
      )
    )}
  </Route> */}
    </Routes>
  );
};

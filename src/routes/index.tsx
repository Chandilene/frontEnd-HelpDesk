import { BrowserRouter } from "react-router";
import { AuthRoutes } from "./auth-routes";
import { CustomerRoutes } from "./customer-routes";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";
import { AdminRoutes } from "./admin-routes";
import { TechnicianRoutes } from "./technician-routes";

export function Routes() {
  const { session, isLoading } = useAuth();

  function getRoute() {
    switch (session?.user.role.toUpperCase()) {
      case "CUSTOMER":
        return <CustomerRoutes />;

      case "ADMIN":
        return <AdminRoutes />;

      case "TECHNICIAN":
        return <TechnicianRoutes />;

      default:
        return <AuthRoutes />;
    }
  }

  if (isLoading) {
    return <Loading />;
  }
  return <BrowserRouter>{getRoute()}</BrowserRouter>;
}

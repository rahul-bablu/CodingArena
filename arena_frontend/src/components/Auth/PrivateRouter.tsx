import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const {token} = useAuth()!;
  const loc = useLocation();
  if (!token) return <Navigate to={`/login?next=${loc.pathname}`} />;
  return <Outlet />;
};

export default PrivateRoute;
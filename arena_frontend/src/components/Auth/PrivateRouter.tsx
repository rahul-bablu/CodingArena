import Axios from "axios";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const {token} = useAuth()!;
  const loc = useLocation();
  if (!token) return <Navigate to={`/login?next=${loc.pathname}`} />;
  Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  return <Outlet />;
};

export default PrivateRoute;
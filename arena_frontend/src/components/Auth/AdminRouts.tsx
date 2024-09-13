import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AlertContext } from "../common/AlertProvider";
import { useAuth } from "./AuthProvider";

const AdminRoute = () => {
  const {userObj} = useAuth()!;
  const alert = useContext(AlertContext);
  const loc = useLocation();
  if (!['admin', 'dev'].includes(userObj?.role || '')){ 
    // TODO: write a better msg
    alert?.showAlert('Need admin privileges', 'error');
    return <Navigate to={`/login?next=${loc.pathname}`} />;
  }
  return <Outlet />;
};

export default AdminRoute;
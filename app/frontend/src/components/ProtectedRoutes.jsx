import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoutes() {
  return localStorage.getItem('refresh_token') ? <Outlet /> : <Navigate to='/login' />;
};

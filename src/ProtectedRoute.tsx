import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = sessionStorage.getItem("token")

  if (!token) {
    return <Navigate replace to="/login"  />;
  }

  return children;
}
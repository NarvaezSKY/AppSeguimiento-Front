import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";

interface PublicRouteProps {
  children: JSX.Element;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = sessionStorage.getItem("token");
  const user = useAuthStore(state => state.user);

  if (token && user) {
    return <Navigate replace to="/" />;
  }

  return children;
};
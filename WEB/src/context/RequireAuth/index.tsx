import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Roles, SFC } from '../../types';

interface RequireAuthProps {
  allowedRoles: Array<Roles>;
}

export const RequireAuth: SFC<RequireAuthProps> = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const roles = auth?.roles;
  const userHasAccess = Array.isArray(roles)
    ? roles.some((role) => allowedRoles.includes(role))
    : allowedRoles.includes(roles as Roles);
  return userHasAccess ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

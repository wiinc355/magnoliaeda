import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RoleGate({ allow = [], children, redirectTo = '/' }) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(allow)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

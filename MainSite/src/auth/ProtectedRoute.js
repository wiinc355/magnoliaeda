import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="auth-page-shell"><p>Checking your secure session...</p></div>;
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    const loginPath = `/login?returnTo=${encodeURIComponent(returnTo)}`;
    return <Navigate to={loginPath} replace />;
  }

  return children;
}

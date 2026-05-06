import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSession } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function finalizeLogin() {
      await refreshSession();
      if (mounted) {
        const returnTo = searchParams.get('returnTo') || '/dashboard';
        navigate(returnTo, { replace: true });
      }
    }

    finalizeLogin();

    return () => {
      mounted = false;
    };
  }, [navigate, refreshSession, searchParams]);

  return (
    <section className="auth-page-shell">
      <div className="container auth-card">
        <h1>Finalizing Sign In</h1>
        <p>Loading your secure session...</p>
      </div>
    </section>
  );
}

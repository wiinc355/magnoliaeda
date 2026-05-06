import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import AuthLoginTabs from './AuthLoginTabs';

export default function LoginPage() {
  const { loginRedirect } = useAuth();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const errorMessage = error === 'auth_not_configured'
    ? 'Sign in is not configured on the server yet. Set ENTRA and database environment variables in server/.env.'
    : 'Sign in failed. Please try again.';

  return (
    <section className="auth-page-shell">
      <AuthLoginTabs />
      <div className="container auth-card">
        <h1>Secure Sign In</h1>
        <p>
          Sign in using Microsoft Entra ID. Password handling and MFA are managed by the identity provider.
        </p>
        {error ? <p className="auth-error">{errorMessage}</p> : null}
        <button type="button" className="auth-primary-btn" onClick={() => loginRedirect(returnTo)}>
          Continue with Microsoft
        </button>
      </div>
    </section>
  );
}

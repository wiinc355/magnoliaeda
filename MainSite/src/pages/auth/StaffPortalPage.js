import { useAuth } from '../../auth/AuthContext';
import AuthLoginTabs from './AuthLoginTabs';

export default function StaffPortalPage() {
  const { user } = useAuth();

  return (
    <section className="auth-page-shell">
      <AuthLoginTabs />
      <div className="container auth-card">
        <h1>Staff Portal</h1>
        <p>Welcome, {user ? user.displayName : 'Staff Member'}.</p>
        <p>This area is available to Staff and Admin users.</p>
      </div>
    </section>
  );
}

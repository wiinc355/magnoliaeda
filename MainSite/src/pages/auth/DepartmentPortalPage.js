import { useAuth } from '../../auth/AuthContext';
import AuthLoginTabs from './AuthLoginTabs';

export default function DepartmentPortalPage() {
  const { user } = useAuth();

  return (
    <section className="auth-page-shell">
      <AuthLoginTabs />
      <div className="container auth-card">
        <h1>Department Portal</h1>
        <p>Welcome, {user ? user.displayName : 'Department User'}.</p>
        <p>This area is available to Department Users and Admin users.</p>
      </div>
    </section>
  );
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import RoleGate from '../../auth/RoleGate';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <div className="dash-user-avatar">
            {user ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="dash-user-info">
            <strong>{user ? user.displayName : 'Staff'}</strong>
            <span>{user ? user.mail : ''}</span>
          </div>
        </div>

        <nav className="dash-nav" aria-label="Dashboard navigation">
          <div className="dash-nav-section">
            <span className="dash-nav-label">Overview</span>
            <NavLink to="/dashboard" end className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#9632;</span> Dashboard
            </NavLink>
          </div>

          <div className="dash-nav-section">
            <span className="dash-nav-label">Content</span>
            <NavLink to="/dashboard/announcements" className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#128226;</span> Announcements
            </NavLink>
            <NavLink to="/dashboard/events" className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#128197;</span> Events
            </NavLink>
          </div>

          <div className="dash-nav-section">
            <span className="dash-nav-label">Resident Services</span>
            <NavLink to="/dashboard/contacts" className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#128101;</span> Contacts
            </NavLink>
            <NavLink to="/dashboard/projects" className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#128295;</span> Projects
            </NavLink>
            <NavLink to="/dashboard/personnel" className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#128188;</span> Staff & Personnel
            </NavLink>
            <NavLink to="/dashboard/building-addresses" className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#127970;</span> Building Addresses
            </NavLink>
            <NavLink to="/dashboard/profiles" className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}>
              <span className="dash-nav-icon">&#128100;</span> User Profiles
            </NavLink>
          </div>

          <RoleGate allow={['Admin']}>
            <div className="dash-nav-section">
              <span className="dash-nav-label">Administration</span>
              <button type="button" className="dash-nav-link dash-nav-btn" onClick={() => navigate('/admin-portal')}>
                <span className="dash-nav-icon">&#128737;</span> User Management
              </button>
            </div>
          </RoleGate>
        </nav>

        <div className="dash-sidebar-footer">
          <button type="button" className="dash-nav-link dash-nav-btn dash-signout" onClick={logout}>
            <span className="dash-nav-icon">&#8594;</span> Sign Out
          </button>
          <button type="button" className="dash-nav-link dash-nav-btn" onClick={() => navigate('/')}>
            <span className="dash-nav-icon">&#127968;</span> Public Site
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <Outlet />
      </div>
    </div>
  );
}

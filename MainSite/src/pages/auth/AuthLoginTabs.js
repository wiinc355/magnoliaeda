import { NavLink } from 'react-router-dom';

export default function AuthLoginTabs() {
  return (
    <div className="container auth-login-tabs-wrap" role="navigation" aria-label="Login tabs">
      <div className="auth-login-tabs-bar">
        <NavLink to="/login" end className={({ isActive }) => `auth-login-tab${isActive ? ' active' : ''}`}>
          Sign In
        </NavLink>
        <NavLink to="/staff-portal" className={({ isActive }) => `auth-login-tab${isActive ? ' active' : ''}`}>
          Staff Portal
        </NavLink>
        <NavLink to="/department-portal" className={({ isActive }) => `auth-login-tab${isActive ? ' active' : ''}`}>
          Department Portal
        </NavLink>
        <NavLink to="/admin-portal" className={({ isActive }) => `auth-login-tab${isActive ? ' active' : ''}`}>
          Admin Portal
        </NavLink>
      </div>
    </div>
  );
}

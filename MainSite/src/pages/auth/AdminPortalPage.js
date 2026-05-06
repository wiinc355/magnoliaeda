import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  downloadAuditLogsCsv,
  getAuditLogs,
  getAuthUsers,
  updateAuthUserRoles
} from '../../api/authApi';
import AuthLoginTabs from './AuthLoginTabs';

const AVAILABLE_ROLES = ['Admin', 'Staff', 'Department User', 'Public User'];

function toIsoRangeFromDateInput(value, isEndOfDay = false) {
  if (!value) return '';
  const suffix = isEndOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z';
  return `${value}${suffix}`;
}

function isoFromNowMinusDays(days) {
  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return from.toISOString();
}

export default function AdminPortalPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingUserId, setSavingUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPageSize] = useState(10);
  const [userTotal, setUserTotal] = useState(0);

  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditPageSize] = useState(20);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditAction, setAuditAction] = useState('');
  const [auditOutcome, setAuditOutcome] = useState('');
  const [auditFromDate, setAuditFromDate] = useState('');
  const [auditToDate, setAuditToDate] = useState('');
  const [auditRangePreset, setAuditRangePreset] = useState('all');
  const [auditExporting, setAuditExporting] = useState(false);

  const sortedUsers = useMemo(() => {
    return [...users].sort((left, right) => {
      const leftLabel = left.display_name || left.email || left.id;
      const rightLabel = right.display_name || right.email || right.id;
      return leftLabel.localeCompare(rightLabel);
    });
  }, [users]);

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      setLoading(true);
      setError('');

      try {
        const response = await getAuthUsers({
          q: userSearch,
          page: userPage,
          pageSize: userPageSize
        });
        if (mounted) {
          const normalized = (response.users || []).map((item) => ({
            ...item,
            roles: Array.isArray(item.roles) ? item.roles : []
          }));
          setUsers(normalized);
          setUserTotal(Number(response.total) || normalized.length);
        }
      } catch (_loadError) {
        if (mounted) {
          setError('Unable to load users. Verify your Admin role and backend connection.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [userSearch, userPage, userPageSize]);

  useEffect(() => {
    let mounted = true;

    async function loadAuditLogs() {
      setAuditLoading(true);
      setAuditError('');

      try {
        const response = await getAuditLogs({
          q: auditSearch,
          action: auditAction,
          outcome: auditOutcome,
          from: toIsoRangeFromDateInput(auditFromDate, false),
          to: toIsoRangeFromDateInput(auditToDate, true),
          page: auditPage,
          pageSize: auditPageSize
        });

        if (mounted) {
          setAuditLogs(Array.isArray(response.logs) ? response.logs : []);
          setAuditTotal(Number(response.total) || 0);
        }
      } catch (_auditLoadError) {
        if (mounted) {
          setAuditError('Unable to load audit logs.');
        }
      } finally {
        if (mounted) {
          setAuditLoading(false);
        }
      }
    }

    loadAuditLogs();

    return () => {
      mounted = false;
    };
  }, [auditSearch, auditAction, auditOutcome, auditFromDate, auditToDate, auditPage, auditPageSize]);

  function handleRoleToggle(targetUserId, roleName) {
    setUsers((currentUsers) => currentUsers.map((item) => {
      if (item.id !== targetUserId) {
        return item;
      }

      const currentRoles = Array.isArray(item.roles) ? item.roles : [];
      const hasRole = currentRoles.includes(roleName);
      const nextRoles = hasRole
        ? currentRoles.filter((role) => role !== roleName)
        : [...currentRoles, roleName];

      return {
        ...item,
        roles: nextRoles
      };
    }));
  }

  async function handleSaveRoles(targetUserId) {
    const selectedUser = users.find((item) => item.id === targetUserId);
    if (!selectedUser) {
      return;
    }

    setSavingUserId(targetUserId);
    setError('');
    setSuccessMessage('');

    try {
      await updateAuthUserRoles(targetUserId, selectedUser.roles);
      setSuccessMessage(`Roles updated for ${selectedUser.display_name || selectedUser.email || 'user'}.`);

      const response = await getAuthUsers({
        q: userSearch,
        page: userPage,
        pageSize: userPageSize
      });
      const normalized = (response.users || []).map((item) => ({
        ...item,
        roles: Array.isArray(item.roles) ? item.roles : []
      }));
      setUsers(normalized);
      setUserTotal(Number(response.total) || normalized.length);
    } catch (_saveError) {
      setError('Failed to update roles. Please try again.');
    } finally {
      setSavingUserId('');
    }
  }

  function handleAuditPreset(preset) {
    setAuditRangePreset(preset);
    setAuditPage(1);

    const now = new Date();
    if (preset === 'all') {
      setAuditFromDate('');
      setAuditToDate('');
      return;
    }

    if (preset === '24h') {
      const fromIso = isoFromNowMinusDays(1);
      setAuditFromDate(fromIso.slice(0, 10));
      setAuditToDate(now.toISOString().slice(0, 10));
      return;
    }

    if (preset === '7d') {
      const fromIso = isoFromNowMinusDays(7);
      setAuditFromDate(fromIso.slice(0, 10));
      setAuditToDate(now.toISOString().slice(0, 10));
      return;
    }

    if (preset === '30d') {
      const fromIso = isoFromNowMinusDays(30);
      setAuditFromDate(fromIso.slice(0, 10));
      setAuditToDate(now.toISOString().slice(0, 10));
    }
  }

  async function handleAuditExport() {
    setAuditExporting(true);
    setAuditError('');

    try {
      const csvText = await downloadAuditLogsCsv({
        q: auditSearch,
        action: auditAction,
        outcome: auditOutcome,
        from: toIsoRangeFromDateInput(auditFromDate, false),
        to: toIsoRangeFromDateInput(auditToDate, true),
        maxRows: 5000
      });

      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (_error) {
      setAuditError('Failed to export audit logs.');
    } finally {
      setAuditExporting(false);
    }
  }

  const totalUserPages = Math.max(1, Math.ceil(userTotal / userPageSize));
  const totalAuditPages = Math.max(1, Math.ceil(auditTotal / auditPageSize));

  return (
    <section className="auth-page-shell">
      <AuthLoginTabs />
      <div className="container auth-card auth-admin-card">
        <h1>Admin Portal</h1>
        <p>Welcome, {user ? user.displayName : 'Admin'}.</p>
        <p>Manage role assignments and security controls from this area.</p>

        {error ? <p className="auth-error">{error}</p> : null}
        {successMessage ? <p className="auth-success">{successMessage}</p> : null}

        <h2 className="auth-section-title">User Role Management</h2>
        <div className="auth-toolbar">
          <input
            type="search"
            className="auth-toolbar-input"
            value={userSearch}
            onChange={(event) => {
              setUserSearch(event.target.value);
              setUserPage(1);
            }}
            placeholder="Search users by name or email"
          />
          <span className="auth-toolbar-meta">{userTotal} users</span>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            <div className="auth-admin-table-wrap">
            <table className="auth-admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Active</th>
                  <th>Roles</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((item) => (
                  <tr key={item.id}>
                    <td>{item.display_name || 'Unknown User'}</td>
                    <td>{item.email || '-'}</td>
                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="auth-role-list">
                        {AVAILABLE_ROLES.map((role) => (
                          <label key={`${item.id}-${role}`} className="auth-role-item">
                            <input
                              type="checkbox"
                              checked={item.roles.includes(role)}
                              onChange={() => handleRoleToggle(item.id, role)}
                            />
                            <span>{role}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="auth-secondary-btn"
                        onClick={() => handleSaveRoles(item.id)}
                        disabled={savingUserId === item.id}
                      >
                        {savingUserId === item.id ? 'Saving...' : 'Save Roles'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="auth-pager">
              <button
                type="button"
                className="auth-tertiary-btn"
                onClick={() => setUserPage((current) => Math.max(1, current - 1))}
                disabled={userPage <= 1}
              >
                Previous
              </button>
              <span>Page {userPage} of {totalUserPages}</span>
              <button
                type="button"
                className="auth-tertiary-btn"
                onClick={() => setUserPage((current) => Math.min(totalUserPages, current + 1))}
                disabled={userPage >= totalUserPages}
              >
                Next
              </button>
            </div>
          </>
        )}

        <h2 className="auth-section-title">Security Audit Logs</h2>
        <div className="auth-toolbar auth-toolbar-compact">
          <div className="auth-range-pills">
            <button
              type="button"
              className={`auth-pill-btn${auditRangePreset === 'all' ? ' is-active' : ''}`}
              onClick={() => handleAuditPreset('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`auth-pill-btn${auditRangePreset === '24h' ? ' is-active' : ''}`}
              onClick={() => handleAuditPreset('24h')}
            >
              Last 24h
            </button>
            <button
              type="button"
              className={`auth-pill-btn${auditRangePreset === '7d' ? ' is-active' : ''}`}
              onClick={() => handleAuditPreset('7d')}
            >
              Last 7d
            </button>
            <button
              type="button"
              className={`auth-pill-btn${auditRangePreset === '30d' ? ' is-active' : ''}`}
              onClick={() => handleAuditPreset('30d')}
            >
              Last 30d
            </button>
          </div>
          <input
            type="search"
            className="auth-toolbar-input"
            value={auditSearch}
            onChange={(event) => {
              setAuditSearch(event.target.value);
              setAuditPage(1);
            }}
            placeholder="Search audit events"
          />
          <select
            className="auth-toolbar-select"
            value={auditAction}
            onChange={(event) => {
              setAuditAction(event.target.value);
              setAuditPage(1);
            }}
          >
            <option value="">All actions</option>
            <option value="auth.login">auth.login</option>
            <option value="auth.logout">auth.logout</option>
            <option value="auth.access_denied">auth.access_denied</option>
            <option value="rbac.access_denied">rbac.access_denied</option>
            <option value="rbac.role_change">rbac.role_change</option>
          </select>
          <select
            className="auth-toolbar-select"
            value={auditOutcome}
            onChange={(event) => {
              setAuditOutcome(event.target.value);
              setAuditPage(1);
            }}
          >
            <option value="">All outcomes</option>
            <option value="success">success</option>
            <option value="failure">failure</option>
          </select>
          <input
            type="date"
            className="auth-toolbar-select"
            value={auditFromDate}
            onChange={(event) => {
              setAuditRangePreset('custom');
              setAuditFromDate(event.target.value);
              setAuditPage(1);
            }}
            aria-label="Audit from date"
          />
          <input
            type="date"
            className="auth-toolbar-select"
            value={auditToDate}
            onChange={(event) => {
              setAuditRangePreset('custom');
              setAuditToDate(event.target.value);
              setAuditPage(1);
            }}
            aria-label="Audit to date"
          />
          <button
            type="button"
            className="auth-secondary-btn"
            onClick={handleAuditExport}
            disabled={auditExporting}
          >
            {auditExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <span className="auth-toolbar-meta">{auditTotal} events</span>
        </div>

        {auditError ? <p className="auth-error">{auditError}</p> : null}

        {auditLoading ? (
          <p>Loading audit logs...</p>
        ) : (
          <>
            <div className="auth-admin-table-wrap">
              <table className="auth-admin-table auth-audit-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>Outcome</th>
                    <th>Actor</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((entry) => (
                    <tr key={entry.id}>
                      <td>{new Date(entry.created_at).toLocaleString()}</td>
                      <td>{entry.action}</td>
                      <td>{entry.outcome}</td>
                      <td>{entry.actor_display_name || entry.actor_email || '-'}</td>
                      <td>{entry.ip_address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="auth-pager">
              <button
                type="button"
                className="auth-tertiary-btn"
                onClick={() => setAuditPage((current) => Math.max(1, current - 1))}
                disabled={auditPage <= 1}
              >
                Previous
              </button>
              <span>Page {auditPage} of {totalAuditPages}</span>
              <button
                type="button"
                className="auth-tertiary-btn"
                onClick={() => setAuditPage((current) => Math.min(totalAuditPages, current + 1))}
                disabled={auditPage >= totalAuditPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

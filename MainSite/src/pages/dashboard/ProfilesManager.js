import { useEffect, useState } from 'react';
import { getAllProfiles } from '../../api/profilesApi';

const ROLE_COLORS = {
  'Admin': '#7c3aed',
  'Staff': '#0a4f90',
  'Department User': '#0e7a60',
  'Public User': '#555'
};

const ROLE_OPTIONS = ['', 'Admin', 'Staff', 'Department User', 'Public User'];

function avatarSrc(p) {
  if (p.avatar_url) return p.avatar_url;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(p.display_name || 'User')}&background=0a4f90&color=fff&size=128`;
}

function formatDate(iso) {
  if (!iso) return '—';
  const [year, month, day] = iso.split('-');
  if (!year) return '—';
  return new Date(Number(year), Number(month) - 1, Number(day))
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProfilesManager() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    getAllProfiles({ q: search, role: roleFilter })
      .then((data) => { if (mounted) setProfiles(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setError('Failed to load profiles.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [search, roleFilter]);

  return (
    <div className="prof-manager">
      <div className="prof-manager-header">
        <h2 className="prof-manager-title">User Profiles</h2>
        <p className="prof-manager-sub">{profiles.length} profile{profiles.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="prof-toolbar">
        <input
          type="search"
          className="prof-search"
          placeholder="Search by name, email, or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="prof-role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r || 'All roles'}</option>
          ))}
        </select>
      </div>

      {error ? <p className="prof-error">{error}</p> : null}

      {loading ? (
        <p className="prof-loading">Loading profiles…</p>
      ) : profiles.length === 0 ? (
        <p className="prof-empty">No profiles found.</p>
      ) : (
        <div className="prof-grid">
          {profiles.map((p) => {
            const isOpen = expanded === p.id;
            const roleColor = ROLE_COLORS[p.role_label] || '#555';
            return (
              <div key={p.id} className={`prof-card${isOpen ? ' is-open' : ''}`}>
                <div className="prof-card-top">
                  <img
                    src={avatarSrc(p)}
                    alt={p.display_name}
                    className="prof-card-avatar"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.display_name)}&background=0a4f90&color=fff&size=128`;
                    }}
                  />
                  <div className="prof-card-info">
                    <strong className="prof-card-name">{p.display_name}</strong>
                    {p.job_title ? <span className="prof-card-title">{p.job_title}</span> : null}
                    {p.department ? <span className="prof-card-dept">{p.department}</span> : null}
                    <span className="prof-card-badge" style={{ background: roleColor }}>
                      {p.role_label || 'Public User'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="prof-card-toggle"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : p.id)}
                  >
                    {isOpen ? '▲' : '▼'}
                  </button>
                </div>

                {isOpen ? (
                  <dl className="prof-card-details">
                    <div className="prof-card-detail-row">
                      <dt>Email</dt>
                      <dd>{p.email || '—'}</dd>
                    </div>
                    <div className="prof-card-detail-row">
                      <dt>Phone</dt>
                      <dd>{p.phone || '—'}</dd>
                    </div>
                    <div className="prof-card-detail-row">
                      <dt>Date of Birth</dt>
                      <dd>{formatDate(p.birth_date)}</dd>
                    </div>
                    {p.bio ? (
                      <div className="prof-card-detail-row prof-card-bio">
                        <dt>Bio</dt>
                        <dd>{p.bio}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

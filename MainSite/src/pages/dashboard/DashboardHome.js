import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../api/cmsApi';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError('Could not load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-content">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Dashboard</h1>
        <p className="dash-page-subtitle">City of Magnolia — Content Management</p>
      </div>

      {loading && <p className="dash-loading">Loading stats&hellip;</p>}
      {error && <p className="dash-error">{error}</p>}

      {stats && (
        <>
          <div className="dash-stat-grid">
            <button type="button" className="dash-stat-card" onClick={() => navigate('/dashboard/contacts')}>
              <span className="dash-stat-icon">&#128101;</span>
              <span className="dash-stat-value">{stats.totalContacts}</span>
              <span className="dash-stat-label">Contacts</span>
            </button>
            <button type="button" className="dash-stat-card" onClick={() => navigate('/dashboard/projects')}>
              <span className="dash-stat-icon">&#128295;</span>
              <span className="dash-stat-value">{stats.totalProjects}</span>
              <span className="dash-stat-label">Projects</span>
            </button>
            <button type="button" className="dash-stat-card" onClick={() => navigate('/dashboard/announcements')}>
              <span className="dash-stat-icon">&#128226;</span>
              <span className="dash-stat-value">{stats.totalAnnouncements}</span>
              <span className="dash-stat-label">Active Announcements</span>
            </button>
            <button type="button" className="dash-stat-card" onClick={() => navigate('/dashboard/events')}>
              <span className="dash-stat-icon">&#128197;</span>
              <span className="dash-stat-value">{stats.totalEvents}</span>
              <span className="dash-stat-label">Active Events</span>
            </button>
            <button type="button" className="dash-stat-card" onClick={() => navigate('/dashboard/personnel')}>
              <span className="dash-stat-icon">&#128188;</span>
              <span className="dash-stat-value">{stats.totalPersonnel || 0}</span>
              <span className="dash-stat-label">Active Personnel</span>
            </button>
            <button type="button" className="dash-stat-card" onClick={() => navigate('/dashboard/building-addresses')}>
              <span className="dash-stat-icon">&#127970;</span>
              <span className="dash-stat-value">{stats.totalBuildings || 0}</span>
              <span className="dash-stat-label">Active Buildings</span>
            </button>
          </div>

          <div className="dash-recent-grid">
            <div className="dash-recent-card">
              <h2 className="dash-section-title">Recent Contacts</h2>
              {stats.recentContacts.length === 0 ? (
                <p className="dash-empty">No contacts yet.</p>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentContacts.map((c) => (
                      <tr key={c.id}>
                        <td>{c.full_name}</td>
                        <td>{c.email || '—'}</td>
                        <td>{c.phone || '—'}</td>
                        <td>{c.created_at ? c.created_at.substring(0, 10) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dash-recent-card">
              <h2 className="dash-section-title">Upcoming Events</h2>
              {stats.upcomingEvents.length === 0 ? (
                <p className="dash-empty">No upcoming events.</p>
              ) : (
                <ul className="dash-event-list">
                  {stats.upcomingEvents.map((e) => (
                    <li key={e.id} className="dash-event-item">
                      <span className="dash-event-date">{e.event_date}</span>
                      <span className="dash-event-title">{e.title}</span>
                      {e.location && <span className="dash-event-loc">{e.location}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  getSubscribers, updateSubscriber, deleteSubscriber,
  getNotificationsLog, sendBlast
} from '../../api/cmsApi';

const STATUS_OPTIONS = [
  { value: 'all',          label: 'All Statuses' },
  { value: 'pending',      label: 'Pending Confirmation' },
  { value: 'active',       label: 'Active' },
  { value: 'rejected',     label: 'Rejected' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
];

function badgeClass(status) {
  if (status === 'active')       return 'dash-badge dash-badge-active';
  if (status === 'pending')      return 'dash-badge dash-badge-scheduled';
  if (status === 'rejected')     return 'dash-badge dash-badge-expired';
  return 'dash-badge dash-badge-inactive';
}

function fmtDt(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  if (isNaN(d)) return dt;
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function parseCats(s) {
  try { return JSON.parse(s || '[]'); } catch (_) { return []; }
}

export default function SubscribersManager() {
  const [tab, setTab]                 = useState('subscribers');
  const [items, setItems]             = useState([]);
  const [logs, setLogs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [perPage, setPerPage]         = useState(10);
  const [page, setPage]               = useState(1);

  const [showBlast, setShowBlast]     = useState(false);
  const [blastForm, setBlastForm]     = useState({ subject: '', body: '', category: '' });
  const [blastSending, setBlastSending] = useState(false);
  const [blastResult, setBlastResult]   = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    const fn = tab === 'subscribers' ? getSubscribers : getNotificationsLog;
    fn()
      .then((rows) => { if (tab === 'subscribers') setItems(rows); else setLogs(rows); })
      .catch(() => setError(tab === 'subscribers' ? 'Could not load subscribers.' : 'Could not load notifications log.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  async function setStatus(id, status) {
    try { await updateSubscriber(id, { status }); load(); }
    catch (err) { alert('Update failed: ' + (err.message || 'Unknown error')); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Permanently delete this subscriber? This removes their record entirely.')) return;
    try { await deleteSubscriber(id); load(); }
    catch (err) { alert('Delete failed: ' + (err.message || 'Unknown error')); }
  }

  async function handleSendBlast(e) {
    e.preventDefault();
    setBlastSending(true);
    setBlastResult(null);
    try {
      const res = await sendBlast({
        subject: blastForm.subject,
        body: blastForm.body,
        category: blastForm.category || null
      });
      setBlastResult(res);
    } catch (err) {
      setBlastResult({ error: err.message || 'Blast failed' });
    } finally {
      setBlastSending(false);
    }
  }

  const filtered = useMemo(() => {
    let list = [...items];
    if (statusFilter !== 'all') {
      list = list.filter((s) => s.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        (s.full_name || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.phone || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const counts = useMemo(() => ({
    total:        items.length,
    active:       items.filter((s) => s.status === 'active').length,
    pending:      items.filter((s) => s.status === 'pending').length,
    unsubscribed: items.filter((s) => s.status === 'unsubscribed').length,
  }), [items]);

  return (
    <div className="dash-content">
      <div className="dash-page-header">
        <h1 className="dash-page-title">eNotify Subscribers</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={() => setShowBlast((v) => !v)}>
          {showBlast ? 'Close Compose' : '✉ Compose Blast'}
        </button>
      </div>

      <div className="sub-stat-row">
        <div className="sub-stat"><span className="sub-stat-num">{counts.total}</span><span>Total</span></div>
        <div className="sub-stat sub-stat-green"><span className="sub-stat-num">{counts.active}</span><span>Active</span></div>
        <div className="sub-stat sub-stat-yellow"><span className="sub-stat-num">{counts.pending}</span><span>Pending</span></div>
        <div className="sub-stat sub-stat-grey"><span className="sub-stat-num">{counts.unsubscribed}</span><span>Unsubscribed</span></div>
      </div>

      {showBlast && (
        <form className="sub-blast-card" onSubmit={handleSendBlast}>
          <h3>Compose Notification</h3>
          <div className="dash-form-row">
            <label className="dash-label">Category (optional — leave blank to send to everyone)</label>
            <input className="dash-input" value={blastForm.category}
              placeholder="e.g. Public Safety"
              onChange={(e) => setBlastForm((f) => ({ ...f, category: e.target.value }))} />
          </div>
          <div className="dash-form-row">
            <label className="dash-label">Subject <span className="dash-required">*</span></label>
            <input className="dash-input" required value={blastForm.subject}
              onChange={(e) => setBlastForm((f) => ({ ...f, subject: e.target.value }))} />
          </div>
          <div className="dash-form-row">
            <label className="dash-label">Message <span className="dash-required">*</span></label>
            <textarea className="dash-textarea" rows={4} required value={blastForm.body}
              onChange={(e) => setBlastForm((f) => ({ ...f, body: e.target.value }))} />
          </div>
          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={blastSending}>
              {blastSending ? 'Sending…' : 'Send to Subscribers'}
            </button>
          </div>
          {blastResult && !blastResult.error && (
            <p className="dash-schedule-hint" style={{ marginTop: '0.5rem' }}>
              ✓ Queued {blastResult.sent} message{blastResult.sent === 1 ? '' : 's'}
              {blastResult.mocked ? ' (mock mode — see Notifications Log tab)' : ''}.
            </p>
          )}
          {blastResult && blastResult.error && <p className="dash-error">{blastResult.error}</p>}
        </form>
      )}

      <div className="sub-tabs">
        <button type="button" className={`sub-tab${tab === 'subscribers' ? ' is-active' : ''}`} onClick={() => setTab('subscribers')}>Subscribers</button>
        <button type="button" className={`sub-tab${tab === 'log' ? ' is-active' : ''}`} onClick={() => setTab('log')}>Notifications Log</button>
      </div>

      {loading && <p className="dash-loading">Loading…</p>}
      {error && <p className="dash-error">{error}</p>}

      {!loading && !error && tab === 'subscribers' && (
        <>
          <div className="dash-toolbar">
            <input
              type="search" className="dash-search"
              placeholder="Search name, email, or phone…"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select className="dash-per-page-select" value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <label className="dash-per-page-label">
              Show&nbsp;
              <select className="dash-per-page-select" value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>

          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Channels</th>
                  <th>Categories</th>
                  <th>Status</th>
                  <th>Subscribed</th>
                  <th>Confirmed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr><td colSpan={9} className="dash-empty-cell">No subscribers match.</td></tr>
                ) : pageItems.map((s) => {
                  const cats = parseCats(s.categories);
                  return (
                    <tr key={s.id}>
                      <td className="dash-td-primary">{s.full_name}</td>
                      <td>{s.email || '—'}</td>
                      <td>{s.phone || '—'}</td>
                      <td>{(s.channels || '').split(',').filter(Boolean).join(', ') || '—'}</td>
                      <td>{cats.length ? cats.join(', ') : 'All'}</td>
                      <td><span className={badgeClass(s.status)}>{s.status}</span></td>
                      <td className="dash-td-schedule">{fmtDt(s.created_at)}</td>
                      <td className="dash-td-schedule">{fmtDt(s.confirmed_at)}</td>
                      <td className="dash-td-actions">
                        {s.status === 'pending' && (
                          <button type="button" className="dash-action-btn" onClick={() => setStatus(s.id, 'active')}>Approve</button>
                        )}
                        {s.status === 'active' && (
                          <button type="button" className="dash-action-btn" onClick={() => setStatus(s.id, 'unsubscribed')}>Unsubscribe</button>
                        )}
                        {(s.status === 'unsubscribed' || s.status === 'rejected') && (
                          <button type="button" className="dash-action-btn" onClick={() => setStatus(s.id, 'active')}>Reactivate</button>
                        )}
                        <button type="button" className="dash-action-btn dash-action-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="dash-pagination">
              <button className="dash-page-btn" onClick={() => setPage((p) => p - 1)} disabled={safePage === 1}>‹ Prev</button>
              <span className="dash-page-info">{safePage} / {totalPages} &nbsp;·&nbsp; {filtered.length} total</span>
              <button className="dash-page-btn" onClick={() => setPage((p) => p + 1)} disabled={safePage === totalPages}>Next ›</button>
            </div>
          )}
        </>
      )}

      {!loading && !error && tab === 'log' && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Sent</th>
                <th>Channel</th>
                <th>Recipient</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={6} className="dash-empty-cell">No notifications sent yet.</td></tr>
              ) : logs.map((n) => (
                <tr key={n.id}>
                  <td className="dash-td-schedule">{fmtDt(n.sent_at)}</td>
                  <td>{n.channel}</td>
                  <td>{n.recipient}</td>
                  <td className="dash-td-primary">{n.subject || '—'}</td>
                  <td>{n.related_type || '—'}</td>
                  <td><span className={n.status === 'mocked' ? 'dash-badge dash-badge-scheduled' : 'dash-badge dash-badge-active'}>{n.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement
} from '../../api/cmsApi';

const BLANK = {
  title: '', body: '', category: 'General',
  is_active: 1, publish_at: '', expires_at: ''
};

function localNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function scheduleStatus(item) {
  if (!item.is_active) return 'Inactive';
  const now = localNow();
  const pub = item.published_at || '';
  const exp = item.expires_at || '';
  if (pub && pub > now) return 'Scheduled';
  if (exp && exp <= now) return 'Expired';
  return 'Active';
}

function statusBadgeClass(status) {
  if (status === 'Active')    return 'dash-badge dash-badge-active';
  if (status === 'Scheduled') return 'dash-badge dash-badge-scheduled';
  if (status === 'Expired')   return 'dash-badge dash-badge-expired';
  return 'dash-badge dash-badge-inactive';
}

// Map DB published_at → form publish_at (same field, different key for clarity)
function itemToForm(item) {
  return {
    title:      item.title || '',
    body:       item.body || '',
    category:   item.category || 'General',
    is_active:  item.is_active === undefined ? 1 : item.is_active,
    publish_at: item.published_at || '',
    expires_at: item.expires_at || ''
  };
}

export default function AnnouncementsManager() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(BLANK);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState(null);

  function load() {
    setLoading(true);
    getAnnouncements()
      .then(setItems)
      .catch(() => setError('Could not load announcements.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew()        { setForm(BLANK); setEditing('new'); setSaveError(null); }
  function openEdit(item)   { setForm(itemToForm(item)); setEditing(item.id); setSaveError(null); }
  function cancelEdit()     { setEditing(null); setSaveError(null); }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      if (editing === 'new') { await createAnnouncement(form); }
      else { await updateAnnouncement(editing, form); }
      setEditing(null);
      load();
    } catch (err) {
      setSaveError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this announcement?')) return;
    try { await deleteAnnouncement(id); load(); }
    catch (err) { alert('Delete failed: ' + (err.message || 'Unknown error')); }
  }

  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">{editing === 'new' ? 'New Announcement' : 'Edit Announcement'}</h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>
        <form className="dash-form" onSubmit={handleSubmit}>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ann-title">Title <span className="dash-required">*</span></label>
            <input id="ann-title" name="title" className="dash-input" value={form.title} onChange={handleChange} required />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ann-category">Category</label>
            <select id="ann-category" name="category" className="dash-select" value={form.category} onChange={handleChange}>
              <option>General</option>
              <option>Public Safety</option>
              <option>Public Works</option>
              <option>Events</option>
              <option>Emergency</option>
              <option>Government</option>
            </select>
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ann-body">Body</label>
            <textarea id="ann-body" name="body" className="dash-textarea" rows={6} value={form.body} onChange={handleChange} />
          </div>

          <div className="dash-form-section-label">Scheduling</div>
          <div className="dash-schedule-hint">
            Leave both blank to publish immediately. Set <strong>Publish At</strong> to delay going live.
            Set <strong>Expires At</strong> to auto-disable on that date and time.
          </div>
          <div className="dash-form-cols">
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ann-publish">Publish At</label>
              <input id="ann-publish" name="publish_at" type="datetime-local" className="dash-input"
                value={form.publish_at} onChange={handleChange} />
            </div>
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ann-expires">Expires At</label>
              <input id="ann-expires" name="expires_at" type="datetime-local" className="dash-input"
                value={form.expires_at} onChange={handleChange} />
            </div>
          </div>

          <div className="dash-form-row dash-form-check">
            <input id="ann-active" name="is_active" type="checkbox" checked={!!form.is_active} onChange={handleChange} />
            <label htmlFor="ann-active">Active (visible on site)</label>
          </div>

          {saveError && <p className="dash-error">{saveError}</p>}
          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Announcement'}
            </button>
            <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="dash-content">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Announcements</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Announcement</button>
      </div>
      {loading && <p className="dash-loading">Loading…</p>}
      {error && <p className="dash-error">{error}</p>}
      {!loading && !error && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Publish At</th>
                <th>Expires At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className="dash-empty-cell">No announcements yet.</td></tr>
              ) : items.map((item) => {
                const status = scheduleStatus(item);
                return (
                  <tr key={item.id}>
                    <td className="dash-td-primary">{item.title}</td>
                    <td>{item.category}</td>
                    <td>
                      <span className={statusBadgeClass(status)}>{status}</span>
                    </td>
                    <td className="dash-td-schedule">{item.published_at ? fmtDt(item.published_at) : '—'}</td>
                    <td className="dash-td-schedule">{item.expires_at ? fmtDt(item.expires_at) : '—'}</td>
                    <td className="dash-td-actions">
                      <button type="button" className="dash-action-btn" onClick={() => openEdit(item)}>Edit</button>
                      <button type="button" className="dash-action-btn dash-action-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function fmtDt(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  if (isNaN(d)) return dt;
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

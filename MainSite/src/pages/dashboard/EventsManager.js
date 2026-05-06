import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../api/cmsApi';

const BLANK = {
  title: '', description: '', location: '',
  event_date: '', end_date: '',
  start_time: '', end_time: '',
  category: 'General', is_active: 1,
  contact_name: '', contact_phone: '', contact_email: '',
  publish_at: '', expires_at: ''
};

function fmt12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function fmtDt(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  if (isNaN(d)) return dt;
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function localNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function scheduleStatus(item) {
  if (!item.is_active) return 'Inactive';
  const now = localNow();
  const pub = item.publish_at || '';
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

export default function EventsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  function load() {
    setLoading(true);
    getEvents()
      .then(setItems)
      .catch(() => setError('Could not load events.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() { setForm(BLANK); setEditing('new'); setSaveError(null); }

  function openEdit(item) {
    setForm({
      title: item.title || '',
      description: item.description || '',
      location: item.location || '',
      event_date: item.event_date || '',
      end_date: item.end_date || '',
      start_time: item.start_time || '',
      end_time: item.end_time || '',
      category: item.category || 'General',
      is_active: item.is_active === undefined ? 1 : item.is_active,
      contact_name: item.contact_name || '',
      contact_phone: item.contact_phone || '',
      contact_email: item.contact_email || '',
      publish_at: item.publish_at || '',
      expires_at: item.expires_at || ''
    });
    setEditing(item.id);
    setSaveError(null);
  }

  function cancelEdit() { setEditing(null); setSaveError(null); }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      if (editing === 'new') { await createEvent(form); }
      else { await updateEvent(editing, form); }
      setEditing(null);
      load();
    } catch (err) {
      setSaveError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    try { await deleteEvent(id); load(); }
    catch (err) { alert('Delete failed: ' + (err.message || 'Unknown error')); }
  }

  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">{editing === 'new' ? 'New Event' : 'Edit Event'}</h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>
        <form className="dash-form" onSubmit={handleSubmit}>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ev-title">Title <span className="dash-required">*</span></label>
            <input id="ev-title" name="title" className="dash-input" value={form.title} onChange={handleChange} required />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ev-category">Category</label>
            <select id="ev-category" name="category" className="dash-select" value={form.category} onChange={handleChange}>
              <option>General</option>
              <option>City Council</option>
              <option>Public Hearing</option>
              <option>Parks & Recreation</option>
              <option>Community</option>
              <option>Public Safety</option>
              <option>Public Works</option>
              <option>Government</option>
              <option>Holiday</option>
            </select>
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ev-location">Location</label>
            <input id="ev-location" name="location" className="dash-input" value={form.location} onChange={handleChange} />
          </div>

          <div className="dash-form-cols">
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-start">Start Date <span className="dash-required">*</span></label>
              <input id="ev-start" name="event_date" type="date" className="dash-input" value={form.event_date} onChange={handleChange} required />
            </div>
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-end">End Date</label>
              <input id="ev-end" name="end_date" type="date" className="dash-input" value={form.end_date} onChange={handleChange} />
            </div>
          </div>

          <div className="dash-form-cols">
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-start-time">Start Time</label>
              <input id="ev-start-time" name="start_time" type="time" className="dash-input" value={form.start_time} onChange={handleChange} />
            </div>
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-end-time">End Time</label>
              <input id="ev-end-time" name="end_time" type="time" className="dash-input" value={form.end_time} onChange={handleChange} />
            </div>
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ev-desc">Description</label>
            <textarea id="ev-desc" name="description" className="dash-textarea" rows={4} value={form.description} onChange={handleChange} />
          </div>

          <div className="dash-form-section-label">Event Contact</div>
          <div className="dash-form-cols">
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-cname">Contact Name</label>
              <input id="ev-cname" name="contact_name" className="dash-input" value={form.contact_name} onChange={handleChange} />
            </div>
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-cphone">Contact Phone</label>
              <input id="ev-cphone" name="contact_phone" className="dash-input" value={form.contact_phone} onChange={handleChange} />
            </div>
          </div>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="ev-cemail">Contact Email</label>
            <input id="ev-cemail" name="contact_email" type="email" className="dash-input" value={form.contact_email} onChange={handleChange} />
          </div>

          <div className="dash-form-section-label">Scheduling</div>
          <div className="dash-schedule-hint">
            Leave both blank to publish immediately. Set <strong>Publish At</strong> to delay going live.
            Set <strong>Expires At</strong> to auto-disable on that date and time.
          </div>
          <div className="dash-form-cols">
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-publish">Publish At</label>
              <input id="ev-publish" name="publish_at" type="datetime-local" className="dash-input"
                value={form.publish_at} onChange={handleChange} />
            </div>
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="ev-expires">Expires At</label>
              <input id="ev-expires" name="expires_at" type="datetime-local" className="dash-input"
                value={form.expires_at} onChange={handleChange} />
            </div>
          </div>

          <div className="dash-form-row dash-form-check">
            <input id="ev-active" name="is_active" type="checkbox" checked={!!form.is_active} onChange={handleChange} />
            <label htmlFor="ev-active">Active (visible on site)</label>
          </div>

          {saveError && <p className="dash-error">{saveError}</p>}
          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Event'}
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
        <h1 className="dash-page-title">Events</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Event</button>
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
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Publish At</th>
                <th>Expires At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={8} className="dash-empty-cell">No events yet.</td></tr>
              ) : items.map((item) => {
                const status = scheduleStatus(item);
                return (
                <tr key={item.id}>
                  <td className="dash-td-primary">{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.event_date}{item.end_date && item.end_date !== item.event_date ? ` – ${item.end_date}` : ''}</td>
                  <td>{item.start_time ? fmt12(item.start_time) : '—'}{item.end_time ? ` – ${fmt12(item.end_time)}` : ''}</td>
                  <td>
                    <span className={statusBadgeClass(status)}>{status}</span>
                  </td>
                  <td className="dash-td-schedule">{item.publish_at ? fmtDt(item.publish_at) : '—'}</td>
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

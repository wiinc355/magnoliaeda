import { useState, useEffect, useMemo } from 'react';
import {
  getMarqueeSettings, updateMarqueeSettings,
  getMarqueeMessages, createMarqueeMessage,
  updateMarqueeMessage, deleteMarqueeMessage
} from '../../api/cmsApi';

const BLANK = {
  text: '', link_url: '', is_active: 1,
  sort_order: 0, publish_at: '', expires_at: ''
};

function localNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fmtDt(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  if (isNaN(d)) return dt;
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
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

function badgeClass(s) {
  if (s === 'Active')    return 'dash-badge dash-badge-active';
  if (s === 'Scheduled') return 'dash-badge dash-badge-scheduled';
  if (s === 'Expired')   return 'dash-badge dash-badge-expired';
  return 'dash-badge dash-badge-inactive';
}

function speedLabel(s) {
  if (s <= 15) return 'Very Fast';
  if (s <= 25) return 'Fast';
  if (s <= 45) return 'Medium';
  if (s <= 75) return 'Slow';
  return 'Very Slow';
}

export default function MarqueeManager() {
  const [settings, setSettings] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(BLANK);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved]   = useState(false);

  function load() {
    setLoading(true);
    setError(null);
    Promise.all([getMarqueeSettings(), getMarqueeMessages()])
      .then(([s, m]) => { setSettings(s); setMessages(m); })
      .catch(() => setError('Could not load marquee data.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function saveSettings(patch) {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    setSettingsSaving(true);
    setSettingsSaved(false);
    try {
      await updateMarqueeSettings(next);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 1500);
    } catch (_) {
      alert('Failed to save marquee settings.');
    } finally {
      setSettingsSaving(false);
    }
  }

  function openNew() {
    const nextOrder = (messages.reduce((m, x) => Math.max(m, x.sort_order || 0), 0) + 10);
    setForm({ ...BLANK, sort_order: nextOrder });
    setEditing('new');
    setSaveError(null);
  }

  function openEdit(m) {
    setForm({
      text:        m.text || '',
      link_url:    m.link_url || '',
      is_active:   m.is_active === undefined ? 1 : m.is_active,
      sort_order:  m.sort_order || 0,
      publish_at:  m.publish_at || '',
      expires_at:  m.expires_at || ''
    });
    setEditing(m.id);
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
      if (editing === 'new') await createMarqueeMessage(form);
      else                   await updateMarqueeMessage(editing, form);
      setEditing(null);
      load();
    } catch (err) {
      setSaveError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this marquee message?')) return;
    try { await deleteMarqueeMessage(id); load(); }
    catch (err) { alert('Delete failed: ' + (err.message || 'Unknown error')); }
  }

  async function toggleActive(m) {
    try { await updateMarqueeMessage(m.id, { ...m, is_active: m.is_active ? 0 : 1 }); load(); }
    catch (_) { alert('Failed to toggle message.'); }
  }

  const stats = useMemo(() => {
    return messages.reduce((acc, m) => {
      acc.total++;
      const s = scheduleStatus(m);
      if (s === 'Active') acc.active++;
      else if (s === 'Scheduled') acc.scheduled++;
      else if (s === 'Expired') acc.expired++;
      else acc.inactive++;
      return acc;
    }, { total: 0, active: 0, scheduled: 0, expired: 0, inactive: 0 });
  }, [messages]);

  if (loading) return <div className="dash-content"><p className="dash-loading">Loading marquee…</p></div>;
  if (error)   return <div className="dash-content"><p className="dash-error">{error}</p></div>;

  // ── Edit form view ────────────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">{editing === 'new' ? 'New Marquee Message' : 'Edit Marquee Message'}</h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>
        <form className="dash-form" onSubmit={handleSubmit}>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="mq-text">Message Text <span className="dash-required">*</span></label>
            <input id="mq-text" name="text" className="dash-input" value={form.text}
              onChange={handleChange} required maxLength={300}
              placeholder="e.g. City Hall closed Monday for Memorial Day" />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="mq-link">Link URL (optional)</label>
            <input id="mq-link" name="link_url" className="dash-input" value={form.link_url}
              onChange={handleChange} placeholder="/events or https://..." />
            <p className="dash-schedule-hint">Internal path like <code>/events</code> or full external URL. Leave blank for plain text.</p>
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="mq-order">Display Order</label>
            <input id="mq-order" name="sort_order" type="number" className="dash-input" value={form.sort_order}
              onChange={handleChange} style={{ maxWidth: 180 }} />
            <p className="dash-schedule-hint">Lower numbers scroll first.</p>
          </div>

          <div className="dash-form-section-label">Scheduling</div>
          <div className="dash-schedule-hint">
            Leave both blank to publish immediately. Set <strong>Publish At</strong> to delay; set <strong>Expires At</strong> to auto-remove.
          </div>
          <div className="dash-form-cols">
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="mq-publish">Publish At</label>
              <input id="mq-publish" name="publish_at" type="datetime-local" className="dash-input"
                value={form.publish_at} onChange={handleChange} />
            </div>
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="mq-expires">Expires At</label>
              <input id="mq-expires" name="expires_at" type="datetime-local" className="dash-input"
                value={form.expires_at} onChange={handleChange} />
            </div>
          </div>

          <div className="dash-form-row dash-form-check">
            <input id="mq-active" name="is_active" type="checkbox"
              checked={!!form.is_active} onChange={handleChange} />
            <label htmlFor="mq-active">Active (eligible to display)</label>
          </div>

          {saveError && <p className="dash-error">{saveError}</p>}
          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Message'}
            </button>
            <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // ── List + settings view ──────────────────────────────────────────────────
  return (
    <div className="dash-content">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Marquee Manager</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Message</button>
      </div>

      {/* Marquee controls */}
      <div className="mq-controls-card">
        <div className="mq-controls-row">
          <label className="mq-toggle">
            <input type="checkbox" checked={!!settings?.is_enabled}
              onChange={(e) => saveSettings({ is_enabled: e.target.checked ? 1 : 0 })} />
            <span className="mq-toggle-slider" />
          </label>
          <div className="mq-controls-label">
            <strong>Marquee {settings?.is_enabled ? 'Running' : 'Stopped'}</strong>
            <span className="mq-controls-sub">
              {settings?.is_enabled
                ? 'Currently visible on every public page.'
                : 'Hidden from all public pages.'}
            </span>
          </div>
          {settingsSaving && <span className="mq-saving">Saving…</span>}
          {settingsSaved && <span className="mq-saved">✓ Saved</span>}
        </div>

        <div className="mq-controls-row mq-controls-speed">
          <label htmlFor="mq-speed" className="mq-speed-label">
            <strong>Speed</strong>
            <span className="mq-controls-sub">{settings?.duration_seconds}s per loop · {speedLabel(settings?.duration_seconds || 40)}</span>
          </label>
          <input
            id="mq-speed" type="range"
            min={10} max={120} step={5}
            value={settings?.duration_seconds || 40}
            onChange={(e) => saveSettings({ duration_seconds: Number(e.target.value) })}
            className="mq-speed-slider"
          />
        </div>

        <div className="mq-controls-row mq-controls-colors">
          <label className="mq-color-field">
            <span className="mq-controls-sub">Background</span>
            <input type="color" value={settings?.background_color || '#0a4f90'}
              onChange={(e) => saveSettings({ background_color: e.target.value })} />
          </label>
          <label className="mq-color-field">
            <span className="mq-controls-sub">Text</span>
            <input type="color" value={settings?.text_color || '#ffffff'}
              onChange={(e) => saveSettings({ text_color: e.target.value })} />
          </label>
          <div className="mq-preview" style={{
            background: settings?.background_color || '#0a4f90',
            color: settings?.text_color || '#ffffff'
          }}>
            <span>•&nbsp;Preview&nbsp;•&nbsp;City announcements scroll here</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="sub-stat-row">
        <div className="sub-stat"><span className="sub-stat-num">{stats.total}</span><span>Total</span></div>
        <div className="sub-stat sub-stat-green"><span className="sub-stat-num">{stats.active}</span><span>Active</span></div>
        <div className="sub-stat sub-stat-yellow"><span className="sub-stat-num">{stats.scheduled}</span><span>Scheduled</span></div>
        <div className="sub-stat sub-stat-grey"><span className="sub-stat-num">{stats.expired + stats.inactive}</span><span>Off Air</span></div>
      </div>

      {/* Messages table */}
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Text</th>
              <th>Link</th>
              <th>Status</th>
              <th>Publish At</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan={7} className="dash-empty-cell">No marquee messages yet. Click “+ New Message” to add one.</td></tr>
            ) : messages.map((m) => {
              const status = scheduleStatus(m);
              return (
                <tr key={m.id}>
                  <td>{m.sort_order}</td>
                  <td className="dash-td-primary">{m.text}</td>
                  <td>{m.link_url ? <code style={{ fontSize: '0.8rem' }}>{m.link_url}</code> : '—'}</td>
                  <td><span className={badgeClass(status)}>{status}</span></td>
                  <td className="dash-td-schedule">{fmtDt(m.publish_at)}</td>
                  <td className="dash-td-schedule">{fmtDt(m.expires_at)}</td>
                  <td className="dash-td-actions">
                    <button type="button" className="dash-action-btn" onClick={() => toggleActive(m)}>
                      {m.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button type="button" className="dash-action-btn" onClick={() => openEdit(m)}>Edit</button>
                    <button type="button" className="dash-action-btn dash-action-delete" onClick={() => handleDelete(m.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

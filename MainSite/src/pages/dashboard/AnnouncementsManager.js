import { useState, useEffect, useMemo, useRef } from 'react';
import {
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, uploadFile
} from '../../api/cmsApi';
import { API_BASE_URL } from '../../config/apiConfig';

const BLANK = {
  title: '', body: '', category: 'General',
  is_active: 1, publish_at: '', expires_at: '',
  attachment_url: '', attachment_name: ''
};

const ALL_COLS = [
  { key: 'title',        label: 'Title',      sortable: true,  always: true  },
  { key: 'category',     label: 'Category',   sortable: true               },
  { key: 'status',       label: 'Status',     sortable: false              },
  { key: 'publish_at',   label: 'Publish At', sortable: true               },
  { key: 'expires_at',   label: 'Expires At', sortable: true               },
  { key: 'attachment',   label: 'Attachment', sortable: false              },
  { key: 'actions',      label: 'Actions',    sortable: false, always: true },
];

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

function itemToForm(item) {
  return {
    title:           item.title || '',
    body:            item.body || '',
    category:        item.category || 'General',
    is_active:       item.is_active === undefined ? 1 : item.is_active,
    publish_at:      item.published_at || '',
    expires_at:      item.expires_at || '',
    attachment_url:  item.attachment_url || '',
    attachment_name: item.attachment_name || ''
  };
}

function resolveAttachUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
}

function ColMenu({ hiddenCols, setHiddenCols }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const toggleable = ALL_COLS.filter((c) => !c.always);
  return (
    <div className="dash-col-toggle" ref={ref}>
      <button type="button" className="dash-col-toggle-btn" onClick={() => setOpen((o) => !o)}>
        Columns ▾
      </button>
      {open && (
        <div className="dash-col-menu">
          {toggleable.map((col) => (
            <label key={col.key}>
              <input
                type="checkbox"
                checked={!hiddenCols.has(col.key)}
                onChange={() => setHiddenCols((prev) => {
                  const next = new Set(prev);
                  if (next.has(col.key)) next.delete(col.key);
                  else next.add(col.key);
                  return next;
                })}
              />
              {col.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AnnouncementsManager() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(BLANK);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [search, setSearch]       = useState('');
  const [sortCol, setSortCol]     = useState('created_at');
  const [sortDir, setSortDir]     = useState('desc');
  const [hiddenCols, setHiddenCols] = useState(new Set());
  const [perPage, setPerPage]     = useState(10);
  const [page, setPage]           = useState(1);

  function load() {
    setLoading(true);
    getAnnouncements()
      .then(setItems)
      .catch(() => setError('Could not load announcements.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew()      { setForm(BLANK); setEditing('new'); setSaveError(null); setUploadError(null); }
  function openEdit(item) { setForm(itemToForm(item)); setEditing(item.id); setSaveError(null); setUploadError(null); }
  function cancelEdit()   { setEditing(null); setSaveError(null); setUploadError(null); }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const { url, name } = await uploadFile(file);
      setForm((f) => ({ ...f, attachment_url: url, attachment_name: name }));
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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

  function handleSort(col) {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  }

  const displayed = useMemo(() => {
    let list = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((it) => it.title.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const av = String(a[sortCol] || '');
      const bv = String(b[sortCol] || '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [items, search, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(displayed.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = displayed.slice((safePage - 1) * perPage, safePage * perPage);

  const visCols = ALL_COLS.filter((c) => c.always || !hiddenCols.has(c.key));

  function SortTh({ col, label }) {
    const active = sortCol === col;
    return (
      <th className="dash-th-sortable" onClick={() => handleSort(col)}>
        {label}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </th>
    );
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

          <div className="dash-form-section-label">Attachment</div>
          {form.attachment_url ? (
            <div className="dash-attach-current">
              <a href={resolveAttachUrl(form.attachment_url)} target="_blank" rel="noreferrer">
                📎 {form.attachment_name || form.attachment_url}
              </a>
              <button type="button" className="dash-btn dash-btn-secondary dash-btn-sm"
                onClick={() => setForm((f) => ({ ...f, attachment_url: '', attachment_name: '' }))}>
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="dash-form-row">
                <label className="dash-label">Upload File</label>
                <div className="dash-file-row">
                  <input type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif,.webp"
                    onChange={handleFileChange} disabled={uploading} />
                  {uploading && <span className="dash-uploading">Uploading…</span>}
                  {uploadError && <span className="dash-error">{uploadError}</span>}
                </div>
              </div>
              <div className="dash-attach-or">— or link to a URL —</div>
              <div className="dash-form-cols">
                <div className="dash-form-row">
                  <label className="dash-label" htmlFor="ann-attach-url">Document URL</label>
                  <input id="ann-attach-url" name="attachment_url" className="dash-input"
                    value={form.attachment_url} onChange={handleChange} placeholder="https://…" />
                </div>
                <div className="dash-form-row">
                  <label className="dash-label" htmlFor="ann-attach-name">Link Label</label>
                  <input id="ann-attach-name" name="attachment_name" className="dash-input"
                    value={form.attachment_name} onChange={handleChange} placeholder="e.g. Budget Report PDF" />
                </div>
              </div>
            </>
          )}

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
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving || uploading}>
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
        <>
          <div className="dash-toolbar">
            <input
              type="search"
              className="dash-search"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <label className="dash-per-page-label">
              Show&nbsp;
              <select className="dash-per-page-select" value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <ColMenu hiddenCols={hiddenCols} setHiddenCols={setHiddenCols} />
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  {visCols.map((col) => {
                    if (!col.sortable) return <th key={col.key}>{col.label}</th>;
                    return <SortTh key={col.key} col={col.key} label={col.label} />;
                  })}
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr><td colSpan={visCols.length} className="dash-empty-cell">
                    {search ? 'No announcements match your search.' : 'No announcements yet.'}
                  </td></tr>
                ) : pageItems.map((item) => {
                  const status = scheduleStatus(item);
                  return (
                    <tr key={item.id}>
                      {visCols.map((col) => {
                        switch (col.key) {
                          case 'title':
                            return <td key="title" className="dash-td-primary">{item.title}</td>;
                          case 'category':
                            return <td key="category">{item.category}</td>;
                          case 'status':
                            return <td key="status"><span className={statusBadgeClass(status)}>{status}</span></td>;
                          case 'publish_at':
                            return <td key="publish_at" className="dash-td-schedule">{item.published_at ? fmtDt(item.published_at) : '—'}</td>;
                          case 'expires_at':
                            return <td key="expires_at" className="dash-td-schedule">{item.expires_at ? fmtDt(item.expires_at) : '—'}</td>;
                          case 'attachment':
                            return (
                              <td key="attachment" className="dash-td-attach">
                                {item.attachment_url
                                  ? <a href={resolveAttachUrl(item.attachment_url)} target="_blank" rel="noreferrer">
                                      {item.attachment_name || 'View'}
                                    </a>
                                  : '—'}
                              </td>
                            );
                          case 'actions':
                            return (
                              <td key="actions" className="dash-td-actions">
                                <button type="button" className="dash-action-btn" onClick={() => openEdit(item)}>Edit</button>
                                <button type="button" className="dash-action-btn dash-action-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                              </td>
                            );
                          default: return null;
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="dash-pagination">
              <button className="dash-page-btn" onClick={() => setPage((p) => p - 1)} disabled={safePage === 1}>‹ Prev</button>
              <span className="dash-page-info">{safePage} / {totalPages} &nbsp;·&nbsp; {displayed.length} total</span>
              <button className="dash-page-btn" onClick={() => setPage((p) => p + 1)} disabled={safePage === totalPages}>Next ›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

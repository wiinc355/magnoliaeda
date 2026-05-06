import { useState, useEffect } from 'react';
import { getDashboardContacts, createContact, updateContact, deleteContact } from '../../api/cmsApi';

const BLANK = { full_name: '', email: '', phone: '' };

export default function ContactsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [search, setSearch] = useState('');

  function load() {
    setLoading(true);
    getDashboardContacts()
      .then(setItems)
      .catch(() => setError('Could not load contacts.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    );
  });

  function openNew() { setForm(BLANK); setEditing('new'); setSaveError(null); }

  function openEdit(item) {
    setForm({ full_name: item.full_name || '', email: item.email || '', phone: item.phone || '' });
    setEditing(item.id);
    setSaveError(null);
  }

  function cancelEdit() { setEditing(null); setSaveError(null); }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      if (editing === 'new') {
        await createContact(form);
      } else {
        await updateContact(editing, form);
      }
      setEditing(null);
      load();
    } catch (err) {
      setSaveError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await deleteContact(id);
      load();
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Unknown error'));
    }
  }

  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">{editing === 'new' ? 'New Contact' : 'Edit Contact'}</h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>
        <form className="dash-form" onSubmit={handleSubmit}>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="c-name">Full Name <span className="dash-required">*</span></label>
            <input id="c-name" name="full_name" className="dash-input" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="c-email">Email</label>
            <input id="c-email" name="email" type="email" className="dash-input" value={form.email} onChange={handleChange} />
          </div>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="c-phone">Phone</label>
            <input id="c-phone" name="phone" type="tel" className="dash-input" value={form.phone} onChange={handleChange} />
          </div>
          {saveError && <p className="dash-error">{saveError}</p>}
          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Contact'}
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
        <h1 className="dash-page-title">Contacts</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Contact</button>
      </div>
      <div className="dash-toolbar">
        <input
          className="dash-search-input"
          type="search"
          placeholder="Search contacts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="dash-count">{filtered.length} contact{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      {loading && <p className="dash-loading">Loading…</p>}
      {error && <p className="dash-error">{error}</p>}
      {!loading && !error && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="dash-empty-cell">
                  {search ? 'No contacts match your search.' : 'No contacts yet.'}
                </td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id}>
                  <td className="dash-td-primary">{item.full_name}</td>
                  <td>{item.email || '—'}</td>
                  <td>{item.phone || '—'}</td>
                  <td>{item.created_at ? item.created_at.substring(0, 10) : '—'}</td>
                  <td className="dash-td-actions">
                    <button type="button" className="dash-action-btn" onClick={() => openEdit(item)}>Edit</button>
                    <button type="button" className="dash-action-btn dash-action-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

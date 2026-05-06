import { useEffect, useState } from 'react';
import {
  getDashboardPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel
} from '../../api/cmsApi';

const BLANK = {
  full_name: '',
  job_title: '',
  department: '',
  email: '',
  phone: '',
  is_active: 1
};

export default function PersonnelManager() {
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
    getDashboardPersonnel()
      .then(setItems)
      .catch(() => setError('Could not load personnel.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.full_name || '').toLowerCase().includes(q)
      || (item.department || '').toLowerCase().includes(q)
      || (item.job_title || '').toLowerCase().includes(q)
      || (item.email || '').toLowerCase().includes(q)
      || (item.phone || '').includes(q)
    );
  });

  function openNew() {
    setForm(BLANK);
    setEditing('new');
    setSaveError(null);
  }

  function openEdit(item) {
    setForm({
      full_name: item.full_name || '',
      job_title: item.job_title || '',
      department: item.department || '',
      email: item.email || '',
      phone: item.phone || '',
      is_active: item.is_active ? 1 : 0
    });
    setEditing(item.id);
    setSaveError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setSaveError(null);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      if (editing === 'new') {
        await createPersonnel(form);
      } else {
        await updatePersonnel(editing, form);
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
    if (!window.confirm('Delete this staff/personnel record?')) return;

    try {
      await deletePersonnel(id);
      load();
    } catch (err) {
      alert(`Delete failed: ${err.message || 'Unknown error'}`);
    }
  }

  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">{editing === 'new' ? 'New Staff/Personnel Record' : 'Edit Staff/Personnel Record'}</h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>

        <form className="dash-form" onSubmit={handleSubmit}>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="p-full-name">Full Name <span className="dash-required">*</span></label>
            <input id="p-full-name" name="full_name" className="dash-input" value={form.full_name} onChange={handleChange} required />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="p-job-title">Job Title</label>
            <input id="p-job-title" name="job_title" className="dash-input" value={form.job_title} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="p-department">Department <span className="dash-required">*</span></label>
            <input id="p-department" name="department" className="dash-input" value={form.department} onChange={handleChange} required />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="p-email">Email</label>
            <input id="p-email" name="email" type="email" className="dash-input" value={form.email} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="p-phone">Phone</label>
            <input id="p-phone" name="phone" className="dash-input" value={form.phone} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="p-active">Active on Public Pages</label>
            <input id="p-active" name="is_active" type="checkbox" checked={Boolean(form.is_active)} onChange={handleChange} />
          </div>

          {saveError && <p className="dash-error">{saveError}</p>}

          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Personnel'}
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
        <h1 className="dash-page-title">Staff & Personnel By Department</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Personnel</button>
      </div>

      <div className="dash-toolbar">
        <input
          className="dash-search-input"
          type="search"
          placeholder="Search personnel..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span className="dash-count">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading && <p className="dash-loading">Loading...</p>}
      {error && <p className="dash-error">{error}</p>}

      {!loading && !error && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Name</th>
                <th>Title</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="dash-empty-cell">
                    {search ? 'No personnel entries match your search.' : 'No personnel entries yet.'}
                  </td>
                </tr>
              ) : filtered.map((item) => (
                <tr key={item.id}>
                  <td className="dash-td-primary">{item.department}</td>
                  <td>{item.full_name}</td>
                  <td>{item.job_title || '-'}</td>
                  <td>{item.email || '-'}</td>
                  <td>{item.phone || '-'}</td>
                  <td>{item.is_active ? 'Active' : 'Hidden'}</td>
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

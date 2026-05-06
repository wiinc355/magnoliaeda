import { useState, useEffect } from 'react';
import { getDashboardProjects, createProject, updateProject, deleteProject } from '../../api/cmsApi';

const BLANK = { name: '', description: '' };

export default function ProjectsManager() {
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
    getDashboardProjects()
      .then(setItems)
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
  });

  function openNew() { setForm(BLANK); setEditing('new'); setSaveError(null); }

  function openEdit(item) {
    setForm({ name: item.name || '', description: item.description || '' });
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
        await createProject(form);
      } else {
        await updateProject(editing, form);
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
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      load();
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Unknown error'));
    }
  }

  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">{editing === 'new' ? 'New Project' : 'Edit Project'}</h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>
        <form className="dash-form" onSubmit={handleSubmit}>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="proj-name">Project Name <span className="dash-required">*</span></label>
            <input id="proj-name" name="name" className="dash-input" value={form.name} onChange={handleChange} required />
          </div>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="proj-desc">Description</label>
            <textarea id="proj-desc" name="description" className="dash-textarea" rows={5} value={form.description} onChange={handleChange} />
          </div>
          {saveError && <p className="dash-error">{saveError}</p>}
          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Project'}
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
        <h1 className="dash-page-title">Projects</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Project</button>
      </div>
      <div className="dash-toolbar">
        <input
          className="dash-search-input"
          type="search"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="dash-count">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      {loading && <p className="dash-loading">Loading…</p>}
      {error && <p className="dash-error">{error}</p>}
      {!loading && !error && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="dash-empty-cell">
                  {search ? 'No projects match your search.' : 'No projects yet.'}
                </td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id}>
                  <td className="dash-td-primary">{item.name}</td>
                  <td className="dash-td-desc">{item.description || '—'}</td>
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

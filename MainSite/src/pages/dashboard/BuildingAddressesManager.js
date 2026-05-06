import { useEffect, useState } from 'react';
import {
  getDashboardBuildingAddresses,
  createBuildingAddress,
  updateBuildingAddress,
  deleteBuildingAddress
} from '../../api/cmsApi';

const BLANK = {
  building_name: '',
  department: '',
  street: '',
  city: 'Magnolia',
  state: 'MS',
  postal_code: '',
  phone: '',
  office_hours: '',
  map_url: '',
  is_active: 1
};

export default function BuildingAddressesManager() {
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
    getDashboardBuildingAddresses()
      .then(setItems)
      .catch(() => setError('Could not load building addresses.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.building_name || '').toLowerCase().includes(q)
      || (item.department || '').toLowerCase().includes(q)
      || (item.street || '').toLowerCase().includes(q)
      || (item.city || '').toLowerCase().includes(q)
      || (item.postal_code || '').toLowerCase().includes(q)
    );
  });

  function openNew() {
    setForm(BLANK);
    setEditing('new');
    setSaveError(null);
  }

  function openEdit(item) {
    setForm({
      building_name: item.building_name || '',
      department: item.department || '',
      street: item.street || '',
      city: item.city || 'Magnolia',
      state: item.state || 'MS',
      postal_code: item.postal_code || '',
      phone: item.phone || '',
      office_hours: item.office_hours || '',
      map_url: item.map_url || '',
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
        await createBuildingAddress(form);
      } else {
        await updateBuildingAddress(editing, form);
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
    if (!window.confirm('Delete this building address?')) return;

    try {
      await deleteBuildingAddress(id);
      load();
    } catch (err) {
      alert(`Delete failed: ${err.message || 'Unknown error'}`);
    }
  }

  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">{editing === 'new' ? 'New Building Address' : 'Edit Building Address'}</h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>

        <form className="dash-form" onSubmit={handleSubmit}>
          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-name">Building Name <span className="dash-required">*</span></label>
            <input id="b-name" name="building_name" className="dash-input" value={form.building_name} onChange={handleChange} required />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-dept">Department</label>
            <input id="b-dept" name="department" className="dash-input" value={form.department} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-street">Street Address <span className="dash-required">*</span></label>
            <input id="b-street" name="street" className="dash-input" value={form.street} onChange={handleChange} required />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-city">City</label>
            <input id="b-city" name="city" className="dash-input" value={form.city} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-state">State</label>
            <input id="b-state" name="state" className="dash-input" value={form.state} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-zip">Postal Code</label>
            <input id="b-zip" name="postal_code" className="dash-input" value={form.postal_code} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-phone">Phone</label>
            <input id="b-phone" name="phone" className="dash-input" value={form.phone} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-hours">Office Hours</label>
            <input id="b-hours" name="office_hours" className="dash-input" value={form.office_hours} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-map">Map URL</label>
            <input id="b-map" name="map_url" type="url" className="dash-input" value={form.map_url} onChange={handleChange} />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="b-active">Active on Public Pages</label>
            <input id="b-active" name="is_active" type="checkbox" checked={Boolean(form.is_active)} onChange={handleChange} />
          </div>

          {saveError && <p className="dash-error">{saveError}</p>}

          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Address'}
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
        <h1 className="dash-page-title">Building Addresses</h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Address</button>
      </div>

      <div className="dash-toolbar">
        <input
          className="dash-search-input"
          type="search"
          placeholder="Search buildings..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span className="dash-count">{filtered.length} building{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading && <p className="dash-loading">Loading...</p>}
      {error && <p className="dash-error">{error}</p>}

      {!loading && !error && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Building</th>
                <th>Department</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="dash-empty-cell">
                    {search ? 'No building entries match your search.' : 'No building addresses yet.'}
                  </td>
                </tr>
              ) : filtered.map((item) => (
                <tr key={item.id}>
                  <td className="dash-td-primary">{item.building_name}</td>
                  <td>{item.department || '-'}</td>
                  <td>{`${item.street}, ${item.city}, ${item.state} ${item.postal_code || ''}`.trim()}</td>
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

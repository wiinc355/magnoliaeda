import React, { useEffect, useMemo, useState } from 'react';
import { PageBanner } from './PageBanner';

export default function EntityManagerPage({
  title,
  heading,
  description,
  initialForm,
  fields,
  requiredFieldName,
  requiredMessage,
  listTitle,
  emptyText,
  loadItems,
  createItem,
  updateItem,
  deleteItem,
  getItemTitle,
  getItemDetails,
  toForm,
  toPayload,
  singularLabel
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submitLabel = useMemo(
    () => (editingId ? `Update ${singularLabel}` : `Add ${singularLabel}`),
    [editingId, singularLabel]
  );

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const data = await loadItems();
        setItems(data);
      } catch (err) {
        setError(err.message || `Failed to load ${listTitle.toLowerCase()}`);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [loadItems, listTitle]);

  function onInputChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function onEdit(item) {
    setEditingId(item.id);
    setForm(toForm(item));
    setError('');
  }

  function onCancelEdit() {
    setEditingId(null);
    setForm(initialForm);
    setError('');
  }

  async function onSubmit(event) {
    event.preventDefault();

    const requiredValue = form[requiredFieldName];
    if (!requiredValue || !String(requiredValue).trim()) {
      setError(requiredMessage);
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = toPayload(form);

      if (editingId) {
        const updated = await updateItem(editingId, payload);
        setItems((current) =>
          current.map((item) => (item.id === editingId ? updated : item))
        );
      } else {
        const created = await createItem(payload);
        setItems((current) => [created, ...current]);
      }

      onCancelEdit();
    } catch (err) {
      setError(err.message || `Failed to save ${singularLabel.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(itemId) {
    try {
      setError('');
      await deleteItem(itemId);
      setItems((current) => current.filter((item) => item.id !== itemId));

      if (editingId === itemId) {
        onCancelEdit();
      }
    } catch (err) {
      setError(err.message || `Failed to delete ${singularLabel.toLowerCase()}`);
    }
  }

  return (
    <div>
      <PageBanner title={title} />

      <section className="content-section first-section">
        <div className="container">
          <h3>{heading}</h3>
          <p>{description}</p>

          <form onSubmit={onSubmit} style={{ display: 'grid', gap: '.75rem', maxWidth: 560 }}>
            {fields.map((field) => {
              if (field.type === 'textarea') {
                return (
                  <textarea
                    key={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={onInputChange}
                    rows={field.rows || 4}
                    style={{ padding: '.6rem', fontSize: '.95rem', resize: 'vertical' }}
                  />
                );
              }

              return (
                <input
                  key={field.name}
                  type={field.type || 'text'}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={onInputChange}
                  style={{ padding: '.6rem', fontSize: '.95rem' }}
                />
              );
            })}

            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button type="submit" className="builder-btn" disabled={saving}>
                {saving ? 'Saving...' : submitLabel}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="builder-btn"
                  style={{ background: 'var(--magnolia-primary-hover)' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && <p style={{ marginTop: '1rem', color: 'var(--magnolia-secondary)' }}>{error}</p>}

          <div style={{ marginTop: '1.5rem' }}>
            <h4>{listTitle}</h4>
            {loading ? (
              <p>Loading...</p>
            ) : items.length === 0 ? (
              <p>{emptyText}</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '.75rem' }}>
                {items.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      padding: '.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <strong>{getItemTitle(item)}</strong>
                      {getItemDetails(item).map((detail, index) => (
                        <div key={`${item.id}-${index}`}>{detail}</div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                      <button type="button" className="builder-btn" onClick={() => onEdit(item)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="builder-btn"
                        style={{ background: 'var(--magnolia-primary-hover)' }}
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

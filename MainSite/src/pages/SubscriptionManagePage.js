import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageBanner } from '../components/PageBanner';
import {
  getSubscriptionByToken, updateSubscriptionByToken, deleteSubscriptionByToken,
  getEnotifyCategories
} from '../api/cmsApi';
import bannerImg from '../image/hero-1.png';

export default function SubscriptionManagePage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    channels: [],
    categories: []
  });

  const [availCats, setAvailCats] = useState([]);
  const [availChannels, setAvailChannels] = useState(['email', 'sms']);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        // Load subscription and categories in parallel
        const [subData, catData] = await Promise.all([
          getSubscriptionByToken(token),
          getEnotifyCategories()
        ]);

        if (catData.categories) setAvailCats(catData.categories);
        if (catData.channels) setAvailChannels(catData.channels);

        setForm({
          full_name: subData.full_name || '',
          email: subData.email || '',
          phone: subData.phone || '',
          channels: Array.isArray(subData.channels) ? subData.channels : [],
          categories: Array.isArray(subData.categories) ? subData.categories : []
        });
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('Invalid')) {
          setNotFound(true);
        } else {
          setError(err.message || 'Failed to load subscription');
        }
      } finally {
        setLoading(false);
      }
    }
    if (token) load();
  }, [token]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleChannel(c) {
    setForm((f) => {
      const has = f.channels.includes(c);
      return { ...f, channels: has ? f.channels.filter((x) => x !== c) : [...f.channels, c] };
    });
  }

  function toggleCategory(c) {
    setForm((f) => {
      const has = f.categories.includes(c);
      return { ...f, categories: has ? f.categories.filter((x) => x !== c) : [...f.categories, c] };
    });
  }

  async function onSave(e) {
    e.preventDefault();
    setSaveError(null);
    setSuccessMsg('');
    setSaving(true);
    try {
      await updateSubscriptionByToken(token, form);
      setSuccessMsg('Subscription updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setSaveError(err.message || 'Failed to update subscription');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(e) {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete your subscription? This cannot be undone.')) return;

    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteSubscriptionByToken(token);
      navigate('/alerts/enotify', { state: { deleted: true } });
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete subscription');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>Loading subscription...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Subscription Not Found</h2>
          <p>This subscription link is invalid or has expired.</p>
          <Link to="/alerts/enotify" style={{ color: '#0a4f90', textDecoration: 'underline' }}>
            Return to E-Notifications
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>Error: {error}</div>
          <Link to="/alerts/enotify" style={{ color: '#0a4f90', textDecoration: 'underline' }}>
            Return to E-Notifications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        title="Manage Your E-Notifications"
        image={bannerImg}
        subtitle="Edit your subscription preferences or delete your account"
      />

      <div className="container" style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
        <form onSubmit={onSave} style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
          {successMsg && (
            <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
              {successMsg}
            </div>
          )}

          {saveError && (
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              {saveError}
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>
              Full Name <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setField('full_name', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #bbb',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #bbb',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="(555) 123-4567"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #bbb',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Channels */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>
              How would you like to receive notifications? <span style={{ color: '#d32f2f' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
              {availChannels.map((ch) => (
                <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.channels.includes(ch)}
                    onChange={() => toggleChannel(ch)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{ch}</span>
                </label>
              ))}
            </div>
            {form.channels.length === 0 && (
              <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Please select at least one channel.
              </div>
            )}
          </div>

          {/* Categories */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>
              What types of notifications interest you?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {availCats.map((cat) => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0a4f90',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              to="/alerts/enotify"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Cancel
            </Link>
          </div>

          {/* Delete Section */}
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <h3 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>Delete Subscription</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Once you delete your subscription, all your notification preferences will be permanently removed.
            </p>
            {deleteError && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
                {deleteError}
              </div>
            )}
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#d32f2f',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 700,
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.6 : 1
              }}
            >
              {deleting ? 'Deleting...' : 'Delete My Subscription'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/alerts/enotify" style={{ color: '#0a4f90', textDecoration: 'underline' }}>
            Back to E-Notifications
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getMyProfile, updateMyProfile } from '../../api/profilesApi';

const ROLE_COLORS = {
  'Admin': '#7c3aed',
  'Staff': '#0a4f90',
  'Department User': '#0e7a60',
  'Public User': '#555'
};

function avatarSrc(profile) {
  if (profile.avatar_url) return profile.avatar_url;
  const name = encodeURIComponent(profile.display_name || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=0a4f90&color=fff&size=128`;
}

function formatDate(iso) {
  if (!iso) return '—';
  const [year, month, day] = iso.split('-');
  if (!year) return '—';
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function MyProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMyProfile()
      .then((data) => { if (mounted) { setProfile(data); setForm(toForm(data)); } })
      .catch(() => { if (mounted) setError('Failed to load profile.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  function toForm(p) {
    return {
      display_name: p.display_name || '',
      job_title: p.job_title || '',
      department: p.department || '',
      phone: p.phone || '',
      birth_date: p.birth_date || '',
      avatar_url: p.avatar_url || '',
      bio: p.bio || ''
    };
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      setForm(toForm(updated));
      setEditing(false);
      setSuccess('Profile saved.');
    } catch {
      setError('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm(toForm(profile));
    setEditing(false);
    setError('');
  }

  if (loading) return <section className="profile-shell"><p className="profile-loading">Loading profile…</p></section>;

  const roleColor = ROLE_COLORS[profile?.role_label] || '#555';

  return (
    <section className="profile-shell">
      <div className="container profile-container">
        <div className="profile-card">
          <div className="profile-card-hero">
            <img
              src={avatarSrc(profile)}
              alt={profile.display_name}
              className="profile-avatar"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=0a4f90&color=fff&size=128`;
              }}
            />
            <div className="profile-hero-info">
              <h1 className="profile-name">{profile.display_name}</h1>
              {profile.job_title ? <p className="profile-title">{profile.job_title}</p> : null}
              {profile.department ? <p className="profile-dept">{profile.department}</p> : null}
              <span className="profile-role-badge" style={{ background: roleColor }}>
                {profile.role_label || 'Public User'}
              </span>
            </div>
            {!editing ? (
              <button type="button" className="profile-edit-btn" onClick={() => { setEditing(true); setSuccess(''); }}>
                Edit Profile
              </button>
            ) : null}
          </div>

          {success ? <p className="profile-success">{success}</p> : null}
          {error ? <p className="profile-error">{error}</p> : null}

          {editing ? (
            <form className="profile-form" onSubmit={handleSave}>
              <div className="profile-form-grid">
                <label className="profile-label">
                  Full Name
                  <input name="display_name" className="profile-input" value={form.display_name} onChange={handleChange} required />
                </label>
                <label className="profile-label">
                  Phone
                  <input name="phone" className="profile-input" value={form.phone} onChange={handleChange} />
                </label>
                <label className="profile-label">
                  Job Title
                  <input name="job_title" className="profile-input" value={form.job_title} onChange={handleChange} />
                </label>
                <label className="profile-label">
                  Department
                  <input name="department" className="profile-input" value={form.department} onChange={handleChange} />
                </label>
                <label className="profile-label">
                  Date of Birth
                  <input type="date" name="birth_date" className="profile-input" value={form.birth_date} onChange={handleChange} />
                </label>
                <label className="profile-label">
                  Profile Picture URL
                  <input name="avatar_url" className="profile-input" value={form.avatar_url} onChange={handleChange} placeholder="https://…" />
                </label>
                <label className="profile-label profile-label-full">
                  Bio
                  <textarea name="bio" className="profile-textarea" rows={3} value={form.bio} onChange={handleChange} />
                </label>
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="profile-save-btn" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" className="profile-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="profile-details">
              <div className="profile-detail-row">
                <dt>Email</dt>
                <dd>{profile.email || (user && user.email) || '—'}</dd>
              </div>
              <div className="profile-detail-row">
                <dt>Phone</dt>
                <dd>{profile.phone || '—'}</dd>
              </div>
              <div className="profile-detail-row">
                <dt>Date of Birth</dt>
                <dd>{formatDate(profile.birth_date)}</dd>
              </div>
              {profile.job_title ? (
                <div className="profile-detail-row">
                  <dt>Job Title</dt>
                  <dd>{profile.job_title}</dd>
                </div>
              ) : null}
              {profile.department ? (
                <div className="profile-detail-row">
                  <dt>Department</dt>
                  <dd>{profile.department}</dd>
                </div>
              ) : null}
              {profile.bio ? (
                <div className="profile-detail-row profile-detail-bio">
                  <dt>Bio</dt>
                  <dd>{profile.bio}</dd>
                </div>
              ) : null}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

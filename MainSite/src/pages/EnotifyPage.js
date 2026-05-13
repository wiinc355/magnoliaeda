import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageBanner } from '../components/PageBanner';
import {
  subscribeEnotify, confirmEnotify, unsubscribeEnotify, getEnotifyCategories
} from '../api/cmsApi';
import bannerImg from '../image/hero-1.png';

function StickyTitleBar({ title }) {
  const [headerHeight, setHeaderHeight] = useState(90);
  const [siteSearch, setSiteSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hdr = document.querySelector('.municipal-header');
    if (hdr) setHeaderHeight(hdr.offsetHeight);
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (siteSearch.trim()) params.set('q', siteSearch.trim());
    navigate(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  return (
    <div style={{
      position: 'sticky', top: headerHeight, zIndex: 1100,
      background: '#0a4f90', color: '#fff', padding: '0.15rem 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', minWidth: 0 }}>
        <div style={{ fontFamily: "'Bree Serif', serif", fontWeight: 700, fontSize: '25px', letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 0, flex: '0 1 auto' }}>
          {title}
        </div>
        <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: '0 1 440px', maxWidth: '100%', minWidth: 0 }}>
          <input
            type="search" value={siteSearch} onChange={(e) => setSiteSearch(e.target.value)}
            placeholder="What can we help you find today?" aria-label="Search site"
            className="title-bar-search-input"
            style={{ width: '100%', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '999px', padding: '0.45rem 0.8rem', fontSize: '0.95rem', color: '#12385c', background: '#ffffff', minWidth: 0 }}
          />
          <button type="submit" style={{ border: 'none', borderRadius: '999px', padding: '0.45rem 0.9rem', background: '#f2b21c', color: '#082c4f', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export function EnotifySubscribePage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    channels: ['email'], categories: []
  });
  const [availCats, setAvailCats] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEnotifyCategories()
      .then((d) => setAvailCats(d.categories || []))
      .catch(() => setAvailCats([]));
  }, []);

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

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await subscribeEnotify(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Subscription failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageBanner title="" images={[bannerImg]} height={180} />
      <StickyTitleBar title="eNotify Sign-Up" />

      <section className="enotify-page">
        <div className="container enotify-container">
          <div className="enotify-intro">
            <h1>Subscribe to City Alerts</h1>
            <p>
              Get email and text notifications when the City of Magnolia posts new
              announcements, events, public safety alerts, and more. Choose the
              categories you care about and the channels you want messages on.
              You will receive a confirmation link to activate your subscription.
            </p>
          </div>

          {submitted ? (
            <div className="enotify-card enotify-success">
              <h2>✓ Check your inbox</h2>
              <p>
                Thanks, <strong>{form.full_name}</strong>! We've sent a confirmation
                {form.channels.includes('email') ? ' email' : ''}
                {form.channels.includes('email') && form.channels.includes('sms') ? ' and ' : ''}
                {form.channels.includes('sms') ? ' text message' : ''} to verify your subscription.
                Click the link inside to activate.
              </p>
              <p style={{ marginTop: '1rem' }}>
                <Link to="/" className="enotify-link">← Return to home</Link>
              </p>
            </div>
          ) : (
            <form className="enotify-card enotify-form" onSubmit={onSubmit}>
              <div className="enotify-row">
                <label>Full Name <span className="enotify-req">*</span></label>
                <input type="text" required value={form.full_name}
                  onChange={(e) => setField('full_name', e.target.value)} />
              </div>

              <div className="enotify-row">
                <label>Email Address {form.channels.includes('email') && <span className="enotify-req">*</span>}</label>
                <input type="email" value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  required={form.channels.includes('email')} />
              </div>

              <div className="enotify-row">
                <label>Mobile Phone {form.channels.includes('sms') && <span className="enotify-req">*</span>}</label>
                <input type="tel" value={form.phone} placeholder="(601) 555-0123"
                  onChange={(e) => setField('phone', e.target.value)}
                  required={form.channels.includes('sms')} />
              </div>

              <fieldset className="enotify-fieldset">
                <legend>Delivery Channels</legend>
                <label className="enotify-check">
                  <input type="checkbox" checked={form.channels.includes('email')}
                    onChange={() => toggleChannel('email')} />
                  Email
                </label>
                <label className="enotify-check">
                  <input type="checkbox" checked={form.channels.includes('sms')}
                    onChange={() => toggleChannel('sms')} />
                  Text Message (SMS)
                </label>
              </fieldset>

              <fieldset className="enotify-fieldset">
                <legend>Alert Categories (leave all unchecked to receive everything)</legend>
                <div className="enotify-cat-grid">
                  {availCats.map((c) => (
                    <label key={c} className="enotify-check">
                      <input type="checkbox" checked={form.categories.includes(c)}
                        onChange={() => toggleCategory(c)} />
                      {c}
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && <p className="enotify-error">{error}</p>}

              <button type="submit" className="enotify-submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Subscribe'}
              </button>
              <p className="enotify-fineprint">
                By subscribing you consent to receive automated email or SMS messages from the City of Magnolia.
                Message and data rates may apply. You can unsubscribe at any time from any message you receive.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export function EnotifyConfirmPage() {
  const { token } = useParams();
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    confirmEnotify(token)
      .then((res) => setState({ status: 'ok', name: res.full_name, already: res.alreadyConfirmed }))
      .catch((err) => setState({ status: 'error', error: err.message || 'Invalid or expired link' }));
  }, [token]);

  return (
    <div>
      <PageBanner title="" images={[bannerImg]} height={180} />
      <StickyTitleBar title="Subscription Confirmation" />
      <section className="enotify-page">
        <div className="container enotify-container">
          {state.status === 'loading' && (
            <div className="enotify-card"><p>Confirming your subscription…</p></div>
          )}
          {state.status === 'ok' && (
            <div className="enotify-card enotify-success">
              <h2>✓ Subscription confirmed</h2>
              <p>
                {state.already
                  ? `Hi ${state.name}, your subscription was already active. You're all set.`
                  : `Welcome, ${state.name}! Your eNotify subscription is now active. You'll receive alerts in the channels you selected.`}
              </p>
              <p style={{ marginTop: '1rem' }}>
                <Link to="/" className="enotify-link">← Return to home</Link>
              </p>
            </div>
          )}
          {state.status === 'error' && (
            <div className="enotify-card enotify-error-card">
              <h2>Confirmation failed</h2>
              <p>{state.error}</p>
              <p style={{ marginTop: '1rem' }}>
                <Link to="/enotify" className="enotify-link">Try subscribing again</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function EnotifyUnsubscribePage() {
  const { token } = useParams();
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    unsubscribeEnotify(token)
      .then((res) => setState({ status: 'ok', name: res.full_name }))
      .catch((err) => setState({ status: 'error', error: err.message || 'Invalid link' }));
  }, [token]);

  return (
    <div>
      <PageBanner title="" images={[bannerImg]} height={180} />
      <StickyTitleBar title="Unsubscribe" />
      <section className="enotify-page">
        <div className="container enotify-container">
          {state.status === 'loading' && (
            <div className="enotify-card"><p>Processing your unsubscribe request…</p></div>
          )}
          {state.status === 'ok' && (
            <div className="enotify-card enotify-success">
              <h2>You've been unsubscribed</h2>
              <p>
                {state.name ? `${state.name}, you` : 'You'} will no longer receive eNotify messages from the City of Magnolia.
                If you change your mind, you're always welcome back.
              </p>
              <p style={{ marginTop: '1rem' }}>
                <Link to="/enotify" className="enotify-link">Re-subscribe</Link>
              </p>
            </div>
          )}
          {state.status === 'error' && (
            <div className="enotify-card enotify-error-card">
              <h2>Unsubscribe failed</h2>
              <p>{state.error}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

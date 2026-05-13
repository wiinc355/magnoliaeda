import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPublicMarquee } from '../api/cmsApi';

export default function SiteMarquee() {
  const [data, setData] = useState(null);
  const [paused, setPaused] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    function fetchOnce() {
      getPublicMarquee()
        .then((d) => { if (!cancelled) setData(d); })
        .catch(() => { if (!cancelled) setData({ enabled: false, messages: [] }); });
    }
    fetchOnce();
    const interval = setInterval(fetchOnce, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Hide on dashboard / portal / auth pages — admin UX
  const path = location.pathname || '';
  if (path.startsWith('/dashboard')
      || path.startsWith('/admin-portal')
      || path.startsWith('/staff-portal')
      || path.startsWith('/department-portal')
      || path.startsWith('/profile')
      || path.startsWith('/login')
      || path.startsWith('/auth/')) {
    return null;
  }

  if (!data || !data.enabled || !data.messages || data.messages.length === 0) return null;

  const settings = data.settings || {};
  const duration = Math.max(5, Math.min(240, Number(settings.duration_seconds) || 40));
  const bg = settings.background_color || '#0a4f90';
  const fg = settings.text_color || '#ffffff';

  // Single pass per loop so the next cycle starts only after the final word exits left.
  const items = data.messages;

  return (
    <div className="site-marquee" style={{ background: bg, color: fg }}
         onMouseEnter={() => setPaused(true)}
         onMouseLeave={() => setPaused(false)}
         role="region" aria-label="City announcements">
      <div className="site-marquee-window">
        <div className="site-marquee-track" style={{ animationDuration: `${duration}s`, animationPlayState: paused ? 'paused' : 'running' }}>
          {items.map((m, idx) => {
            const content = (
              <span className="site-marquee-item" key={`${m.id}-${idx}`}>
                <span className="site-marquee-dot" aria-hidden="true">•</span>
                <span className="site-marquee-text">{m.text}</span>
              </span>
            );
            if (m.link_url) {
              const isExternal = /^https?:\/\//i.test(m.link_url);
              return isExternal ? (
                <a key={`l-${m.id}-${idx}`} href={m.link_url} target="_blank" rel="noreferrer" className="site-marquee-link" style={{ color: fg }}>{content}</a>
              ) : (
                <Link key={`l-${m.id}-${idx}`} to={m.link_url} className="site-marquee-link" style={{ color: fg }}>{content}</Link>
              );
            }
            return content;
          })}
        </div>
      </div>
    </div>
  );
}

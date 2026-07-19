import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPublicMarquee } from '../api/marqueeApi';

function sanitizeRichHtml(rawHtml) {
  const html = String(rawHtml || '');
  const withoutScripts = html
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '');

  return withoutScripts
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\sstyle\s*=\s*"[^"]*expression\([^"]*\)[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

function parseItemStyle(value) {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value || '{}') : (value || {});
    return {
      fontFamily: String(parsed.fontFamily || '').slice(0, 100),
      fontSizePx: Math.min(Math.max(parseInt(parsed.fontSizePx, 10) || 16, 12), 64),
      textAlign: ['left', 'center', 'right'].includes(parsed.textAlign) ? parsed.textAlign : 'left'
    };
  } catch (_) {
    return { fontFamily: '', fontSizePx: 16, textAlign: 'left' };
  }
}

export default function SiteMarquee() {
  const [data, setData] = useState(null);
  const [paused, setPaused] = useState(false);
  const location = useLocation();

  function fetchOnce() {
    return getPublicMarquee()
      .then((d) => setData(d))
      .catch(() => setData({ enabled: false, messages: [] }));
  }

  useEffect(() => {
    let cancelled = false;

    function safeFetch() {
      getPublicMarquee()
        .then((d) => { if (!cancelled) setData(d); })
        .catch(() => { if (!cancelled) setData({ enabled: false, messages: [] }); });
    }

    function onUpdated() {
      safeFetch();
    }

    function onVisibility() {
      if (!document.hidden) safeFetch();
    }

    safeFetch();
    const interval = setInterval(safeFetch, 60000);
    window.addEventListener('marquee:updated', onUpdated);
    window.addEventListener('focus', onUpdated);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('marquee:updated', onUpdated);
      window.removeEventListener('focus', onUpdated);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    fetchOnce();
  }, [location.pathname]);

  if (!data || !data.enabled || !data.messages || data.messages.length === 0) return null;

  const settings = data.settings || {};
  const duration = Math.max(5, Math.min(240, Number(settings.duration_seconds) || 40));
  const bg = settings.background_color || '#dff0d8';
  const fg = settings.text_color || '#173f68';
  const fontWeight = settings.font_weight === 'bold' ? 700 : 500;
  const fontSize = Math.max(10, Math.min(40, parseInt(settings.font_size_px, 10) || 15));
  const textDecoration = settings.text_decoration === 'underline' ? 'underline' : 'none';
  const textTransform = ['uppercase', 'lowercase'].includes(settings.text_transform)
    ? settings.text_transform
    : 'none';

  const items = data.messages;

  return (
    <div
      className="site-marquee"
      style={{ background: bg, color: fg, fontWeight, fontSize: `${fontSize}px`, textDecoration, textTransform }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Economic development announcements"
    >
      <div className="site-marquee-window">
        <div className="site-marquee-track" style={{ animationDuration: `${duration}s`, animationPlayState: paused ? 'paused' : 'running' }}>
          {items.map((m, idx) => {
            const itemStyle = parseItemStyle(m.text_style_json);
            const content = (
              <span
                className="site-marquee-item"
                key={`${m.id}-${idx}`}
                style={{
                  fontFamily: itemStyle.fontFamily || undefined,
                  fontSize: `${itemStyle.fontSizePx}px`,
                  textAlign: itemStyle.textAlign
                }}
              >
                <span className="site-marquee-dot" aria-hidden="true">•</span>
                {m.rich_text ? (
                  <span
                    className="site-marquee-text site-marquee-rich"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(m.rich_text) }}
                  />
                ) : (
                  <span className="site-marquee-text">{m.text}</span>
                )}
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

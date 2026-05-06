import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBanner } from '../components/PageBanner';
import { getPublicEvents } from '../api/cmsApi';
import { API_BASE_URL } from '../config/apiConfig';
import bannerImg from '../image/COM-Timepic-2.jpeg';

const CATEGORY_COLORS = {
  'City Council':       '#0a4f90',
  'Public Hearing':     '#7c3aed',
  'Government':         '#0a4f90',
  'Parks & Recreation': '#0e7a60',
  'Community':          '#c2780a',
  'Public Safety':      '#c0392b',
  'Public Works':       '#6d5500',
  'Holiday':            '#be185d',
  'General':            '#4b5563',
};
function evColor(cat) { return CATEGORY_COLORS[cat] || '#4b5563'; }

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtDate(d) {
  if (!d) return '';
  const [y, mo, day] = d.split('-').map(Number);
  const dt = new Date(y, mo - 1, day);
  return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function resolveUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
}

const SORT_OPTIONS = [
  { value: 'date-asc',  label: 'Date: Oldest First' },
  { value: 'date-desc', label: 'Date: Newest First' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'category',  label: 'Category' },
];

export default function EventsPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('date-asc');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage]       = useState(1);
  const [headerHeight, setHeaderHeight] = useState(90);
  const [siteSearch, setSiteSearch]     = useState('');
  const routerNavigate = useNavigate();

  useEffect(() => {
    const hdr = document.querySelector('.municipal-header');
    if (hdr) setHeaderHeight(hdr.offsetHeight);
  }, []);

  useEffect(() => {
    getPublicEvents()
      .then(setItems)
      .catch(() => setError('Could not load events.'))
      .finally(() => setLoading(false));
  }, []);

  function handleSiteSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (siteSearch.trim()) params.set('q', siteSearch.trim());
    routerNavigate(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  const filtered = useMemo(() => {
    let list = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((it) =>
        it.title.toLowerCase().includes(q) ||
        (it.category || '').toLowerCase().includes(q) ||
        (it.location || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return (b.event_date || '').localeCompare(a.event_date || '');
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        case 'category':  return (a.category || '').localeCompare(b.category || '');
        default:          return (a.event_date || '').localeCompare(b.event_date || '');
      }
    });
    return list;
  }, [items, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  function handleSearchChange(e) { setSearch(e.target.value); setPage(1); }
  function handleSortChange(e)   { setSortBy(e.target.value); setPage(1); }
  function handlePerPageChange(e){ setPerPage(Number(e.target.value)); setPage(1); }

  return (
    <div>
      <PageBanner title="" images={[bannerImg]} height={180} />

      <div style={{
        position: 'sticky', top: headerHeight, zIndex: 1100,
        background: '#0a4f90', color: '#fff', padding: '0.15rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', minWidth: 0 }}>
          <div style={{ fontFamily: "'Bree Serif', serif", fontWeight: 700, fontSize: '25px', letterSpacing: '0.08em', textTransform: 'uppercase', flex: '0 1 auto', minWidth: 0 }}>
            Events
          </div>
          <form onSubmit={handleSiteSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: '0 1 440px', maxWidth: '100%', minWidth: 0 }}>
            <input
              type="search" value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              placeholder="What can we help you find today?"
              aria-label="Search site"
              className="title-bar-search-input"
              style={{ width: '100%', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '999px', padding: '0.45rem 0.8rem', fontSize: '0.95rem', color: '#12385c', background: '#ffffff', minWidth: 0 }}
            />
            <button type="submit" style={{ border: 'none', borderRadius: '999px', padding: '0.45rem 0.9rem', background: '#f2b21c', color: '#082c4f', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      <section className="pub-list-page">
        <div className="container">

          <div className="pub-controls">
            <input
              type="search" className="pub-search"
              placeholder="Filter events…"
              value={search} onChange={handleSearchChange}
            />
            <select className="pub-sort-select" value={sortBy} onChange={handleSortChange}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <label className="pub-per-page-label">
              Show&nbsp;
              <select className="pub-per-page-select" value={perPage} onChange={handlePerPageChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <span className="pub-results-count">
              {loading ? '' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {loading && <p className="pub-status">Loading events…</p>}
          {error   && <p className="pub-status pub-status-error">{error}</p>}

          {!loading && !error && (
            <>
              {pageItems.length === 0 ? (
                <p className="pub-status">No events found{search ? ' matching your search' : ''}.</p>
              ) : (
                <ul className="pub-list">
                  {pageItems.map((ev) => {
                    const color = evColor(ev.category || 'General');
                    const dateStr = ev.end_date && ev.end_date !== ev.event_date
                      ? `${fmtDate(ev.event_date)} – ${fmtDate(ev.end_date)}`
                      : fmtDate(ev.event_date);
                    const timeStr = ev.start_time
                      ? fmt12(ev.start_time) + (ev.end_time ? ` – ${fmt12(ev.end_time)}` : '')
                      : '';
                    return (
                      <li key={ev.id} className="pub-list-item">
                        <span className="pub-item-dot" style={{ background: color }} />
                        <div className="pub-item-body">
                          <p className="pub-item-title">{ev.title}</p>
                          <div className="pub-item-meta">
                            {dateStr && <span>{dateStr}</span>}
                            {timeStr && <span>· {timeStr}</span>}
                            {ev.location && <span>· {ev.location}</span>}
                          </div>
                          {ev.description && (
                            <p className="pub-item-desc">{ev.description}</p>
                          )}
                          <div className="pub-item-footer">
                            <span className="pub-item-cat" style={{ color, borderColor: color }}>{ev.category || 'General'}</span>
                            {ev.attachment_url && (
                              <a href={resolveUrl(ev.attachment_url)} className="pub-item-attach" target="_blank" rel="noreferrer">
                                📎 {ev.attachment_name || 'View Document'}
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {totalPages > 1 && (
                <div className="pub-pagination">
                  <button className="pub-page-btn" onClick={() => setPage((p) => p - 1)} disabled={safePage === 1}>‹ Prev</button>
                  <span className="pub-page-info">Page {safePage} of {totalPages}</span>
                  <button className="pub-page-btn" onClick={() => setPage((p) => p + 1)} disabled={safePage === totalPages}>Next ›</button>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
}

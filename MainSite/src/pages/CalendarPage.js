import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicEvents } from '../api/cmsApi';
import { PageBanner } from '../components/PageBanner';
import calendarBanner from '../image/COM-Timepic-2.jpeg';

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  'City Council':       '#0a4f90',
  'Public Hearing':     '#7c3aed',
  'Government':         '#0a4f90',
  'Parks & Recreation': '#0e7a60',
  'Community':          '#c2780a',
  'Public Safety':      '#c0392b',
  'Public Works':       '#6d5500',
  'Holiday':            '#b5179e',
  'General':            '#4a5568',
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAY_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const GRID_START = 6;
const GRID_END   = 22;
const HOUR_PX    = 64;

// ── Helpers ──────────────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, '0'); }

function toIso(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeek(d) {
  const w = startOfDay(d);
  w.setDate(w.getDate() - w.getDay());
  return w;
}

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtLong(iso) {
  if (!iso) return '';
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function evColor(ev) { return CATEGORY_COLORS[ev.category] || '#4a5568'; }

function evSpansDay(ev, iso) {
  return ev.event_date <= iso && (ev.end_date ? ev.end_date >= iso : ev.event_date === iso);
}

function forDay(events, iso) {
  return events.filter((ev) => evSpansDay(ev, iso));
}

function startMin(ev) {
  if (!ev.start_time) return null;
  const [h, m] = ev.start_time.split(':').map(Number);
  return h * 60 + m;
}

function endMin(ev) {
  if (!ev.end_time) return startMin(ev) != null ? startMin(ev) + 60 : null;
  const [h, m] = ev.end_time.split(':').map(Number);
  return h * 60 + m;
}

const HOURS = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i);

// ── Event Modal ───────────────────────────────────────────────────────────────

function EventModal({ ev, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleBackdrop(e) { if (e.target === e.currentTarget) onClose(); }

  const color = evColor(ev);

  return (
    <div className="calmod-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className="calmod">
        <div className="calmod-bar" style={{ background: color }} />
        <div className="calmod-header">
          <div className="calmod-header-text">
            <span className="calmod-cat" style={{ color }}>{ev.category}</span>
            <h2 className="calmod-title">{ev.title}</h2>
          </div>
          <button type="button" className="calmod-close" onClick={onClose} aria-label="Close">&#10005;</button>
        </div>
        <dl className="calmod-body">
          <div className="calmod-row">
            <dt>Date</dt>
            <dd>
              {fmtLong(ev.event_date)}
              {ev.end_date && ev.end_date !== ev.event_date ? ` – ${fmtLong(ev.end_date)}` : ''}
            </dd>
          </div>
          {(ev.start_time || ev.end_time) && (
            <div className="calmod-row">
              <dt>Time</dt>
              <dd>{fmt12(ev.start_time)}{ev.end_time ? ` – ${fmt12(ev.end_time)}` : ''}</dd>
            </div>
          )}
          {ev.location && (
            <div className="calmod-row">
              <dt>Location</dt>
              <dd>{ev.location}</dd>
            </div>
          )}
          {ev.description && (
            <div className="calmod-row calmod-row-full">
              <dt>Details</dt>
              <dd>{ev.description}</dd>
            </div>
          )}
          {ev.contact_name && (
            <div className="calmod-row">
              <dt>Contact</dt>
              <dd>
                <strong>{ev.contact_name}</strong>
                {ev.contact_phone && <><br />{ev.contact_phone}</>}
                {ev.contact_email && (
                  <><br /><a href={`mailto:${ev.contact_email}`}>{ev.contact_email}</a></>
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

// ── Shared event list row ────────────────────────────────────────────────────

function EventListRow({ ev, onPick }) {
  const color = evColor(ev);
  return (
    <li className="cal-list-item-wrap">
      <button type="button" className="cal-list-item" onClick={() => onPick(ev)}>
        <div className="cal-list-top">
          <span className="cal-list-dot" style={{ background: color }} />
          <span className="cal-list-title">{ev.title}</span>
        </div>
        <div className="cal-list-details">
          <span className="cal-list-date">{fmtLong(ev.event_date)}</span>
          {ev.start_time && (
            <span className="cal-list-time">
              {fmt12(ev.start_time)}{ev.end_time ? ` – ${fmt12(ev.end_time)}` : ''}
            </span>
          )}
        </div>
        <div className="cal-list-footer">
          <span className="cal-list-cat" style={{ color, borderColor: color }}>{ev.category}</span>
          <span className="cal-list-more">View details ›</span>
        </div>
      </button>
    </li>
  );
}

// ── Category Dropdown ─────────────────────────────────────────────────────────

function CategoryDropdown({ availCats, selectedCats, setSelectedCats }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const allChecked   = selectedCats.size === 0;
  const someChecked  = selectedCats.size > 0 && selectedCats.size < availCats.length;

  function isChecked(cat) {
    return selectedCats.size === 0 || selectedCats.has(cat);
  }

  function toggle(cat) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (isChecked(cat)) {
        if (prev.size === 0) {
          // "All" mode — uncheck this one: select everything else
          availCats.forEach((c) => { if (c !== cat) next.add(c); });
        } else {
          next.delete(cat);
          // If we just removed the last one, go back to "All"
        }
      } else {
        next.add(cat);
        // If all cats selected, simplify back to empty (= All)
        if (next.size === availCats.length) return new Set();
      }
      return next;
    });
  }

  const label = allChecked
    ? 'All Categories'
    : selectedCats.size === 1
      ? `1 Category selected`
      : `${selectedCats.size} Categories selected`;

  return (
    <div className="cal-cat-dropdown" ref={ref}>
      <button type="button" className={`cal-cat-dropdown-btn${!allChecked ? ' is-filtered' : ''}`}
        onClick={() => setOpen((o) => !o)}>
        <span className="cal-cat-dropdown-label">{label}</span>
        <span className={`cal-cat-dropdown-arrow${open ? ' is-open' : ''}`}>&#9660;</span>
      </button>

      {open && (
        <div className="cal-cat-dropdown-menu">
          {/* Select All row */}
          <label className="cal-cat-option cal-cat-option-all">
            <input
              type="checkbox"
              checked={allChecked}
              ref={(el) => { if (el) el.indeterminate = someChecked; }}
              onChange={() => setSelectedCats(new Set())}
            />
            <span>All Categories</span>
          </label>
          <div className="cal-cat-divider" />
          {availCats.map((cat) => (
            <label key={cat} className="cal-cat-option">
              <input type="checkbox" checked={isChecked(cat)} onChange={() => toggle(cat)} />
              <span className="cal-cat-dot" style={{ background: CATEGORY_COLORS[cat] || '#4a5568' }} />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Month View ────────────────────────────────────────────────────────────────

function MonthView({ year, month, events, todayIso, pickedDate, onPick, onPickDate }) {
  const firstDow = new Date(year, month, 1).getDay();
  const total    = new Date(year, month + 1, 0).getDate();
  const cells    = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  return (
    <div className="cal-month-wrap">
      <div className="cal-dow-row">
        {DAY_SHORT.map((d) => <div key={d} className="cal-dow">{d}</div>)}
      </div>
      <div className="cal-month-grid">
        {cells.map((day, i) => {
          if (!day) return <div key={`b${i}`} className="cal-month-cell cal-blank" />;
          const iso    = `${year}-${pad(month + 1)}-${pad(day)}`;
          const dayEvs = forDay(events, iso);
          const isToday  = iso === todayIso;
          const isPicked = iso === pickedDate;
          return (
            <div key={day} className={`cal-month-cell${isToday ? ' is-today' : ''}${isPicked ? ' is-picked' : ''}`}>
              <button
                type="button"
                className={`cal-day-num${isToday ? ' is-today-num' : ''}${isPicked ? ' is-picked-num' : ''}`}
                onClick={() => onPickDate(isPicked ? null : iso)}
                title={`View events on ${fmtLong(iso)}`}
              >
                {day}
              </button>
              <div className="cal-month-pills">
                {dayEvs.slice(0, 3).map((ev) => (
                  <button key={ev.id} type="button"
                    className="cal-pill" style={{ background: evColor(ev) }}
                    onClick={() => onPick(ev)} title={ev.title}>
                    {ev.title}
                  </button>
                ))}
                {dayEvs.length > 3 && (
                  <span className="cal-more">+{dayEvs.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Week View ─────────────────────────────────────────────────────────────────

function WeekView({ weekStart, events, todayIso, pickedDate, onPick, onPickDate }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const allDayRows = days.map((d) => forDay(events, toIso(d)).filter((ev) => !ev.start_time));
  const hasAllDay  = allDayRows.some((r) => r.length > 0);

  return (
    <div className="cal-tgrid-outer">
      <div className="cal-tgrid-header">
        <div className="cal-tgutter" />
        {days.map((d) => {
          const iso = toIso(d);
          const isPicked = iso === pickedDate;
          return (
            <div key={iso} className={`cal-tgrid-dhead${iso === todayIso ? ' is-today' : ''}${isPicked ? ' is-picked' : ''}`}>
              <span className="cal-tgrid-dow">{DAY_SHORT[d.getDay()]}</span>
              <button
                type="button"
                className={`cal-tgrid-datenum${iso === todayIso ? ' is-today-num' : ''}${isPicked ? ' is-picked-num' : ''}`}
                onClick={() => onPickDate(isPicked ? null : iso)}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {hasAllDay && (
        <div className="cal-allday-strip">
          <div className="cal-tgutter cal-tgutter-label">All day</div>
          {allDayRows.map((evs, i) => (
            <div key={i} className="cal-allday-cell">
              {evs.map((ev) => (
                <button key={ev.id} type="button" className="cal-pill"
                  style={{ background: evColor(ev) }} onClick={() => onPick(ev)}>
                  {ev.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="cal-tgrid-scroll">
        <div className="cal-tgrid-body">
          <div className="cal-tgutter-col">
            {HOURS.map((h) => (
              <div key={h} className="cal-hour-gutter">{fmt12(`${pad(h)}:00`)}</div>
            ))}
          </div>
          {days.map((d) => {
            const iso    = toIso(d);
            const timed  = forDay(events, iso).filter((ev) => !!ev.start_time);
            return (
              <div key={iso} className={`cal-day-col${iso === todayIso ? ' is-today' : ''}`}>
                {HOURS.map((h) => <div key={h} className="cal-hour-bg" />)}
                {timed.map((ev) => {
                  const sm = startMin(ev) ?? GRID_START * 60;
                  const em = endMin(ev) ?? sm + 60;
                  const top    = Math.max(0, ((sm - GRID_START * 60) / 60) * HOUR_PX);
                  const height = Math.max(24, ((em - sm) / 60) * HOUR_PX - 2);
                  if (sm < GRID_START * 60 || sm >= GRID_END * 60) return null;
                  return (
                    <button key={ev.id} type="button" className="cal-timed-ev"
                      style={{ top, height, background: evColor(ev) }}
                      onClick={() => onPick(ev)} title={ev.title}>
                      <span className="cal-timed-title">{ev.title}</span>
                      {height > 34 && <span className="cal-timed-time">{fmt12(ev.start_time)}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Day View ──────────────────────────────────────────────────────────────────

function DayView({ date, events, todayIso, onPick }) {
  const iso     = toIso(date);
  const dayEvs  = forDay(events, iso);
  const allDay  = dayEvs.filter((ev) => !ev.start_time);
  const timed   = dayEvs.filter((ev) => !!ev.start_time);
  const isToday = iso === todayIso;

  return (
    <div className="cal-tgrid-outer">
      <div className={`cal-day-view-head${isToday ? ' is-today' : ''}`}>
        <span className="cal-tgrid-dow">{DAY_FULL[date.getDay()]}</span>
        <span className="cal-day-view-date">
          {MONTH_NAMES[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </span>
      </div>

      {allDay.length > 0 && (
        <div className="cal-allday-strip">
          <div className="cal-tgutter cal-tgutter-label">All day</div>
          <div className="cal-allday-cell cal-allday-cell-full">
            {allDay.map((ev) => (
              <button key={ev.id} type="button" className="cal-pill"
                style={{ background: evColor(ev) }} onClick={() => onPick(ev)}>
                {ev.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {dayEvs.length === 0 && (
        <p className="cal-no-events">No events scheduled for this day.</p>
      )}

      <div className="cal-tgrid-scroll">
        <div className="cal-tgrid-body">
          <div className="cal-tgutter-col">
            {HOURS.map((h) => (
              <div key={h} className="cal-hour-gutter">{fmt12(`${pad(h)}:00`)}</div>
            ))}
          </div>
          <div className="cal-day-col cal-day-col-single">
            {HOURS.map((h) => <div key={h} className="cal-hour-bg" />)}
            {timed.map((ev) => {
              const sm = startMin(ev) ?? GRID_START * 60;
              const em = endMin(ev) ?? sm + 60;
              const top    = Math.max(0, ((sm - GRID_START * 60) / 60) * HOUR_PX);
              const height = Math.max(28, ((em - sm) / 60) * HOUR_PX - 2);
              if (sm < GRID_START * 60 || sm >= GRID_END * 60) return null;
              return (
                <button key={ev.id} type="button" className="cal-timed-ev"
                  style={{ top, height, background: evColor(ev) }}
                  onClick={() => onPick(ev)}>
                  <span className="cal-timed-title">{ev.title}</span>
                  <span className="cal-timed-time">
                    {fmt12(ev.start_time)}{ev.end_time ? ` – ${fmt12(ev.end_time)}` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const todayDate = useMemo(() => startOfDay(new Date()), []);
  const todayIso  = useMemo(() => toIso(todayDate), [todayDate]);

  const [view, setView]               = useState('month');
  const [current, setCurrent]         = useState(startOfDay(new Date()));
  const [allEvents, setAllEvents]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [pickedDate, setPickedDate]   = useState(null);
  const [listTab, setListTab]         = useState('upcoming');
  const [selectedCats, setSelectedCats] = useState(new Set());

  const [headerHeight, setHeaderHeight] = useState(90);
  const [searchQuery, setSearchQuery]   = useState('');
  const routerNavigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector('.municipal-header');
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    routerNavigate(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  useEffect(() => {
    getPublicEvents()
      .then((data) => setAllEvents(Array.isArray(data) ? data : []))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // All categories that have at least one event
  const availCats = useMemo(() => {
    const cats = new Set(allEvents.map((ev) => ev.category || 'General'));
    return [...cats].sort();
  }, [allEvents]);

  // Apply category filter to any event list
  function filterCats(evs) {
    if (selectedCats.size === 0) return evs;
    return evs.filter((ev) => selectedCats.has(ev.category || 'General'));
  }


  const visibleEvents = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth();
    let evs;
    if (view === 'month') {
      const from = `${y}-${pad(m + 1)}-01`;
      const to   = `${y}-${pad(m + 1)}-${pad(new Date(y, m + 1, 0).getDate())}`;
      evs = allEvents.filter((ev) => ev.event_date <= to && (ev.end_date || ev.event_date) >= from);
    } else if (view === 'week') {
      const ws  = startOfWeek(current);
      const we  = new Date(ws); we.setDate(we.getDate() + 6);
      const from = toIso(ws), to = toIso(we);
      evs = allEvents.filter((ev) => ev.event_date <= to && (ev.end_date || ev.event_date) >= from);
    } else {
      const iso = toIso(current);
      evs = allEvents.filter((ev) => evSpansDay(ev, iso));
    }
    return filterCats(evs);
  }, [allEvents, view, current, selectedCats]);

  const upcomingEvents = useMemo(() =>
    filterCats([...allEvents]
      .filter((ev) => (ev.end_date || ev.event_date) >= todayIso)
      .sort((a, b) => a.event_date.localeCompare(b.event_date))),
    [allEvents, todayIso, selectedCats]
  );

  const pastEvents = useMemo(() =>
    filterCats([...allEvents]
      .filter((ev) => (ev.end_date || ev.event_date) < todayIso)
      .sort((a, b) => b.event_date.localeCompare(a.event_date))),
    [allEvents, todayIso, selectedCats]
  );

  const pickedDateEvents = useMemo(() =>
    pickedDate ? filterCats(forDay(allEvents, pickedDate)) : [],
    [allEvents, pickedDate, selectedCats]
  );

  function navigate(dir) {
    setPickedDate(null);
    setCurrent((prev) => {
      const d = new Date(prev);
      if (view === 'month')     { d.setMonth(d.getMonth() + dir); d.setDate(1); }
      else if (view === 'week') { d.setDate(d.getDate() + dir * 7); }
      else                      { d.setDate(d.getDate() + dir); }
      return d;
    });
  }

  function handleSetView(v) {
    setPickedDate(null);
    setView(v);
  }

  function headerLabel() {
    const y = current.getFullYear();
    const m = current.getMonth();
    if (view === 'month') return `${MONTH_NAMES[m]} ${y}`;
    if (view === 'week') {
      const ws = startOfWeek(current);
      const we = new Date(ws); we.setDate(we.getDate() + 6);
      if (ws.getMonth() === we.getMonth())
        return `${MONTH_NAMES[ws.getMonth()]} ${ws.getDate()}–${we.getDate()}, ${ws.getFullYear()}`;
      return `${MONTH_NAMES[ws.getMonth()]} ${ws.getDate()} – ${MONTH_NAMES[we.getMonth()]} ${we.getDate()}, ${we.getFullYear()}`;
    }
    return `${DAY_FULL[current.getDay()]}, ${MONTH_NAMES[m]} ${current.getDate()}, ${y}`;
  }

  const weekStart = useMemo(() => startOfWeek(current), [current]);

  return (
    <div>
      <PageBanner title="" images={[calendarBanner]} height={180} />

      {/* Sticky title + search bar — matches Police Department page style */}
      <div style={{
        position: 'sticky',
        top: headerHeight,
        zIndex: 1100,
        background: '#0a4f90',
        color: '#fff',
        padding: '0.15rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', minWidth: 0 }}>
          <div style={{ fontFamily: "'Bree Serif', serif", fontWeight: 700, fontSize: '25px', letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 0, flex: '0 1 auto' }}>
            Events Calendar
          </div>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: '0 1 440px', maxWidth: '100%', minWidth: 0 }}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What can we help you find today?"
              aria-label="Search site"
              className="title-bar-search-input"
              style={{
                width: '100%',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '999px',
                padding: '0.45rem 0.8rem',
                fontSize: '0.95rem',
                color: '#12385c',
                background: '#ffffff',
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              style={{
                border: 'none',
                borderRadius: '999px',
                padding: '0.45rem 0.9rem',
                background: '#f2b21c',
                color: '#082c4f',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <section className="cal-page">
        <div className="container">
          <div className="cal-two-col">

            {/* ── Left: controls + calendar ── */}
            <div className="cal-left">
              <div className="cal-controls-bar">
                <div className="cal-view-tabs">
                  {['day', 'week', 'month'].map((v) => (
                    <button key={v} type="button"
                      className={`cal-view-tab${view === v ? ' is-active' : ''}`}
                      onClick={() => handleSetView(v)}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>

                {!loading && availCats.length > 0 && (
                  <CategoryDropdown
                    availCats={availCats}
                    selectedCats={selectedCats}
                    setSelectedCats={setSelectedCats}
                  />
                )}

                <div className="cal-nav-row">
                  <button type="button" className="cal-nav-btn" onClick={() => navigate(-1)} aria-label="Previous">&#8592;</button>
                  <button type="button" className="cal-today-btn"
                    onClick={() => { setCurrent(startOfDay(new Date())); setPickedDate(null); }}>
                    Today
                  </button>
                  <span className="cal-header-label">{headerLabel()}</span>
                  <button type="button" className="cal-nav-btn" onClick={() => navigate(1)} aria-label="Next">&#8594;</button>
                </div>
              </div>

              <div className="cal-body">
                {loading ? (
                  <p className="cal-loading">Loading events…</p>
                ) : view === 'month' ? (
                  <MonthView
                    year={current.getFullYear()} month={current.getMonth()}
                    events={visibleEvents} todayIso={todayIso}
                    pickedDate={pickedDate} onPick={setSelected} onPickDate={setPickedDate}
                  />
                ) : view === 'week' ? (
                  <WeekView
                    weekStart={weekStart} events={visibleEvents} todayIso={todayIso}
                    pickedDate={pickedDate} onPick={setSelected} onPickDate={setPickedDate}
                  />
                ) : (
                  <DayView date={current} events={visibleEvents} todayIso={todayIso} onPick={setSelected} />
                )}
              </div>
            </div>

            {/* ── Right: event list ── */}
            <div className="cal-right">
              <div className="cal-list-panel">

                {pickedDate ? (
                  <>
                    <div className="cal-list-date-header">
                      <div className="cal-list-date-title">{fmtLong(pickedDate)}</div>
                      <button type="button" className="cal-list-clear-btn"
                        onClick={() => setPickedDate(null)}>
                        &#8592; All Events
                      </button>
                    </div>
                    {pickedDateEvents.length === 0 ? (
                      <p className="cal-list-empty">No events on this day.</p>
                    ) : (
                      <ul className="cal-event-list">
                        {pickedDateEvents.map((ev) => (
                          <EventListRow key={ev.id} ev={ev} onPick={setSelected} />
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <div className="cal-list-header">
                      <button type="button"
                        className={`cal-list-tab${listTab === 'upcoming' ? ' is-active' : ''}`}
                        onClick={() => setListTab('upcoming')}>
                        Upcoming
                        <span className="cal-tab-badge">{upcomingEvents.length}</span>
                      </button>
                      <button type="button"
                        className={`cal-list-tab${listTab === 'past' ? ' is-active' : ''}`}
                        onClick={() => setListTab('past')}>
                        Past
                        <span className="cal-tab-badge">{pastEvents.length}</span>
                      </button>
                    </div>
                    {(listTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 ? (
                      <p className="cal-list-empty">No events.</p>
                    ) : (
                      <ul className="cal-event-list">
                        {(listTab === 'upcoming' ? upcomingEvents : pastEvents).map((ev) => (
                          <EventListRow key={ev.id} ev={ev} onPick={setSelected} />
                        ))}
                      </ul>
                    )}
                  </>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {selected && <EventModal ev={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

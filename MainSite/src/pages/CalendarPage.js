import { useEffect, useMemo, useState } from 'react';
import { getPublicEvents } from '../api/cmsApi';
import { PageBanner } from '../components/PageBanner';

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
const GRID_START = 6;   // 6 AM
const GRID_END   = 22;  // 10 PM
const HOUR_PX    = 64;  // px per hour

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

// ── Month View ────────────────────────────────────────────────────────────────

function MonthView({ year, month, events, todayIso, onPick }) {
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
          const isToday = iso === todayIso;
          return (
            <div key={day} className={`cal-month-cell${isToday ? ' is-today' : ''}`}>
              <span className={`cal-day-num${isToday ? ' is-today-num' : ''}`}>{day}</span>
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

function WeekView({ weekStart, events, todayIso, onPick }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const allDayRows = days.map((d) => forDay(events, toIso(d)).filter((ev) => !ev.start_time));
  const hasAllDay  = allDayRows.some((r) => r.length > 0);

  return (
    <div className="cal-tgrid-outer">
      {/* Day headers */}
      <div className="cal-tgrid-header">
        <div className="cal-tgutter" />
        {days.map((d) => {
          const iso = toIso(d);
          return (
            <div key={iso} className={`cal-tgrid-dhead${iso === todayIso ? ' is-today' : ''}`}>
              <span className="cal-tgrid-dow">{DAY_SHORT[d.getDay()]}</span>
              <span className={`cal-tgrid-datenum${iso === todayIso ? ' is-today-num' : ''}`}>{d.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* All-day row */}
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

      {/* Scrollable grid */}
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

  const [view, setCurrent_view] = useState('month');
  const [current, setCurrent] = useState(startOfDay(new Date()));
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [listTab, setListTab] = useState('upcoming');

  useEffect(() => {
    getPublicEvents()
      .then((data) => setAllEvents(Array.isArray(data) ? data : []))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // Derive visible events for the current view window
  const visibleEvents = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth();
    if (view === 'month') {
      const from = `${y}-${pad(m + 1)}-01`;
      const to   = `${y}-${pad(m + 1)}-${pad(new Date(y, m + 1, 0).getDate())}`;
      return allEvents.filter((ev) => ev.event_date <= to && (ev.end_date || ev.event_date) >= from);
    }
    if (view === 'week') {
      const ws  = startOfWeek(current);
      const we  = new Date(ws); we.setDate(we.getDate() + 6);
      const from = toIso(ws), to = toIso(we);
      return allEvents.filter((ev) => ev.event_date <= to && (ev.end_date || ev.event_date) >= from);
    }
    const iso = toIso(current);
    return allEvents.filter((ev) => evSpansDay(ev, iso));
  }, [allEvents, view, current]);

  // Upcoming / past lists from all events
  const upcomingEvents = useMemo(() =>
    [...allEvents]
      .filter((ev) => (ev.end_date || ev.event_date) >= todayIso)
      .sort((a, b) => a.event_date.localeCompare(b.event_date)),
    [allEvents, todayIso]
  );
  const pastEvents = useMemo(() =>
    [...allEvents]
      .filter((ev) => (ev.end_date || ev.event_date) < todayIso)
      .sort((a, b) => b.event_date.localeCompare(a.event_date)),
    [allEvents, todayIso]
  );

  function navigate(dir) {
    setCurrent((prev) => {
      const d = new Date(prev);
      if (view === 'month')      { d.setMonth(d.getMonth() + dir); d.setDate(1); }
      else if (view === 'week')  { d.setDate(d.getDate() + dir * 7); }
      else                       { d.setDate(d.getDate() + dir); }
      return d;
    });
  }

  function setView(v) {
    setCurrent_view(v);
    // keep current date as reference; just change the view granularity
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
  const listEvents = listTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div>
      <PageBanner title="Events Calendar" />

      <section className="cal-page">
        <div className="container">

          {/* ── Controls bar ─────────────────────────────────────────────── */}
          <div className="cal-controls-bar">
            <div className="cal-view-tabs">
              {['day', 'week', 'month'].map((v) => (
                <button key={v} type="button"
                  className={`cal-view-tab${view === v ? ' is-active' : ''}`}
                  onClick={() => setView(v)}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            <div className="cal-nav-row">
              <button type="button" className="cal-nav-btn" onClick={() => navigate(-1)} aria-label="Previous">&#8592;</button>
              <button type="button" className="cal-today-btn" onClick={() => setCurrent(startOfDay(new Date()))}>Today</button>
              <span className="cal-header-label">{headerLabel()}</span>
              <button type="button" className="cal-nav-btn" onClick={() => navigate(1)} aria-label="Next">&#8594;</button>
            </div>
          </div>

          {/* ── Calendar body ─────────────────────────────────────────────── */}
          <div className="cal-body">
            {loading ? (
              <p className="cal-loading">Loading events…</p>
            ) : view === 'month' ? (
              <MonthView
                year={current.getFullYear()} month={current.getMonth()}
                events={visibleEvents} todayIso={todayIso} onPick={setSelected}
              />
            ) : view === 'week' ? (
              <WeekView weekStart={weekStart} events={visibleEvents} todayIso={todayIso} onPick={setSelected} />
            ) : (
              <DayView date={current} events={visibleEvents} todayIso={todayIso} onPick={setSelected} />
            )}
          </div>

          {/* ── Upcoming / Past list ──────────────────────────────────────── */}
          <div className="cal-list-panel">
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

            {listEvents.length === 0 ? (
              <p className="cal-list-empty">No events.</p>
            ) : (
              <ul className="cal-event-list">
                {listEvents.map((ev) => (
                  <li key={ev.id} className="cal-list-item-wrap">
                    <button type="button" className="cal-list-item" onClick={() => setSelected(ev)}>
                      <span className="cal-list-dot" style={{ background: evColor(ev) }} />
                      <span className="cal-list-info">
                        <span className="cal-list-title">{ev.title}</span>
                        <span className="cal-list-meta">
                          {fmtLong(ev.event_date)}
                          {ev.start_time ? ` · ${fmt12(ev.start_time)}` : ''}
                          {ev.location ? ` · ${ev.location}` : ''}
                        </span>
                      </span>
                      <span className="cal-list-cat" style={{ color: evColor(ev) }}>{ev.category}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </section>

      {selected && <EventModal ev={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

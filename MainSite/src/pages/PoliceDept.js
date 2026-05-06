import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageBanner } from '../components/PageBanner';
import policeHero1 from '../image/hero-6.png';
import policeMission from '../image/hero-8-Police1.png';

const POLICE_IMAGES = [policeHero1];

const STAFF = [
  { name: 'Demo Officer One', title: 'Chief of Police', phone: '(601) 876-5678 ext. 101' },
  { name: 'Demo Officer Two', title: 'Deputy Chief', phone: '(601) 876-5678 ext. 102' },
  { name: 'Demo Officer Three', title: 'Administrative Assistant', phone: '(601) 876-5678 ext. 103' },
];
const RELATED_PAGES = [
  { label: 'Behavioral Health Liaisons', to: '/police/behavioral-health-liaisons' },
  { label: 'Domestic Violence', to: '/police/domestic-violence' },
  { label: 'Forms', to: '/police/forms' },
  { label: 'History', to: '/police/history' },
  { label: 'Report And Records Request', to: '/police/report-and-records-request' },
  { label: 'Sex Offenders', to: '/police/sex-offenders' },
  { label: 'Staff Directory', to: '/police/staff-directory', active: true },
  { label: "Visiting City of Magnolia / FAQ's", to: '/police/visiting-faq' },
];

export default function PoliceDept() {
  const [headerHeight, setHeaderHeight] = useState(90);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector('.municipal-header');
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    navigate(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  return (
    <div>
      <PageBanner title="" images={POLICE_IMAGES} height={180} />

      {/* Sticky department name bar */}
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
            Police Department
          </div>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: '0 1 440px', maxWidth: '100%', minWidth: 0 }}>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
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

      <section className="content-section first-section police-content-shell">
        <div className="container police-page-layout">
          <aside className="police-side-nav" aria-label="Police links and contacts">
            <article className="police-side-card">
              <h4 style={{ fontSize: '18px' }}>How To Reach Us</h4>
              <p>
                <a href="https://maps.google.com/?q=115+W+Bay+St,+Magnolia,+MS+39652" target="_blank" rel="noreferrer">
                  115 W Bay St, Magnolia, MS 39652
                </a>
              </p>
              <p>
                <a href="tel:6018765678">(601) 876-5678</a><br />
                Fax: (601) 876-5034<br />
                TTY: (601) 876-5678<br />
                Emergency: <a href="tel:911">911</a>
              </p>
            </article>

            <article className="police-side-card">
              <h4 style={{ fontSize: '18px' }}>Related Pages</h4>
              <ul className="police-related-list">
                {RELATED_PAGES.map((item) => (
                  <li key={item.label} className={item.active ? 'is-active' : ''}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </article>
          </aside>

          <div className="police-main-content city-content-wrap">
            {/* Breadcrumb navigation */}
            <nav style={{
              marginBottom: '1.25rem',
              fontSize: '14px',
              fontWeight: 600,
            }}>
              <Link to="/" style={{ color: '#c9a227', textDecoration: 'none' }}>Home</Link>
              <span style={{ margin: '0 0.5rem', color: '#888' }}>›</span>
              <Link to="/departments" style={{ color: '#c9a227', textDecoration: 'none' }}>Departments</Link>
              <span style={{ margin: '0 0.5rem', color: '#888' }}>›</span>
              <span style={{ color: '#333' }}>Police Department</span>
            </nav>

            <img
              src={policeMission}
              alt="Police Department"
              style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1.5rem' }}
            />

            <h3>Mission Statement</h3>
            <p>
              The mission statement of the Magnolia Police Department is to provide
              progressive, highly trained, and properly equipped personnel to work with our
              community and to protect life through devotion to the citizens and visitors we serve.
              We will do so with pride, honor, and integrity.
            </p>

            <h4 style={{ color: '#0a4f90', fontSize: '1.25rem', marginBottom: '1rem' }}>About The Department</h4>
            <p>
              The department serves the city and surrounding area with a dedicated team of full-time
              officers, reserve officers, and an administrative assistant. Many officers take on
              special duties, including Detective, School Resource Officer, Special Response Team,
              the Crisis Intervention Team, the Crisis Negotiation Team, and the Peer Support Team.
            </p>
            <p>
              The Magnolia Police Department is honored to serve our community and prides itself in
              going above and beyond to assist its citizens and many visitors.
            </p>

            <h4 style={{ color: '#0a4f90', fontSize: '1.25rem', marginBottom: '1rem' }}>Staff Contacts</h4>
            <table className="staff-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0a4f90', color: '#fff' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Title</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {STAFF.map((s, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f4f8fc' : '#fff' }}>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dce6f0' }}>{s.name}</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dce6f0' }}>{s.title}</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dce6f0' }}>
                      <a href={`tel:${s.phone.replace(/[^0-9]/g, '')}`}>{s.phone}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ color: '#0a4f90', fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Communications Center</h4>
            <p>
              The mission of the Communications Center is to provide rapid and convenient access to
              public safety for the citizens of the city and all those passing through our jurisdiction.
            </p>
            <p>
              The communications center, which dispatches for the Police and Fire Departments, is
              staffed 24 hours per day, 365 days per year. Dispatchers are responsible for answering
              emergency and non-emergency calls for public assistance, animal control, patrol staff,
              administration, and records. Whether you call or stop in, a dispatcher will be ready to
              assist you with any situation.
            </p>
            <p>
              The Department requests that when calling in an <strong>EMERGENCY</strong>, call{' '}
              <a href="tel:911"><strong>9-1-1</strong></a>. When calling for a business-related issue
              or to speak to an officer, please use our business line{' '}
              <a href="tel:6018765678">(601) 876-5678</a>. Calling 9-1-1 in a non-emergency situation
              may prevent dispatchers from answering a true emergency call as quickly as possible.
            </p>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f4f8fc', borderLeft: '4px solid #0a4f90', borderRadius: 2 }}>
              <h4 style={{ color: '#0a4f90', marginBottom: '.5rem' }}>Contact the Police Department</h4>
              <p style={{ margin: '0 0 .4rem', fontSize: '.95rem' }}>
                <strong>Address:</strong> 115 W Bay St, Magnolia, MS 39652
              </p>
              <p style={{ margin: '0 0 .4rem', fontSize: '.95rem' }}>
                <strong>Non-Emergency:</strong>{' '}
                <a href="tel:6018765678">(601) 876-5678</a>
              </p>
              <p style={{ margin: '0 0 .4rem', fontSize: '.95rem' }}>
                <strong>Emergency:</strong>{' '}
                <a href="tel:911">9-1-1</a>
              </p>
              <p style={{ margin: '1rem 0 0', fontSize: '.95rem' }}>
                <Link to="/how-do-i/contact-us">Contact Us Online</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

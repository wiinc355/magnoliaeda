import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageBanner } from '../components/PageBanner';
import heroImage from '../image/hero-6.png';

const BANNER_IMAGES = [heroImage];

const DEPARTMENT_LINKS = [
  { label: 'Finance', to: '/department/finance' },
  { label: 'Fire', to: '/department/fire' },
  { label: 'Parks & Recreation', to: '/department/parks-recreation' },
  { label: 'Police', to: '/department/police' },
  { label: 'Public Works', to: '/department/public-works' },
  { label: 'Boards & Committees', to: '/government/boards-committees' },
  { label: 'Contact City Hall', to: '/how-do-i/contact-us' }
];

const RESOURCE_LINKS = [
  { label: 'Human Resources', to: '/how-do-i/contact-us' },
  { label: 'Emergency Services', to: '/department/fire' },
  { label: 'Solid Waste & Recycling', to: '/resource/solid-waste-recycling' },
  { label: 'Permits & Licenses', to: '/resource/permits-licenses' }
];

export default function DepartmentsPage() {
  const [headerHeight, setHeaderHeight] = useState(90);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const relatedPages = [...DEPARTMENT_LINKS, ...RESOURCE_LINKS];

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
      <PageBanner title="" images={BANNER_IMAGES} height={220} />

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
            Departments
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
          <aside className="police-side-nav" aria-label="Related department pages">
            <article className="police-side-card">
              <h4 style={{ fontSize: '18px' }}>Related Pages</h4>
              <ul className="police-related-list">
                {relatedPages.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </article>
          </aside>

          <div className="police-main-content city-content-wrap">
            <nav style={{
              marginBottom: '1.25rem',
              fontSize: '14px',
              fontWeight: 600,
            }}>
              <Link to="/" style={{ color: '#c9a227', textDecoration: 'none' }}>Home</Link>
              <span style={{ margin: '0 0.5rem', color: '#888' }}>›</span>
              <span style={{ color: '#333' }}>Departments</span>
            </nav>

            <h3>Departments</h3>
            <p>
              Explore Magnolia city departments, leadership offices, and core municipal services. Use the directory below
              to navigate to each department page.
            </p>

            <div className="departments-link-grid" role="list">
              {DEPARTMENT_LINKS.map((item) => (
                <Link key={item.label} to={item.to} className="departments-link-card" role="listitem">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

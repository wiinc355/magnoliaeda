import React from 'react';
import { PageBanner } from '../components/PageBanner';

const STAFF = [
  { name: 'TBD', title: 'Executive Director', email: 'director@magnoliaeda.com' },
  { name: 'TBD', title: 'Business Development Manager', email: 'bizdev@magnoliaeda.com' },
  { name: 'TBD', title: 'Administrative Coordinator', email: 'admin@magnoliaeda.com' },
];

const BOARD = [
  { name: 'TBD', title: 'Board Chairman' },
  { name: 'TBD', title: 'Vice Chairman' },
  { name: 'TBD', title: 'Secretary / Treasurer' },
  { name: 'TBD', title: 'Board Member' },
  { name: 'TBD', title: 'Board Member' },
  { name: 'TBD', title: 'Board Member' },
];

export default function StaffBoard() {
  return (
    <div>
      <PageBanner title="Staff &amp; Board" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Our Team</h3>
          <p>
            The Magnolia EDA is staffed by dedicated professionals committed to the economic
            growth of Magnolia and Pike County, Mississippi.
          </p>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h4 style={{ color: '#2d6a4f', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Staff</h4>
          <div className="staff-grid">
            {STAFF.map((s, i) => (
              <div key={i} className="staff-card">
                <h4>{s.name}</h4>
                <p className="title">{s.title}</p>
                <p className="email"><a href={`mailto:${s.email}`}>{s.email}</a></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h4 style={{ color: '#2d6a4f', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Board of Directors</h4>
          <div className="staff-grid">
            {BOARD.map((b, i) => (
              <div key={i} className="staff-card">
                <h4>{b.name}</h4>
                <p className="title">{b.title}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f8f8f6', borderLeft: '4px solid #2d6a4f', borderRadius: 2 }}>
            <h4 style={{ color: '#2d6a4f', marginBottom: '.5rem' }}>Board Meeting Minutes</h4>
            <p style={{ margin: 0, color: '#555', fontSize: '.92rem' }}>
              Board meeting minutes will be posted here as they become available.
              For inquiries, please contact us at <a href="mailto:eda@cityofmagnolia.com">eda@cityofmagnolia.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

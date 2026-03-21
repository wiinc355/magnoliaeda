import React from 'react';
import { PageBanner } from '../components/PageBanner';

const COUNTIES = [
  { county: 'Pike County (Magnolia / McComb)', pct: '100%', workers: '~19,200' },
  { county: 'Amite County', pct: '8%', workers: '~1,400' },
  { county: 'Walthall County', pct: '6%', workers: '~1,000' },
  { county: 'Lincoln County (Brookhaven)', pct: '12%', workers: '~2,200' },
  { county: 'Copiah County', pct: '5%', workers: '~900' },
  { county: 'Lawrence County', pct: '4%', workers: '~700' },
  { county: 'Marion County', pct: '7%', workers: '~1,300' },
  { county: 'All Other Counties', pct: '58%', workers: '~10,700' },
];

export default function CommutingPatterns() {
  return (
    <div>
      <PageBanner title="Commuting Patterns" />

      <section className="content-section first-section">
        <div className="container">
          <h3>A Regional Workforce That Comes to You</h3>
          <div className="text-wrapper">
            <p>
              Magnolia draws workers from across southwest Mississippi and even into Louisiana.
              The regional commute shed provides employers with a larger talent pool than the
              local population alone suggests.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h4>Where Workers Come From — Pike County Labor Shed</h4>

          <table className="data-table">
            <thead>
              <tr>
                <th>Origin County</th>
                <th>Share of Labor Shed</th>
                <th>Estimated Workers</th>
              </tr>
            </thead>
            <tbody>
              {COUNTIES.map((row, i) => (
                <tr key={i}>
                  <td>{row.county}</td>
                  <td>{row.pct}</td>
                  <td>{row.workers}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '.8rem', color: '#777' }}>
            Source: US Census Longitudinal Employer-Household Dynamics (LEHD) / estimates
          </p>

          <h4>Drive Times from Magnolia</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
            {[
              { city: 'McComb, MS', time: '10 min' },
              { city: 'Brookhaven, MS', time: '25 min' },
              { city: 'Natchez, MS', time: '50 min' },
              { city: 'Jackson, MS', time: '1 hr 20 min' },
              { city: 'Baton Rouge, LA', time: '1 hr 30 min' },
              { city: 'New Orleans, LA', time: '2 hrs' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8f8f6', padding: '1rem', textAlign: 'center', borderRadius: 4, borderTop: '3px solid #2d6a4f' }}>
                <strong style={{ color: '#2d6a4f', display: 'block', marginBottom: '.25rem' }}>{item.city}</strong>
                <span style={{ color: '#555', fontSize: '.9rem' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

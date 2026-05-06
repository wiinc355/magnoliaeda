import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function Infrastructure() {
  return (
    <div>
      <PageBanner title="Infrastructure" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Built for Business</h3>
          <div className="text-wrapper">
            <p>
              Magnolia's infrastructure provides businesses with the reliable utilities, connectivity,
              and transportation links needed to operate efficiently and cost-effectively.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <h4>Utilities</h4>
          <p>
            <strong>Electric:</strong> Entergy Mississippi provides competitive-rate electric service
            throughout Magnolia and Pike County. Industrial rates are among the lowest in the Southeast,
            and Entergy offers economic development rate programs for qualifying new and expanding businesses.
          </p>
          <p>
            <strong>Natural Gas:</strong> CenterPoint Energy provides natural gas service to the city
            and surrounding industrial areas. Reliable pipeline infrastructure supports high-demand
            industrial users.
          </p>
          <p>
            <strong>Water &amp; Sewer:</strong> The City of Magnolia operates a modern water and
            wastewater system with capacity to serve industrial users. Water rates are competitive,
            and the city has demonstrated willingness to extend infrastructure to accommodate new
            major employers.
          </p>

          <h4>Telecommunications</h4>
          <p>
            High-speed fiber optic internet service is available in Magnolia and the industrial park.
            Multiple providers serve the area, including options for dedicated fiber connections
            for data-intensive businesses.
          </p>

          <h4>Rail</h4>
          <p>
            Kansas City Southern (now CPKC) Railway provides freight rail service through
            Pike County. Industries requiring rail access can be accommodated at the Magnolia
            Industrial Park, which has rail spur capabilities.
          </p>

          <h4>Workforce Facilities</h4>
          <p>
            Southwest Mississippi Community College in Summit (12 miles) and the Southwest
            Mississippi Regional Medical Center in McComb (10 miles) anchor the region's
            educational and healthcare infrastructure that supports a high quality of life
            for your workforce.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {[
              { icon: '⚡', label: 'Electric', detail: 'Entergy Mississippi' },
              { icon: '🔥', label: 'Natural Gas', detail: 'CenterPoint Energy' },
              { icon: '💧', label: 'Water & Sewer', detail: 'City of Magnolia' },
              { icon: '🌐', label: 'Fiber Internet', detail: 'Multiple providers' },
              { icon: '🚂', label: 'Rail', detail: 'CPKC Railway' },
              { icon: '📡', label: 'Telecom', detail: 'Multiple carriers' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8f8f6', padding: '1.25rem', borderRadius: 4, textAlign: 'center', borderTop: '3px solid #2d6a4f' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.4rem' }}>{item.icon}</div>
                <strong style={{ color: '#2d6a4f', display: 'block' }}>{item.label}</strong>
                <span style={{ fontSize: '.85rem', color: '#666' }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

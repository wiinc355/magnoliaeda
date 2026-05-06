import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function TransModal() {
  return (
    <div>
      <PageBanner title="Trans-Modal Transportation" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Move Your Products. Move Your Business.</h3>
          <div className="text-wrapper">
            <p>
              Magnolia's strategic location provides businesses with multiple transportation
              options — highway, rail, air, and port — making it easy to receive raw materials
              and ship finished products to customers across the nation and around the world.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <h4>Highway</h4>
          <p>
            Magnolia sits at the intersection of <strong>US Highway 51</strong> (the historic
            north-south backbone of Mississippi, paralleling I-55) and <strong>US Highway 98</strong>
            (east-west from Mobile, Alabama to Natchez, Mississippi). Interstate 55 is accessible
            at the McComb exit, just 10 miles north of Magnolia, providing direct north-south
            access to New Orleans (2 hours south) and Jackson, Memphis, and Chicago to the north.
          </p>

          <h4>Rail</h4>
          <p>
            <strong>CPKC (formerly Kansas City Southern) Railway</strong> operates through Pike
            County, providing freight rail service connecting the Gulf of Mexico ports to the
            Midwest and beyond. Industries in Magnolia can access direct rail service, and
            the Magnolia Industrial Park has provisions for rail spur development.
          </p>

          <h4>Ports</h4>
          <p>
            <strong>Port of New Orleans</strong> (~120 miles south via US 51 / I-55): One of
            the largest ports in the nation by tonnage, with container, break-bulk, dry bulk,
            and liquid bulk terminals. Direct access to global markets.
          </p>
          <p>
            <strong>Port of Mobile</strong> (~165 miles southeast via US 98): Alabama's deepwater
            port handling containers, coal, and a wide range of bulk commodities.
          </p>
          <p>
            <strong>Port of Baton Rouge</strong> (~130 miles southwest): Major inland river port
            on the Mississippi River with connections to the entire inland waterway system.
          </p>

          <h4>Air Freight &amp; Passenger</h4>
          <p>
            <strong>Golden Triangle Regional Airport (GTR)</strong> in Columbus and{' '}
            <strong>Jackson-Medgar Wiley Evers International Airport (JAN)</strong> in Jackson
            (85 miles north) provide commercial air service. For cargo, additional options
            include Louis Armstrong New Orleans International Airport (MSY) and Baton Rouge
            Metropolitan Airport (BTR).
          </p>
          <p>
            <strong>McComb-Pike County Airport</strong>, just 10 miles north of Magnolia,
            accommodates general aviation, private, and corporate aircraft, providing convenient
            executive travel options.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {[
              { icon: '🛣️', label: 'Highway', detail: 'US 51 • US 98 • I-55 (10 mi)' },
              { icon: '🚂', label: 'Rail', detail: 'CPKC Railway' },
              { icon: '⚓', label: 'Ports', detail: 'New Orleans • Mobile • Baton Rouge' },
              { icon: '✈️', label: 'Air', detail: 'McComb Airport + 2 Intl. Airports' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8f8f6', padding: '1.25rem', textAlign: 'center', borderRadius: 4, borderTop: '3px solid #2d6a4f' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.4rem' }}>{item.icon}</div>
                <strong style={{ color: '#2d6a4f', display: 'block' }}>{item.label}</strong>
                <span style={{ fontSize: '.82rem', color: '#666' }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

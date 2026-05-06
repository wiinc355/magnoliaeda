import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function Overview() {
  return (
    <div>
      <PageBanner title="Overview" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Magnolia Economic Development Authority (EDA)</h3>
          <div className="text-wrapper">
            <p>
              The <strong className="italic" style={{ fontStyle: 'italic', color: '#b5811a' }}>
                Magnolia Economic Development Authority (EDA)
              </strong> is your investment partner, with tailored resources and programs that support
              business investment and job growth in Magnolia and Pike County, Mississippi. The
              economic impact is clear. We believe in Magnolia, and so do the businesses making
              commitments here.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section columns-section">
        <div className="container">
          <div className="row">
            <div className="col-text">
              <h4>Our Mission</h4>
              <p>
                The Magnolia EDA works to attract, retain, and expand businesses and industries
                in Magnolia, Mississippi. We serve as a catalyst for economic growth by providing
                technical assistance, connecting businesses with available incentives, and
                marketing the community's competitive advantages.
              </p>

              <h4>Strategic Location</h4>
              <p>
                Magnolia is situated at the crossroads of US Highway 51 (North-South) and
                US Highway 98 (East-West), with I-55 just minutes away. This prime location
                provides businesses with excellent access to regional and national markets.
                The Port of New Orleans is approximately 120 miles to the south, and the
                Port of Mobile is roughly 165 miles to the southeast.
              </p>

              <h4>Pike County Advantage</h4>
              <p>
                As the county seat of Pike County, Magnolia benefits from a strong support
                network of county government, local businesses, educational institutions,
                and community organizations all working toward the same goal: a thriving,
                prosperous community.
              </p>

              <h4>Why Magnolia?</h4>
              <ul>
                <li>Strategic location on US 51 and US 98</li>
                <li>Minutes from I-55 corridor</li>
                <li>Proximity to Gulf ports and international airports</li>
                <li>Skilled and available workforce</li>
                <li>Competitive tax environment</li>
                <li>Low cost of living and doing business</li>
                <li>Supportive local and state government</li>
              </ul>
            </div>
            <div className="col-image">
              <div style={{
                background: 'linear-gradient(135deg, #e8f4ee, #d0e9d8)',
                height: 360,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2d6a4f',
                fontSize: '1rem',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '1.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌸</div>
                  <strong>Magnolia, MS</strong><br />
                  Pike County<br /><br />
                  <em>Where business blooms</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

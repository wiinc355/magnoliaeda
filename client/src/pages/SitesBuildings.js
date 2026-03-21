import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function SitesBuildings() {
  return (
    <div>
      <PageBanner title="Sites &amp; Buildings" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Premier Blend of Sites</h3>
          <div className="text-wrapper">
            <p>
              With available properties for sale or lease for industry, office, retail, and
              investment, <strong>Magnolia, Mississippi</strong> offers robust business opportunities
              for companies looking to establish or expand operations.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <div style={{
            background: '#f8f8f6',
            borderTop: '4px solid #2d6a4f',
            padding: '1.5rem',
            marginBottom: '2rem',
            borderRadius: 2
          }}>
            <h4 style={{ color: '#2d6a4f', marginBottom: '.5rem' }}>Magnolia Industrial Park</h4>
            <p>
              Shovel-ready industrial sites with access to utilities, rail, and major highways.
              Sites available from 2 to 50+ acres. The park features:
            </p>
            <ul>
              <li>Water and sewer available to all sites</li>
              <li>Natural gas service available</li>
              <li>Fiber optic connectivity</li>
              <li>Direct US Highway 51 access</li>
              <li>Rail access via KCS Railway</li>
            </ul>
          </div>

          <div style={{
            background: '#f8f8f6',
            borderTop: '4px solid #b5811a',
            padding: '1.5rem',
            marginBottom: '2rem',
            borderRadius: 2
          }}>
            <h4 style={{ color: '#b5811a', marginBottom: '.5rem' }}>Downtown Commercial Properties</h4>
            <p>
              Historic downtown Magnolia offers retail, office, and mixed-use commercial spaces.
              Many buildings are eligible for historic tax credits. Ideal for restaurants, boutiques,
              professional offices, and service businesses.
            </p>
          </div>

          <div style={{
            background: '#f8f8f6',
            borderTop: '4px solid #a8c957',
            padding: '1.5rem',
            marginBottom: '2rem',
            borderRadius: 2
          }}>
            <h4 style={{ color: '#2d6a4f', marginBottom: '.5rem' }}>Greenfield Development Sites</h4>
            <p>
              Undeveloped parcels available throughout Pike County, ranging from small commercial
              lots to large tracts ideal for campus-style manufacturing or distribution facilities.
            </p>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e8f4ee', borderRadius: 4 }}>
            <h4 style={{ color: '#2d6a4f', marginBottom: '.5rem' }}>Contact Us About Available Sites</h4>
            <p style={{ margin: 0 }}>
              For more information about available sites and buildings, please contact the
              Magnolia EDA:<br /><br />
              <strong>Magnolia Economic Development Authority</strong><br />
              115 West Bay Street • Magnolia, MS 39652<br />
              (601) 876-5678 • <a href="mailto:eda@cityofmagnolia.com">eda@cityofmagnolia.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

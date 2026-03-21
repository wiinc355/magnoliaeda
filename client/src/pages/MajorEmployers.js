import React from 'react';
import { PageBanner } from '../components/PageBanner';

const EMPLOYERS = [
  { name: 'Southwest MS Regional Medical Center', employees: '1,200+', industry: 'Healthcare' },
  { name: 'Pike County School District', employees: '900+', industry: 'Education' },
  { name: 'Walmart (McComb)', employees: '400+', industry: 'Retail / Distribution' },
  { name: 'Peavey Company', employees: '300+', industry: 'Feed / Agriculture' },
  { name: 'Graphic Packaging International', employees: '250+', industry: 'Packaging Manufacturing' },
  { name: 'Tyson Foods', employees: '200+', industry: 'Food Processing' },
  { name: 'City of McComb / Pike County Gov.', employees: '300+', industry: 'Government' },
  { name: 'Boise Cascade', employees: '150+', industry: 'Wood Products' },
  { name: 'Advanced Auto Parts Distribution', employees: '100+', industry: 'Distribution' },
  { name: 'Various Small Manufacturers', employees: '50–150', industry: 'Manufacturing' },
];

export default function MajorEmployers() {
  return (
    <div>
      <PageBanner title="Major Employers" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Outstanding Yield</h3>
          <div className="text-wrapper">
            <p>
              <strong>Magnolia and Pike County, Mississippi</strong> are home to a diverse base
              of employers, from healthcare and education to manufacturing, food processing, and
              distribution. The region's economic foundation is built on a blend of established
              industries and growing businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h4>Top Employers — Pike County Region</h4>

          <table className="data-table">
            <thead>
              <tr>
                <th>Employer</th>
                <th>Employees</th>
                <th>Industry</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYERS.map((row, i) => (
                <tr key={i}>
                  <td>{row.name}</td>
                  <td>{row.employees}</td>
                  <td>{row.industry}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '.8rem', color: '#777' }}>
            Source: Magnolia Economic Development Authority (estimates) — actual figures may vary.
            Contact us for up-to-date employer information.
          </p>

          <div style={{ background: '#f8f8f6', padding: '1.25rem', borderLeft: '4px solid #b5811a', marginTop: '1.5rem', borderRadius: 2 }}>
            <p style={{ margin: 0 }}>
              <strong>Join our growing employer community.</strong> Contact the Magnolia EDA
              to learn why businesses thrive in Magnolia, Mississippi.{' '}
              <a href="mailto:eda@cityofmagnolia.com">eda@cityofmagnolia.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

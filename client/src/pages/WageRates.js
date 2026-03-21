import React from 'react';
import { PageBanner } from '../components/PageBanner';

const WAGES = [
  { occ: 'Production Workers (All)', hourly: '$14.85', annual: '$30,890' },
  { occ: 'Team Assemblers', hourly: '$13.60', annual: '$28,280' },
  { occ: 'Machinists', hourly: '$19.40', annual: '$40,350' },
  { occ: 'Industrial Machinery Mechanics', hourly: '$21.10', annual: '$43,880' },
  { occ: 'Welders / Cutters / Solderers', hourly: '$16.75', annual: '$34,840' },
  { occ: 'Truck Drivers (Heavy)', hourly: '$21.00', annual: '$43,680' },
  { occ: 'Warehouse / Shipping', hourly: '$14.20', annual: '$29,540' },
  { occ: 'Food Processing Workers', hourly: '$13.75', annual: '$28,600' },
  { occ: 'Office / Administrative Support', hourly: '$15.90', annual: '$33,070' },
  { occ: 'Registered Nurses', hourly: '$29.50', annual: '$61,360' },
];

export default function WageRates() {
  return (
    <div>
      <PageBanner title="Wage Rates" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Competitive Labor Costs</h3>
          <div className="text-wrapper">
            <p>
              Magnolia and Pike County offer businesses a competitive wage environment. Labor costs
              in southwest Mississippi are among the most competitive in the Southeast, providing
              businesses with a meaningful cost advantage compared to many other locations.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h4>Occupational Wages — Pike County / Southwest Mississippi Region</h4>

          <table className="data-table">
            <thead>
              <tr>
                <th>Occupation</th>
                <th>Median Hourly Wage</th>
                <th>Median Annual Wage</th>
              </tr>
            </thead>
            <tbody>
              {WAGES.map((row, i) => (
                <tr key={i}>
                  <td>{row.occ}</td>
                  <td>{row.hourly}</td>
                  <td>{row.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '.8rem', color: '#777' }}>
            Source: Bureau of Labor Statistics / Mississippi Department of Employment Security (estimates)
          </p>

          <div style={{ background: '#f8f8f6', padding: '1.25rem', borderLeft: '4px solid #2d6a4f', marginTop: '1.5rem', borderRadius: 2 }}>
            <p style={{ margin: 0, fontSize: '.95rem' }}>
              <strong>Note:</strong> Mississippi's minimum wage follows the federal minimum wage.
              For detailed occupational wage data specific to your industry and workforce needs,
              contact the Magnolia EDA at <a href="mailto:eda@cityofmagnolia.com">eda@cityofmagnolia.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

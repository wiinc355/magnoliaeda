import React from 'react';
import { PageBanner } from '../components/PageBanner';

const DEMO_ITEMS = [
  {
    icon: '👤',
    title: 'Age Distribution (60-Mile Radius)',
    items: ['20–64: 56.2%', 'Median Age: 35.4 years'],
  },
  {
    icon: '🏘️',
    title: 'Population Insights',
    items: ['Total Population (60-Mile Radius): ~350,000', 'Labor Force (60-Mile Radius): ~140,000'],
  },
  {
    icon: '🏠',
    title: 'Household Information (60-Mile Radius)',
    items: ['Total Households: ~128,000', 'Median Household Income: ~$44,800'],
  },
  {
    icon: '💼',
    title: 'Labor Force Status',
    items: ['Employed: ~131,000', 'Manufacturing Workforce: ~18,500'],
  },
];

const LABOR_DATA = [
  { label: 'State of Mississippi', value: '1,334,000' },
  { label: 'Pike County', value: '19,200' },
  { label: 'City of Magnolia', value: '2,400' },
  { label: 'Magnolia 30-Mile Drive', value: '52,000' },
  { label: 'Magnolia 45-Mile Drive', value: '95,000' },
  { label: 'Magnolia 60-Mile Drive', value: '140,000' },
];

export default function Demographics() {
  return (
    <div>
      <PageBanner title="Demographics" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Our People Make the Difference</h3>
          <div className="text-wrapper">
            <p>
              <strong>Magnolia, Mississippi</strong> is the perfect choice for businesses looking
              to expand, relocate, or make a fresh start. With a growing regional population and
              an available workforce, Magnolia offers the talent your business needs to succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ul className="icon-list">
            {DEMO_ITEMS.map((item, i) => (
              <li key={i}>
                <div className="fact-icon-circle" style={{ width: 56, height: 56, fontSize: '1.25rem' }}>
                  {item.icon}
                </div>
                <div>
                  <h5>{item.title}</h5>
                  <ul>
                    {item.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <p style={{ fontSize: '.8rem', color: '#777' }}>Source: US Census / Esri demographic data (estimates)</p>

          <h4>Labor Force</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Labor Force</th>
              </tr>
            </thead>
            <tbody>
              {LABOR_DATA.map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '.8rem', color: '#777' }}>Source: US Census / Esri demographic data (estimates)</p>
        </div>
      </section>
    </div>
  );
}

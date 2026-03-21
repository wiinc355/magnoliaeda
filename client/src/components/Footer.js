import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <section className="contact-section">
        <div className="container">
          <div className="inner">
            <div>
              <p className="logo">Magnolia Economic Development Authority</p>
              <ul>
                <li>115 West Bay Street</li>
                <li>Magnolia, MS 39652</li>
              </ul>
            </div>
            <ul>
              <li>(601) 876-5678</li>
              <li><a href="mailto:eda@cityofmagnolia.com">eda@cityofmagnolia.com</a></li>
            </ul>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/overview" style={{ color: '#ccc', fontSize: '.85rem' }}>Overview</Link></li>
              <li><Link to="/sites-buildings" style={{ color: '#ccc', fontSize: '.85rem' }}>Sites &amp; Buildings</Link></li>
              <li><Link to="/incentives-taxes" style={{ color: '#ccc', fontSize: '.85rem' }}>Incentives &amp; Taxes</Link></li>
              <li><Link to="/demographics" style={{ color: '#ccc', fontSize: '.85rem' }}>Demographics</Link></li>
              <li><Link to="/living-here" style={{ color: '#ccc', fontSize: '.85rem' }}>Living Here</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <p className="copyright">
            &copy; {new Date().getFullYear()} City of Magnolia <strong>Economic Development Authority.</strong><br />
            All Rights Reserved.
          </p>
          <p className="powered">
            Powered by: <a href="//365degreetotalmarketing.com" target="_blank" rel="noreferrer">365 Degree Total Marketing</a>
          </p>
        </div>
      </footer>
    </>
  );
}

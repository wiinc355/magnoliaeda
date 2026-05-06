import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function Maps() {
  return (
    <div>
      <PageBanner title="Maps" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Magnolia's Location</h3>
          <p>
            Magnolia, Mississippi is located in Pike County in the southwest corner of Mississippi,
            at the intersection of US Highway 51 and US Highway 98. I-55 is accessible 10 miles
            north via McComb.
          </p>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <h4>Regional Location Map</h4>
          <div className="map-placeholder">
            📍 Interactive map coming soon<br />
            <span style={{ fontSize: '.85rem', marginTop: '.5rem', display: 'block' }}>
              Magnolia, MS • Pike County • Lat: 31.1298° N, Lon: 90.4579° W
            </span>
          </div>

          <h4>Google Maps</h4>
          <div style={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd' }}>
            <iframe
              title="Magnolia MS Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27208.08!2d-90.4579!3d31.1298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86278c56a95a5b1b%3A0x4e31a83c83c83c00!2sMagnolia%2C%20MS%2039652!5e0!3m2!1sen!2sus!4v1000000000000"
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <h4 style={{ marginTop: '2rem' }}>Key Distances from Magnolia</h4>
          <table className="data-table">
            <thead>
              <tr><th>Destination</th><th>Distance</th><th>Drive Time (approx.)</th></tr>
            </thead>
            <tbody>
              {[
                ['McComb, MS', '10 miles', '12 min'],
                ['Brookhaven, MS', '28 miles', '30 min'],
                ['Natchez, MS', '65 miles', '1 hr 10 min'],
                ['Jackson, MS', '90 miles', '1 hr 20 min'],
                ['Baton Rouge, LA', '110 miles', '1 hr 30 min'],
                ['New Orleans, LA', '120 miles', '2 hrs'],
                ['Port of New Orleans', '125 miles', '2 hrs 10 min'],
                ['Mobile, AL', '165 miles', '2 hrs 30 min'],
                ['Memphis, TN', '215 miles', '3 hrs 15 min'],
              ].map(([dest, dist, time], i) => (
                <tr key={i}><td>{dest}</td><td>{dist}</td><td>{time}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

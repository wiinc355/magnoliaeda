import React from 'react';
import { HomeBanner } from '../components/PageBanner';

const FACTS = [
  { icon: '👥', label: 'Regional Population', note: '(within 60 miles)', number: '~350,000' },
  { icon: '🎓', label: null, note: null, number: null, custom: <>
    <strong className="number">1</strong> Community College<br />
    <strong className="number">1</strong> Technical Center<br />&nbsp;
  </> },
  { icon: '💼', label: 'Regional Labor Force', note: '(within 60 miles)', number: '~140,000' },
  { icon: '🛣️', label: 'Located on', note: null, number: null, custom: <>
    <strong className="number">2</strong><br />US Highways<br />&nbsp;
  </> },
  { icon: '🎂', label: 'Median Age', note: null, number: '35.4' },
  { icon: '🚢', label: 'Proximity to', note: null, number: null, custom: <>
    <strong className="number">2</strong> Gulf Ports &amp;<br />
    <strong className="number">2</strong> Regional Airports<br />&nbsp;
  </> },
];

export default function Home() {
  return (
    <div>
      <HomeBanner />

      {/* Slogan */}
      <section className="slogan-section">
        <div className="container">
          <h5 className="slogan">
            <strong>Growth is flourishing</strong> in the City of Magnolia, Mississippi!
          </h5>
        </div>
      </section>

      {/* Overview */}
      <section className="content-section overview-section">
        <div className="container">
          <div className="row">
            <div className="col-image">
              <div style={{
                background: 'linear-gradient(135deg, #e8f4ee 0%, #d0e9d8 100%)',
                height: 280,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2d6a4f',
                fontSize: '1rem',
                fontStyle: 'italic',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>🌸</div>
                  <strong>Magnolia, Mississippi</strong><br />
                  Pike County
                </div>
              </div>
            </div>
            <div className="col-text">
              <p className="welcome-text">
                Businesses and industry are finding a multitude of reasons to choose Magnolia, Mississippi
                to expand or relocate.
              </p>
              <p className="info-text">
                Located in the heart of Southwest Mississippi on US Highway 51 and US Highway 98,
                Magnolia is the county seat of Pike County. With convenient access to I-55 and
                proximity to the Port of New Orleans and the Port of Mobile, Magnolia is an ideal
                location for manufacturers, distributors, and growing businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero image placeholder */}
      <section className="content-section top-image-section" style={{ padding: '0 0 3rem' }}>
        <div className="container">
          <div style={{
            width: '100%',
            height: 380,
            background: 'linear-gradient(135deg, #1b4d38, #2d6a4f, #3a7d5c)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.2rem',
            fontStyle: 'italic'
          }}>
            Downtown Magnolia, Mississippi
          </div>
        </div>
      </section>

      {/* Fast Facts */}
      <section className="content-section facts-section">
        <div className="container">
          <h3 className="section-title">
            <em>Fast</em> <span className="text-secondary">Facts</span>
          </h3>

          <div className="fact-list">
            {FACTS.map((f, i) => (
              <div key={i} className="fact-item">
                <div className="fact-icon-circle">{f.icon}</div>
                <div className="text">
                  {f.custom ? f.custom : (
                    <>
                      {f.label}<br />
                      {f.note && <span className="note">{f.note}</span>}
                      {f.note && <br />}
                      <strong className="number">{f.number}</strong><br />&nbsp;
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="fact-source">Source: US Census / Esri demographic data</p>
        </div>
      </section>

      {/* Community section */}
      <section className="content-section bottom-image-section">
        <div className="container">
          <div style={{
            width: '100%',
            height: 360,
            background: 'linear-gradient(135deg, #b5811a, #d4a03a)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.2rem',
            fontStyle: 'italic'
          }}>
            Magnolia Community &amp; Businesses
          </div>
        </div>
      </section>

      {/* Residents */}
      <section className="content-section residents-section">
        <div className="container">
          <div className="row">
            <div className="col-text">
              <p>
                In addition to the benefits to business and industry, Magnolia has excellent healthcare
                at Southwest Mississippi Regional Medical Center, quality education providers, shopping,
                dining and entertainment options. All this is wrapped up in a friendly small-town
                atmosphere that invites residents to connect and get to know their neighbors.
              </p>
            </div>
            <div className="col-image">
              <div style={{
                background: '#e8f4ee',
                height: 280,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2d6a4f',
                fontSize: '1rem',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                Magnolia Community Life
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="content-section action-section">
        <div className="container">
          <p>
            Easy access, abundant developable land, and a welcoming community make Magnolia
            desirable for businesses and families to put down roots. Explore Magnolia's advantages
            on this site and then call us.
          </p>
          <p className="large">Let's grow together!</p>
        </div>
      </section>
    </div>
  );
}

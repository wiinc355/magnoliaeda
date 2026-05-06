import React from 'react';

/* ---- Placeholder banner used across all pages ---- */
export function PageBanner({ title, bg = '#2d6a4f', height = 280 }) {
  return (
    <header className="content-header" style={{ maxHeight: height, background: bg, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{
        width: '100%',
        background: 'linear-gradient(transparent, rgba(0,0,0,.6))',
        padding: '2rem 0 1.25rem'
      }}>
        <div className="container">
          <h2 className="content-title">{title}</h2>
        </div>
      </div>
    </header>
  );
}

/* ---- Colored hero used on home page ---- */
export function HomeBanner() {
  return (
    <header className="content-header" style={{ height: 420, background: 'linear-gradient(135deg, #1b4d38 0%, #2d6a4f 50%, #3a7d5c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 'none' }}>
      <div style={{ textAlign: 'center', color: '#fff', padding: '2rem' }}>
        <h1 style={{ fontFamily: "'Bree Serif', serif", fontSize: '3rem', fontWeight: 400, margin: '0 0 .75rem' }}>
          City of Magnolia
        </h1>
        <p style={{ fontSize: '1.3rem', margin: 0, opacity: .9 }}>
          Economic Development Authority
        </p>
        <p style={{ fontSize: '1rem', marginTop: '.75rem', opacity: .75, fontStyle: 'italic' }}>
          Magnolia, Mississippi — Pike County
        </p>
      </div>
    </header>
  );
}

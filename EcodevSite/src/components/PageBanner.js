import React from 'react';
import ecoDevHero from '../assets/COM-EcoDev.jpg';

/* ---- Placeholder banner used across all pages ---- */
export function PageBanner({ title, bg = '#2d6a4f', height = 280, image }) {
  const headerStyle = image
    ? {
      height,
      width: 'min(calc(100% - (var(--magnolia-gutter) * 2)), var(--magnolia-container-max))',
      margin: '0 auto',
      backgroundImage: `linear-gradient(rgba(11, 32, 53, 0.08), rgba(11, 32, 53, 0.08)), url(${image})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      borderRadius: 4,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end'
    }
    : {
      height,
      width: 'min(calc(100% - (var(--magnolia-gutter) * 2)), var(--magnolia-container-max))',
      margin: '0 auto',
      background: bg,
      borderRadius: 4,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end'
    };

	const titleOverlay = image
		? 'linear-gradient(transparent, rgba(0,0,0,.28))'
		: 'linear-gradient(transparent, rgba(0,0,0,.6))';

  return (
      <header className="content-header" style={headerStyle}>
      <div style={{
        width: '100%',
	        background: titleOverlay,
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
    <header
      className="content-header"
      style={{
        height: 420,
        width: 'min(calc(100% - (var(--magnolia-gutter) * 2)), var(--magnolia-container-max))',
        margin: '0 auto',
        backgroundImage: `linear-gradient(rgba(11, 32, 53, 0.35), rgba(11, 32, 53, 0.35)), url(${ecoDevHero})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 'none'
      }}
    >
      <div style={{ textAlign: 'center', color: '#fff', padding: '2rem', textShadow: '0 2px 10px rgba(0, 0, 0, 0.45)' }}>
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

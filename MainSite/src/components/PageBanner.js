import React, { useState, useEffect } from 'react';

import hero1 from '../image/hero-1.png';
import hero2 from '../image/hero-2.png';
import hero3 from '../image/hero-3.png';
import hero4 from '../image/hero-4.png';
import hero5 from '../image/hero-5.png';
import hero6 from '../image/hero-6.png';
import hero7 from '../image/hero-7.png';

const HERO_IMAGES = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];

/* ---- Rotating slideshow banner (reusable) ---- */
function RotatingBanner({ title, images, height = 280 }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1 % images.length);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % images.length);
        setNext(c => (c + 2) % images.length);
        setFading(false);
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <header className="content-header" style={{ position: 'relative', height, maxHeight: 'none', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${images[current]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${images[next]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fading ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,57,101,0.52)' }} />
      <div style={{ position: 'relative', width: '100%', padding: '2rem 0 1.25rem', zIndex: 1 }}>
        <div className="container">
          <h2 className="content-title" style={{ display: 'inline-block', background: 'rgba(8,57,101,0.82)', padding: '0.3rem 1.1rem', borderRadius: 4 }}>{title}</h2>
        </div>
      </div>
    </header>
  );
}

/* ---- Placeholder banner used across all pages ---- */
export function PageBanner({ title, bg = '#0a4f90', height = 280, images }) {
  if (images && images.length > 0) {
    return <RotatingBanner title={title} images={images} height={height} />;
  }
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

/* ---- Rotating image hero used on home page ---- */
export function HomeBanner() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % HERO_IMAGES.length);
        setNext(c => (c + 2) % HERO_IMAGES.length);
        setFading(false);
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="content-header" style={{ position: 'relative', height: 420, maxHeight: 'none', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Current image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${HERO_IMAGES[current]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
      }} />
      {/* Next image (preloaded underneath) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${HERO_IMAGES[next]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fading ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
      }} />
      {/* Dark overlay for text legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,57,101,0.52)' }} />
      {/* Text content */}
      <div style={{ position: 'relative', textAlign: 'center', color: '#fff', padding: '2rem', zIndex: 1 }}>
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

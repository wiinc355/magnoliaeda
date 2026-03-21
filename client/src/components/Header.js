import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ApiHealthBadge from './ApiHealthBadge';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="container">
          <div className="inner">
            <div className="logo-wrapper">
              <h1 className="site-logo" style={{ margin: 0 }}>
                <Link to="/">Magnolia EDA</Link>
              </h1>
            </div>

            <nav className={`site-menu${menuOpen ? ' open' : ''}`}>
              <ul className="menu">
                <li>
                  <a href="#about">About <span>Us</span></a>
                  <ul className="submenu">
                    <li><Link to="/overview" onClick={() => setMenuOpen(false)}>Overview</Link></li>
                    <li><Link to="/staff-board" onClick={() => setMenuOpen(false)}>Staff &amp; Board</Link></li>
                  </ul>
                </li>
                <li>
                  <a href="#site-sel">SITE <span>SELECTION</span></a>
                  <ul className="submenu">
                    <li><Link to="/sites-buildings" onClick={() => setMenuOpen(false)}>Sites &amp; Buildings</Link></li>
                    <li><Link to="/incentives-taxes" onClick={() => setMenuOpen(false)}>Incentives &amp; Taxes</Link></li>
                    <li><Link to="/infrastructure" onClick={() => setMenuOpen(false)}>Infrastructure</Link></li>
                    <li><Link to="/workforce-training" onClick={() => setMenuOpen(false)}>Workforce Training</Link></li>
                  </ul>
                </li>
                <li>
                  <a href="#labor">LABOR <span>FORCE</span></a>
                  <ul className="submenu">
                    <li><Link to="/demographics" onClick={() => setMenuOpen(false)}>Demographics</Link></li>
                    <li><Link to="/wage-rates" onClick={() => setMenuOpen(false)}>Wage Rates</Link></li>
                    <li><Link to="/commuting-patterns" onClick={() => setMenuOpen(false)}>Commuting Patterns</Link></li>
                  </ul>
                </li>
                <li>
                  <a href="#biz">BUSINESS &amp; <span>INDUSTRY</span></a>
                  <ul className="submenu">
                    <li><Link to="/target-industries" onClick={() => setMenuOpen(false)}>Target Industries</Link></li>
                    <li><Link to="/major-employers" onClick={() => setMenuOpen(false)}>Major Employers</Link></li>
                  </ul>
                </li>
                <li>
                  <a href="#trans">TRANS-<span>PORTATION</span></a>
                  <ul className="submenu">
                    <li><Link to="/trans-modal" onClick={() => setMenuOpen(false)}>Trans-Modal</Link></li>
                    <li><Link to="/maps" onClick={() => setMenuOpen(false)}>Maps</Link></li>
                  </ul>
                </li>
                <li>
                  <NavLink to="/living-here" onClick={() => setMenuOpen(false)}>LIVING <span>HERE</span></NavLink>
                </li>
                <li>
                  <NavLink to="/contacts" onClick={() => setMenuOpen(false)}>CONTACTS</NavLink>
                </li>
                <li>
                  <NavLink to="/projects" onClick={() => setMenuOpen(false)}>PROJECTS</NavLink>
                </li>
              </ul>
            </nav>

            <div className="button-wrapper" style={{ display: 'flex', gap: '.5rem', marginLeft: 'auto' }}>
              <button type="button" className="builder-btn">Report Builder</button>
              <button type="button" className="menu-toggler" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? 'Close' : 'Menu'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="inner">
            <div className="contact">
              <p className="address">City Hall • 115 West Bay Street • Magnolia, MS 39652</p>
              <p className="phone"><a href="tel:+16018765678">(601) 876-5678</a></p>
            </div>
            <div className="header-tools">
              <div className="buttons">
                <a href="https://www.cityofmagnolia.com" target="_blank" rel="noreferrer">Visit Magnolia</a>
                <a href="https://www.pikecountychamber.com" target="_blank" rel="noreferrer">Chamber of Commerce</a>
              </div>
              <ApiHealthBadge />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

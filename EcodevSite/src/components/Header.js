import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MunicipalIcon from './MunicipalIcon';
import SiteMarquee from './SiteMarquee';
import logoImage from '../assets/COM-Logo2026A.png';

export default function Header() {
  const headerRef = useRef(null);
  const desktopTriggerRefs = useRef({});
  const mobileMenuButtonRef = useRef(null);
  const lastDesktopTriggerRef = useRef(null);

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState(null);
  const [language, setLanguage] = useState('en');
  const location = useLocation();

  const howDoISections = [
    {
      key: 'site-selection',
      label: 'Site Selection',
      to: '/sites-buildings',
      description: 'Explore available locations, development incentives, infrastructure resources, and workforce support.',
      links: [
        { to: '/sites-buildings', label: 'Sites & Buildings' },
        { to: '/incentives-taxes', label: 'Incentives & Taxes' },
        { to: '/infrastructure', label: 'Infrastructure' },
        { to: '/workforce-training', label: 'Workforce Training' }
      ]
    },
    {
      key: 'labor-force',
      label: 'Labor Force',
      to: '/demographics',
      description: 'Review workforce characteristics, wages, population information, and regional commuting data.',
      links: [
        { to: '/demographics', label: 'Demographics' },
        { to: '/wage-rates', label: 'Wage Rates' },
        { to: '/commuting-patterns', label: 'Commuting Patterns' }
      ]
    },
    {
      key: 'business-industry',
      label: 'Business & Industry',
      to: '/target-industries',
      description: 'Learn about Magnolia\'s priority industries, established employers, and business environment.',
      links: [
        { to: '/target-industries', label: 'Target Industries' },
        { to: '/major-employers', label: 'Major Employers' }
      ]
    },
    {
      key: 'transportation',
      label: 'Transportation',
      to: '/trans-modal',
      description: 'View transportation connections, logistics resources, and regional maps.',
      links: [
        { to: '/trans-modal', label: 'Trans-Modal' },
        { to: '/maps', label: 'Maps' }
      ]
    },
    {
      key: 'living-here',
      label: 'Living Here',
      to: '/living-here',
      description: 'Discover community life, amenities, and quality of life in Magnolia.',
      links: [
        { to: '/living-here', label: 'Living Here' }
      ]
    },
    {
      key: 'projects',
      label: 'Projects',
      to: '/projects',
      description: 'Explore current and completed economic development projects.',
      links: [
        { to: '/projects', label: 'Projects' }
      ]
    }
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setMobileSectionOpen(null);
  }, [location.pathname]);

  function closeMenus() {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setMobileSectionOpen(null);
  }

  function closeDesktopMegaMenu() {
    setActiveMegaMenu(null);
  }

  function isPathMatch(pathname, path) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  function isNavItemActive(item, pathname) {
    if (isPathMatch(pathname, item.to)) return true;
    if (item.megaSections) {
      return item.megaSections.some((section) => (
        isPathMatch(pathname, section.to) || section.links.some((link) => isPathMatch(pathname, link.to))
      ));
    }
    if (!item.submenu) return false;
    return item.submenu.some((link) => isPathMatch(pathname, link.to));
  }

  function toggleDesktopMegaMenu(itemKey) {
    setActiveMegaMenu((prev) => (prev === itemKey ? null : itemKey));
    lastDesktopTriggerRef.current = desktopTriggerRefs.current[itemKey] || null;
  }

  function handleDesktopMegaToggle(event, itemKey) {
    event.preventDefault();
    event.stopPropagation();
    toggleDesktopMegaMenu(itemKey);
  }

  function toggleMobileSection(itemKey) {
    setMobileSectionOpen((prev) => (prev === itemKey ? null : itemKey));
  }

  const mainNavItems = [
    {
      key: 'home',
      label: 'Home',
      to: '/'
    },
    {
      key: 'about-us',
      label: 'About Us',
      to: '/overview',
      submenu: [
        { to: '/overview', label: 'Overview' },
        { to: '/staff-board', label: 'Staff & Board' }
      ]
    },
    {
      key: 'contact-us',
      label: 'Contact Us',
      to: '/contacts'
    },
    {
      key: 'how-do-i',
      label: 'HOW DO I ...',
      to: '/overview',
      megaSections: howDoISections
    }
  ];

  const howDoIItem = mainNavItems.find((item) => item.key === 'how-do-i');
  const desktopMegaItems = howDoIItem?.megaSections || [];

  useEffect(() => {
    const hasOpenOverlay = !!activeMegaMenu || mobileMenuOpen;
    if (!hasOpenOverlay) return undefined;

    function handleDocumentClick(event) {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(event.target)) {
        closeMenus();
      }
    }

    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      const hadDesktopMenu = !!activeMegaMenu;
      const hadMobileMenu = mobileMenuOpen || !!mobileSectionOpen;

      closeMenus();

      if (hadDesktopMenu && lastDesktopTriggerRef.current) {
        lastDesktopTriggerRef.current.focus();
      } else if (hadMobileMenu && mobileMenuButtonRef.current) {
        mobileMenuButtonRef.current.focus();
      }
    }

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMegaMenu, mobileMenuOpen, mobileSectionOpen]);

  return (
    <header ref={headerRef} className="site-header eda-header">
      <div className="municipal-utility-bar">
        <div className="container municipal-utility-inner">
          <div className="municipal-utility-contact">
            <span className="utility-meta-item">
              <span className="utility-icon" aria-hidden="true"><MunicipalIcon name="map-pin" /></span>
              115 W Bay St, Magnolia, MS 39652
            </span>
            <span className="utility-meta-item">
              <span className="utility-icon" aria-hidden="true"><MunicipalIcon name="phone" /></span>
              <a href="tel:+16018765678">(601) 876-5678</a>
            </span>
          </div>

          <div className="municipal-utility-actions" aria-label="Social media and language tools">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="utility-social-link" aria-label="Facebook"><MunicipalIcon name="facebook" /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="utility-social-link" aria-label="Instagram"><MunicipalIcon name="instagram" /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="utility-social-link" aria-label="YouTube"><MunicipalIcon name="youtube" /></a>
            <label className="utility-language-label" htmlFor="eda-utility-language">Language</label>
            <select
              id="eda-utility-language"
              className="utility-language-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
      </div>

      <div className="header-top">
        <div className="container">
          <div className="inner eda-main-inner">
            <div className="logo-wrapper eda-logo-wrapper">
              <h1 className="site-logo eda-site-logo" style={{ margin: 0 }}>
                <Link to="/" className="eda-brand-link" onClick={closeMenus}>
                  <img src={logoImage} alt="City of Magnolia logo" className="eda-logo-image" />
                  <span className="eda-title-wrap">
                    <span className="eda-title-main">Welcome to the City of Magnolia</span>
                    <span className="eda-title-sub">Economic and Development Committee</span>
                  </span>
                </Link>
              </h1>
            </div>

            <nav
              id="eda-main-navigation"
              className={`site-menu eda-site-menu${mobileMenuOpen ? ' open' : ''}`}
              aria-label="Main navigation"
            >
              <ul className="menu eda-menu-list eda-desktop-menu-list">
                {mainNavItems.map((item) => (
                  <li
                    key={item.key}
                    className={`${item.megaSections || item.submenu ? 'has-submenu' : ''}${item.megaSections ? ' has-mega-control' : ''}${isNavItemActive(item, location.pathname) ? ' is-active' : ''}`}
                  >
                    {item.megaSections ? (
                      <>
                        <button
                          type="button"
                          className={`eda-nav-trigger${isNavItemActive(item, location.pathname) ? ' is-active' : ''}`}
                          aria-expanded={activeMegaMenu === item.key}
                          aria-controls="eda-mega-menu-panel"
                          onClick={(event) => handleDesktopMegaToggle(event, item.key)}
                        >
                          {item.label}
                        </button>
                        <button
                          ref={(el) => { desktopTriggerRefs.current[item.key] = el; }}
                          type="button"
                          className={`eda-nav-dropdown-toggle${activeMegaMenu === item.key ? ' is-open' : ''}`}
                          aria-expanded={activeMegaMenu === item.key}
                          aria-controls="eda-mega-menu-panel"
                          aria-label={`Open ${item.label} menu`}
                          onClick={(event) => handleDesktopMegaToggle(event, item.key)}
                        >
                          <span aria-hidden="true">▼</span>
                        </button>
                      </>
                    ) : item.submenu ? (
                      <>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) => (isActive || isNavItemActive(item, location.pathname) ? 'is-active' : '')}
                          onClick={closeDesktopMegaMenu}
                        >
                          {item.label}
                        </NavLink>
                        <ul className="submenu" aria-label={`${item.label} submenu`}>
                          {item.submenu.map((link) => (
                            <li key={`${item.key}-${link.to}`}>
                              <NavLink to={link.to} onClick={closeMenus}>{link.label}</NavLink>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => (isActive ? 'is-active' : '')}
                        onClick={closeDesktopMegaMenu}
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>

              <ul className="menu eda-mobile-menu-list" aria-label="Mobile main navigation">
                {mainNavItems.map((item) => (
                  <li key={`${item.key}-mobile`} className={item.megaSections || item.submenu ? 'has-submenu' : ''}>
                    {item.megaSections ? (
                      <div className="eda-mobile-item-block">
                        <div className="eda-mobile-item-row">
                          <NavLink
                            to={item.to}
                            className={({ isActive }) => `eda-mobile-main-link${isActive || isNavItemActive(item, location.pathname) ? ' is-active' : ''}`}
                            onClick={closeMenus}
                          >
                            {item.label}
                          </NavLink>
                          <button
                            type="button"
                            className={`eda-mobile-section-toggle${mobileSectionOpen === item.key ? ' is-open' : ''}`}
                            aria-expanded={mobileSectionOpen === item.key}
                            aria-controls={`eda-mobile-section-${item.key}`}
                            aria-label={`Toggle ${item.label} submenu`}
                            onClick={() => toggleMobileSection(item.key)}
                          >
                            <span aria-hidden="true">{mobileSectionOpen === item.key ? '−' : '+'}</span>
                          </button>
                        </div>
                        <ul id={`eda-mobile-section-${item.key}`} className={`eda-mobile-submenu${mobileSectionOpen === item.key ? ' is-open' : ''}`}>
                          {item.megaSections.map((section) => (
                            <li key={`${item.key}-mobile-${section.key}`} className="eda-mobile-mega-section">
                              <NavLink to={section.to} className={({ isActive }) => `eda-mobile-mega-section-heading${isActive ? ' is-active' : ''}`} onClick={closeMenus}>{section.label}</NavLink>
                              <p className="eda-mobile-mega-section-description">{section.description}</p>
                              <ul className="eda-mobile-mega-section-links">
                                {section.links.map((link) => (
                                  <li key={`${item.key}-mobile-${section.key}-${link.to}`}>
                                    <NavLink to={link.to} className={({ isActive }) => (isActive ? 'is-active' : '')} onClick={closeMenus}>{link.label}</NavLink>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : item.submenu ? (
                      <div className="eda-mobile-item-block">
                        <div className="eda-mobile-item-row">
                          <NavLink
                            to={item.to}
                            className={({ isActive }) => `eda-mobile-main-link${isActive || isNavItemActive(item, location.pathname) ? ' is-active' : ''}`}
                            onClick={closeMenus}
                          >
                            {item.label}
                          </NavLink>
                          <button
                            type="button"
                            className={`eda-mobile-section-toggle${mobileSectionOpen === item.key ? ' is-open' : ''}`}
                            aria-expanded={mobileSectionOpen === item.key}
                            aria-controls={`eda-mobile-section-${item.key}`}
                            aria-label={`Toggle ${item.label} submenu`}
                            onClick={() => toggleMobileSection(item.key)}
                          >
                            <span aria-hidden="true">{mobileSectionOpen === item.key ? '−' : '+'}</span>
                          </button>
                        </div>
                        <ul id={`eda-mobile-section-${item.key}`} className={`eda-mobile-submenu${mobileSectionOpen === item.key ? ' is-open' : ''}`}>
                          {item.submenu.map((link) => (
                            <li key={`${item.key}-mobile-${link.to}`}>
                              <NavLink to={link.to} className={({ isActive }) => (isActive ? 'is-active' : '')} onClick={closeMenus}>{link.label}</NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <NavLink to={item.to} className={({ isActive }) => `eda-mobile-main-link${isActive ? ' is-active' : ''}`} onClick={closeMenus}>
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div id="eda-mega-menu-panel" className={`eda-mega-menu${activeMegaMenu ? ' is-open' : ''}`} aria-hidden={!activeMegaMenu}>
              <div className="eda-mega-menu-inner">
                <div className="eda-mega-menu-grid">
                  {desktopMegaItems.map((item) => (
                    <section
                      key={`${item.key}-mega-col`}
                      className={`eda-mega-menu-column${activeMegaMenu === item.key ? ' is-focused' : ''}`}
                      aria-label={item.label}
                    >
                      <h3 className="eda-mega-menu-heading">
                        <NavLink to={item.to} onClick={closeMenus}>{item.label}</NavLink>
                      </h3>
                      <p className="eda-mega-menu-description">{item.description}</p>
                      <ul className="eda-mega-menu-links">
                        {item.links.map((link) => (
                          <li key={`${item.key}-${link.to}`}>
                            <NavLink to={link.to} className="eda-mega-menu-link" onClick={closeMenus}>{link.label}</NavLink>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </div>

            <div className="button-wrapper eda-button-wrapper">
              <button
                ref={mobileMenuButtonRef}
                type="button"
                className="menu-toggler eda-menu-toggler"
                aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
                aria-controls="eda-main-navigation"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? 'Close' : 'Menu'}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="inner">
            <div className="header-tools" />
          </div>
        </div>
      </div>

      <SiteMarquee />
    </header>
  );
}

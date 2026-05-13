import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MunicipalIcon from './MunicipalIcon';
import SiteMarquee from './SiteMarquee';
import logoImage from '../image/COM-Logo2026A.png';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, isSpanish } = useLanguage();
  const { isAuthenticated, hasAnyRole, loginRedirect, logout } = useAuth();

  const text = isSpanish ? {
    utilityAria: 'Herramientas de redes sociales e idioma',
    language: 'Idioma',
    welcome: 'Bienvenido a Magnolia',
    cityTitle: 'Ciudad de Magnolia, Mississippi',
    openMenu: 'Abrir menu de navegacion',
    closeMenu: 'Cerrar menu de navegacion',
    mainNav: 'Navegacion principal',
    home: 'Inicio',
    government: 'Gobierno',
    mayorCouncil: 'Alcalde y Concejo',
    cityAdmin: 'Administrador de la Ciudad',
    boards: 'Juntas y Comites',
    departments: 'Departamentos',
    departmentDirectory: 'Directorio de Departamentos',
    fire: 'Bomberos',
    police: 'Policia',
    parks: 'Parques y Recreacion',
    publicWorks: 'Obras Publicas',
    finance: 'Finanzas',
    community: 'Comunidad',
    calendar: 'Calendario',
    agendas: 'Agendas y Actas',
    solidWaste: 'Residuos Solidos y Reciclaje',
    howDoI: 'Como Hago',
    payBill: 'Pago en Linea',
    permits: 'Permisos y Licencias',
    enotify: 'Notificaciones',
    contactUs: 'Contactenos',
    search: 'Buscar',
    signIn: 'Iniciar sesion',
    signOut: 'Cerrar sesion'
  } : {
    utilityAria: 'Social media and language tools',
    language: 'Language',
    welcome: 'Welcome to Magnolia',
    cityTitle: 'City of Magnolia, Mississippi',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    mainNav: 'Main navigation',
    home: 'Home',
    government: 'Government',
    mayorCouncil: 'Mayor & Council',
    cityAdmin: 'City Administrator',
    boards: 'Boards & Committees',
    departments: 'Departments',
    departmentDirectory: 'Department Directory',
    fire: 'Fire',
    police: 'Police',
    parks: 'Parks & Recreation',
    publicWorks: 'Public Works',
    finance: 'Finance',
    community: 'Community',
    calendar: 'Calendar',
    agendas: 'Agendas & Minutes',
    solidWaste: 'Solid Waste & Recycling',
    howDoI: 'How Do I',
    payBill: 'Online Bill Pay',
    permits: 'Permits & Licenses',
    enotify: 'E-Notifications',
    contactUs: 'Contact Us',
    search: 'Search',
    signIn: 'Sign In',
    signOut: 'Sign Out'
  };

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="municipal-header">
      <div className="municipal-utility-bar">
        <div className="container municipal-utility-inner">
          <p className="municipal-utility-contact">
            <span className="utility-meta-item">
              <span className="utility-icon" aria-hidden="true"><MunicipalIcon name="map-pin" /></span>
              115 W Bay St, Magnolia, MS 39652
            </span>
            <span className="utility-meta-item">
              <span className="utility-icon" aria-hidden="true"><MunicipalIcon name="phone" /></span>
              <a href="tel:+16018765678">(601) 876-5678</a>
            </span>
          </p>

          <div className="municipal-utility-actions" aria-label={text.utilityAria}>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="utility-social-link" aria-label="Facebook"><MunicipalIcon name="facebook" /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="utility-social-link" aria-label="Instagram"><MunicipalIcon name="instagram" /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="utility-social-link" aria-label="YouTube"><MunicipalIcon name="youtube" /></a>
            <label className="utility-language-label" htmlFor="utility-language">{text.language}</label>
            <select id="utility-language" className="utility-language-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
      </div>

      <div className="municipal-main-bar">
        <div className="container municipal-main-inner">
          <div className="municipal-brand">
            <Link to="/" className="municipal-brand-link" onClick={closeMobileMenu}>
              <span className="municipal-brand-badge" aria-hidden="true">
                <img src={logoImage} alt="" className="municipal-brand-logo" />
              </span>
              <span className="municipal-brand-text">
                <small>{text.welcome}</small>
                <strong>{text.cityTitle}</strong>
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="municipal-mobile-toggle"
            aria-label={mobileMenuOpen ? text.closeMenu : text.openMenu}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <nav className={`municipal-nav${mobileMenuOpen ? ' is-open' : ''}`} aria-label={text.mainNav}>
            <ul className="municipal-nav-list">
              <li><NavLink to="/" onClick={closeMobileMenu}>{text.home}</NavLink></li>
              <li className="has-submenu">
                <NavLink to="/government/mayor-council" onClick={closeMobileMenu}>{text.government}</NavLink>
                <ul className="submenu">
                  <li><Link to="/government/mayor-council" onClick={closeMobileMenu}>{text.mayorCouncil}</Link></li>
                  <li><Link to="/government/town-manager" onClick={closeMobileMenu}>{text.cityAdmin}</Link></li>
                  <li><Link to="/government/boards-committees" onClick={closeMobileMenu}>{text.boards}</Link></li>
                </ul>
              </li>
              <li className="has-submenu">
                <NavLink to="/departments" onClick={closeMobileMenu}>{text.departments}</NavLink>
                <ul className="submenu">
                  <li><Link to="/departments" onClick={closeMobileMenu}>{text.departmentDirectory}</Link></li>
                  <li><Link to="/department/fire" onClick={closeMobileMenu}>{text.fire}</Link></li>
                  <li><Link to="/department/police" onClick={closeMobileMenu}>{text.police}</Link></li>
                  <li><Link to="/department/parks-recreation" onClick={closeMobileMenu}>{text.parks}</Link></li>
                  <li><Link to="/department/public-works" onClick={closeMobileMenu}>{text.publicWorks}</Link></li>
                  <li><Link to="/department/finance" onClick={closeMobileMenu}>{text.finance}</Link></li>
                </ul>
              </li>
              <li className="has-submenu">
                <NavLink to="/calendar" onClick={closeMobileMenu}>{text.community}</NavLink>
                <ul className="submenu">
                  <li><Link to="/calendar" onClick={closeMobileMenu}>{text.calendar}</Link></li>
                  <li><Link to="/resource/agendas-minutes" onClick={closeMobileMenu}>{text.agendas}</Link></li>
                  <li><Link to="/resource/solid-waste-recycling" onClick={closeMobileMenu}>{text.solidWaste}</Link></li>
                  <li><Link to="/department/parks-recreation" onClick={closeMobileMenu}>{text.parks}</Link></li>
                </ul>
              </li>
              <li className="has-submenu">
                <NavLink to="/how-do-i/contact-us" onClick={closeMobileMenu}>{text.howDoI}</NavLink>
                <ul className="submenu">
                  <li><Link to="/resource/online-bill-pay" onClick={closeMobileMenu}>{text.payBill}</Link></li>
                  <li><Link to="/resource/permits-licenses" onClick={closeMobileMenu}>{text.permits}</Link></li>
                  <li><Link to="/alerts/enotify" onClick={closeMobileMenu}>{text.enotify}</Link></li>
                  <li><Link to="/how-do-i/contact-us" onClick={closeMobileMenu}>{text.contactUs}</Link></li>
                </ul>
              </li>
            </ul>
          </nav>

          <div className="municipal-auth-actions">
            <Link to="/search" className="municipal-search-btn" onClick={closeMobileMenu}>
              <MunicipalIcon name="search" />
              {text.search}
            </Link>

            {isAuthenticated ? (
              <button type="button" className="municipal-login-btn" onClick={logout}>
                {text.signOut}
              </button>
            ) : (
              <button type="button" className="municipal-login-btn" onClick={loginRedirect}>
                {text.signIn}
              </button>
            )}
          </div>
        </div>
      </div>

      <SiteMarquee />

      {isAuthenticated ? (
        <nav className="municipal-portal-bar" aria-label="Portal navigation">
          <div className="container municipal-portal-bar-inner">
            {hasAnyRole(['Admin', 'Staff']) ? (
              <NavLink to="/dashboard" className={({ isActive }) => `municipal-portal-link${isActive ? ' is-active' : ''}`} onClick={closeMobileMenu}>Dashboard</NavLink>
            ) : null}
            {hasAnyRole(['Admin', 'Staff']) ? (
              <NavLink to="/staff-portal" className={({ isActive }) => `municipal-portal-link${isActive ? ' is-active' : ''}`} onClick={closeMobileMenu}>Staff Portal</NavLink>
            ) : null}
            {hasAnyRole(['Admin', 'Department User']) ? (
              <NavLink to="/department-portal" className={({ isActive }) => `municipal-portal-link${isActive ? ' is-active' : ''}`} onClick={closeMobileMenu}>Department Portal</NavLink>
            ) : null}
            {hasAnyRole(['Admin']) ? (
              <NavLink to="/admin-portal" className={({ isActive }) => `municipal-portal-link${isActive ? ' is-active' : ''}`} onClick={closeMobileMenu}>Admin Portal</NavLink>
            ) : null}
            <NavLink to="/profile" className={({ isActive }) => `municipal-portal-link municipal-portal-link-profile${isActive ? ' is-active' : ''}`} onClick={closeMobileMenu}>My Profile</NavLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { CITYHALL_EMAIL, SITE_HOST, WEBSITE_URL } from '../config/siteConfig';
import MunicipalIcon from './MunicipalIcon';
import logoImage from '../image/COM-Logo2026A.png';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { isSpanish } = useLanguage();
  const { pathname } = useLocation();

  const text = isSpanish ? {
    welcome: 'Bienvenido a',
    title: 'Ciudad de Magnolia',
    copy: 'Una comunidad acogedora de Mississippi enfocada en servicio, transparencia y calidad de vida local.',
    visit: 'Visite',
    popular: 'Servicios Populares',
    home: 'Inicio',
    mayorCouncil: 'Alcalde y Concejo',
    cityAdmin: 'Administrador de la Ciudad',
    boards: 'Juntas y Comites',
    departmentDirectory: 'Directorio de Departamentos',
    fire: 'Bomberos',
    police: 'Policia',
    parks: 'Parques y Recreacion',
    permits: 'Permisos y Licencias',
    enotify: 'Notificaciones',
    payBill: 'Pagar una Factura',
    agendas: 'Agendas y Actas',
    publicWorks: 'Obras Publicas',
    contactUs: 'Contactenos',
    officeHours: 'Horario de Oficina',
    monThu: 'Lunes - Jueves: 8:00 AM - 5:00 PM',
    fri: 'Viernes: 8:00 AM - 12:00 PM',
    rights: 'Gobierno Municipal de la Ciudad de Magnolia. Todos los derechos reservados.'
  } : {
    welcome: 'Welcome To',
    title: 'City of Magnolia',
    copy: 'A welcoming Mississippi community focused on service, transparency, and hometown quality of life.',
    visit: 'Visit',
    popular: 'Popular Services',
    home: 'Home',
    mayorCouncil: 'Mayor & Council',
    cityAdmin: 'City Administrator',
    boards: 'Boards & Committees',
    departmentDirectory: 'Department Directory',
    fire: 'Fire',
    police: 'Police',
    parks: 'Parks & Recreation',
    permits: 'Permits & Licenses',
    enotify: 'E-Notifications',
    payBill: 'Pay a Bill',
    agendas: 'Agendas & Minutes',
    publicWorks: 'Public Works',
    contactUs: 'Contact Us',
    officeHours: 'Office Hours',
    monThu: 'Monday - Thursday: 8:00 AM - 5:00 PM',
    fri: 'Friday: 8:00 AM - 12:00 PM',
    rights: 'City of Magnolia Municipal Government. All rights reserved.'
  };

  const servicesBySection = {
    government: [
      { label: text.mayorCouncil, to: '/government/mayor-council' },
      { label: text.cityAdmin, to: '/government/town-manager' },
      { label: text.boards, to: '/government/boards-committees' },
      { label: text.contactUs, to: '/how-do-i/contact-us' }
    ],
    departments: [
      { label: text.departmentDirectory, to: '/departments' },
      { label: text.publicWorks, to: '/department/public-works' },
      { label: text.fire, to: '/department/fire' },
      { label: text.police, to: '/department/police' },
      { label: text.parks, to: '/department/parks-recreation' }
    ],
    community: [
      { label: text.agendas, to: '/resource/agendas-minutes' },
      { label: text.parks, to: '/department/parks-recreation' },
      { label: text.publicWorks, to: '/department/public-works' },
      { label: text.contactUs, to: '/how-do-i/contact-us' }
    ],
    howDoI: [
      { label: text.payBill, to: '/resource/online-bill-pay' },
      { label: text.permits, to: '/resource/permits-licenses' },
      { label: text.enotify, to: '/alerts/enotify' },
      { label: text.contactUs, to: '/how-do-i/contact-us' }
    ],
    default: [
      { label: text.home, to: '/' },
      { label: text.payBill, to: '/resource/online-bill-pay' },
      { label: text.agendas, to: '/resource/agendas-minutes' },
      { label: text.publicWorks, to: '/department/public-works' },
      { label: text.contactUs, to: '/how-do-i/contact-us' },
      { label: text.enotify, to: '/alerts/enotify' }
    ]
  };

  function getSectionKey(path) {
    if (path.startsWith('/government')) return 'government';
    if (path.startsWith('/departments') || path.startsWith('/department')) return 'departments';
    if (path.startsWith('/calendar') || path.startsWith('/resource/agendas-minutes') || path.startsWith('/resource/solid-waste-recycling')) return 'community';
    if (path.startsWith('/how-do-i') || path.startsWith('/resource/online-bill-pay') || path.startsWith('/resource/permits-licenses') || path.startsWith('/alerts/enotify')) return 'howDoI';
    return 'default';
  }

  const sectionKey = getSectionKey(pathname || '/');
  const popularServices = (servicesBySection[sectionKey] || servicesBySection.default).slice(0, 6);

  return (
    <footer className="municipal-footer">
      <div className="container municipal-footer-grid">
        <div>
          <div className="municipal-footer-brand">
            <img src={logoImage} alt="City of Magnolia logo" className="municipal-footer-logo" />
            <div className="municipal-footer-brand-text">
              <p className="municipal-footer-welcome">{text.welcome}</p>
              <p className="municipal-footer-title">{text.title}</p>
              <p className="municipal-footer-copy">{text.copy}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="municipal-footer-heading">{text.visit}</p>
          <p className="municipal-footer-line"><MunicipalIcon name="map-pin" /> 115 W Bay Street, Magnolia, MS 39652</p>
          <p className="municipal-footer-line"><MunicipalIcon name="phone" /> (601) 876-5678</p>
          <p className="municipal-footer-line"><MunicipalIcon name="globe" /> <a href={WEBSITE_URL} target="_blank" rel="noreferrer">{SITE_HOST}</a></p>
          <p className="municipal-footer-line"><MunicipalIcon name="file" /> <a href={`mailto:${CITYHALL_EMAIL}`}>{CITYHALL_EMAIL}</a></p>
        </div>

        <div>
          <p className="municipal-footer-heading">{text.popular}</p>
          <ul className="municipal-footer-links">
            {popularServices.map((service) => (
              <li key={service.to}><Link to={service.to}>{service.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="municipal-footer-heading">{text.officeHours}</p>
          <p className="municipal-footer-copy">{text.monThu}</p>
          <p className="municipal-footer-copy">{text.fri}</p>
        </div>
      </div>
      <div className="municipal-footer-bottom">
        <div className="container">
          <p className="municipal-footer-bottom-left">&copy; 2026 City of Magnolia All Rights Reserved.</p>
          <p className="municipal-footer-bottom-right">Powered by: <a href="http://wiinc.com/" target="_blank" rel="noreferrer">WIInc</a></p>
        </div>
      </div>
    </footer>
  );
}

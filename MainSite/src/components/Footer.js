import { Link } from 'react-router-dom';
import { CITYHALL_EMAIL, SITE_HOST, WEBSITE_URL } from '../config/siteConfig';
import MunicipalIcon from './MunicipalIcon';
import logoImage from '../image/COM-Logo2026A.png';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { isSpanish } = useLanguage();

  const text = isSpanish ? {
    welcome: 'Bienvenido a',
    title: 'Ciudad de Magnolia',
    copy: 'Una comunidad acogedora de Mississippi enfocada en servicio, transparencia y calidad de vida local.',
    visit: 'Visite',
    popular: 'Servicios Populares',
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
    payBill: 'Pay a Bill',
    agendas: 'Agendas & Minutes',
    publicWorks: 'Public Works',
    contactUs: 'Contact Us',
    officeHours: 'Office Hours',
    monThu: 'Monday - Thursday: 8:00 AM - 5:00 PM',
    fri: 'Friday: 8:00 AM - 12:00 PM',
    rights: 'City of Magnolia Municipal Government. All rights reserved.'
  };

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
            <li><Link to="/resource/online-bill-pay">{text.payBill}</Link></li>
            <li><Link to="/resource/agendas-minutes">{text.agendas}</Link></li>
            <li><Link to="/department/public-works">{text.publicWorks}</Link></li>
            <li><Link to="/how-do-i/contact-us">{text.contactUs}</Link></li>
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
          <p>&copy; {new Date().getFullYear()} {text.rights}</p>
        </div>
      </div>
    </footer>
  );
}

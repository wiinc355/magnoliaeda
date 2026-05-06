import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MunicipalIcon from '../components/MunicipalIcon';
import { useLanguage } from '../i18n/LanguageContext';
import heroImage1 from '../image/hero-1.png';
import heroImage2 from '../image/hero-2.png';
import heroImage3 from '../image/hero-3.png';
import heroImage4 from '../image/hero-4.png';
import heroImage5 from '../image/hero-5.png';
import heroImage6 from '../image/hero-6.png';
import heroImage7 from '../image/hero-7.png';

const heroImages = [
  heroImage1,
  heroImage2,
  heroImage3,
  heroImage4,
  heroImage5,
  heroImage6,
  heroImage7
];

export default function CityHome() {
  const { isSpanish } = useLanguage();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const text = isSpanish ? {
    kicker: 'Sirviendo a los residentes con orgullo',
    title: 'Ciudad de Magnolia, Mississippi',
    subtitle: 'El sitio municipal oficial de Magnolia para pagar facturas, acceder a documentos publicos, conectar con departamentos y mantenerse informado.',
    payBill: 'Pagar una Factura',
    contact: 'Contactar Ayuntamiento',
    announcementsTitle: 'Ultimos Anuncios',
    registerAlerts: 'Registrarse para Alertas',
    quickLinksTitle: 'Enlaces Rapidos',
    quickLinksSubtitle: 'Los servicios mas usados por residentes estan organizados aqui para acceso rapido.',
    departmentsTitle: 'Departamentos',
    departmentsSubtitle: 'Explore los departamentos principales de la ciudad y los servicios mas usados en cada oficina.',
    quickLinks: [
      { label: 'Pagar Factura de Agua', to: '/resource/online-bill-pay', icon: 'droplet' },
      { label: 'Formularios y Permisos', to: '/resource/permits-licenses', icon: 'file' },
      { label: 'Reuniones', to: '/resource/agendas-minutes', icon: 'calendar' },
      { label: 'Seguridad Publica', to: '/department/police', icon: 'shield' }
    ],
    announcements: [
      'Sesion de trabajo del Concejo Municipal programada para el jueves a las 5:30 PM.',
      'Mantenimiento del portal de facturacion de agua de Magnolia programado para el viernes por la manana.',
      'La semana de limpieza de primavera comienza el lunes con actualizaciones de recoleccion en acera.',
      'La noche comunitaria de seguridad de Policia y Bomberos regresa a la plaza del centro.'
    ],
    departmentCards: [
      {
        title: 'Ayuntamiento',
        icon: 'building',
        links: [
          { label: 'Alcalde y Concejo', to: '/government/mayor-council' },
          { label: 'Administrador de la Ciudad', to: '/government/town-manager' },
          { label: 'Juntas y Comites', to: '/government/boards-committees' }
        ]
      },
      {
        title: 'Servicios Publicos',
        icon: 'droplet',
        links: [
          { label: 'Pagar Factura de Agua', to: '/resource/online-bill-pay' },
          { label: 'Residuos Solidos y Reciclaje', to: '/resource/solid-waste-recycling' },
          { label: 'Actualizaciones de Servicio', to: '/alerts/enotify' }
        ]
      },
      {
        title: 'Departamento de Policia',
        icon: 'shield',
        links: [
          { label: 'Servicios de Seguridad Publica', to: '/department/police' },
          { label: 'Alertas Comunitarias', to: '/alerts/enotify' },
          { label: 'Contactar al Departamento', to: '/how-do-i/contact-us' }
        ]
      },
      {
        title: 'Obras Publicas',
        icon: 'wrench',
        links: [
          { label: 'Calles y Drenaje', to: '/department/public-works' },
          { label: 'Permisos y Licencias', to: '/resource/permits-licenses' },
          { label: 'Documentos de Reuniones', to: '/resource/agendas-minutes' }
        ]
      }
    ],
    featureCards: [
      {
        title: 'Gobierno',
        icon: 'users',
        description: 'Encuentre funcionarios electos, liderazgo de la ciudad, informacion de reuniones y recursos de politicas.',
        to: '/government/mayor-council'
      },
      {
        title: 'Comunidad',
        icon: 'megaphone',
        description: 'Explore programas, avisos publicos, eventos y actualizaciones enfocadas en residentes.',
        to: '/calendar'
      },
      {
        title: 'Centro de Documentos',
        icon: 'file',
        description: 'Consulte agendas, actas, formularios, permisos y documentos publicos descargables.',
        to: '/resource/agendas-minutes'
      }
    ]
  } : {
    kicker: 'Serving Residents with Pride',
    title: 'City of Magnolia, Mississippi',
    subtitle: "Magnolia's official municipal site for paying bills, accessing public documents, connecting with departments, and staying informed.",
    payBill: 'Pay a Bill',
    contact: 'Contact City Hall',
    announcementsTitle: 'Latest Announcements',
    registerAlerts: 'Register for Alerts',
    quickLinksTitle: 'Quick Links',
    quickLinksSubtitle: 'Popular resident services are organized here for fast access.',
    departmentsTitle: 'Departments',
    departmentsSubtitle: 'Browse major city departments and the most-used services inside each office.',
    quickLinks: [
      { label: 'Pay Water Bill', to: '/resource/online-bill-pay', icon: 'droplet' },
      { label: 'Forms & Permits', to: '/resource/permits-licenses', icon: 'file' },
      { label: 'Meetings', to: '/resource/agendas-minutes', icon: 'calendar' },
      { label: 'Public Safety', to: '/department/police', icon: 'shield' }
    ],
    announcements: [
      'City Council work session scheduled for Thursday at 5:30 PM.',
      'Magnolia water billing portal maintenance planned for Friday morning.',
      'Spring cleanup week begins Monday with curbside collection updates.',
      'Police and Fire community safety night returns to downtown square.'
    ],
    departmentCards: [
      {
        title: 'City Hall',
        icon: 'building',
        links: [
          { label: 'Mayor & Council', to: '/government/mayor-council' },
          { label: 'City Administrator', to: '/government/town-manager' },
          { label: 'Boards & Committees', to: '/government/boards-committees' }
        ]
      },
      {
        title: 'Utilities',
        icon: 'droplet',
        links: [
          { label: 'Pay Water Bill', to: '/resource/online-bill-pay' },
          { label: 'Solid Waste & Recycling', to: '/resource/solid-waste-recycling' },
          { label: 'Service Updates', to: '/alerts/enotify' }
        ]
      },
      {
        title: 'Police Department',
        icon: 'shield',
        links: [
          { label: 'Public Safety Services', to: '/department/police' },
          { label: 'Community Alerts', to: '/alerts/enotify' },
          { label: 'Contact the Department', to: '/how-do-i/contact-us' }
        ]
      },
      {
        title: 'Public Works',
        icon: 'wrench',
        links: [
          { label: 'Street & Drainage', to: '/department/public-works' },
          { label: 'Permits & Licenses', to: '/resource/permits-licenses' },
          { label: 'Meeting Documents', to: '/resource/agendas-minutes' }
        ]
      }
    ],
    featureCards: [
      {
        title: 'Government',
        icon: 'users',
        description: 'Find elected officials, city leadership, meeting information, and policy resources.',
        to: '/government/mayor-council'
      },
      {
        title: 'Community',
        icon: 'megaphone',
        description: 'Explore programs, public notices, events, and resident-focused city updates.',
        to: '/calendar'
      },
      {
        title: 'Document Center',
        icon: 'file',
        description: 'Browse agendas, minutes, forms, permits, and downloadable public documents.',
        to: '/resource/agendas-minutes'
      }
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="municipal-homepage">
      <section className="municipal-hero-section">
        <div className="municipal-hero-carousel" aria-hidden="true">
          {heroImages.map((image, index) => (
            <span
              key={image}
              className={`municipal-hero-slide${index === currentHeroImage ? ' is-active' : ''}`}
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
        </div>

        <div className="container municipal-hero-grid">
          <div className="municipal-hero-copy">
            <p className="municipal-kicker">{text.kicker}</p>
            <h1>{text.title}</h1>
            <p className="municipal-hero-subtitle">{text.subtitle}</p>
            <div className="municipal-hero-actions">
              <Link to="/resource/online-bill-pay" className="municipal-primary-btn">{text.payBill}</Link>
              <Link to="/how-do-i/contact-us" className="municipal-primary-btn">{text.contact}</Link>
            </div>
          </div>

          <aside className="municipal-announcements-card">
            <div className="municipal-section-heading">
              <MunicipalIcon name="megaphone" />
              <h2>{text.announcementsTitle}</h2>
            </div>
            <ul className="municipal-announcement-list">
              {text.announcements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link to="/alerts/enotify" className="municipal-primary-btn">{text.registerAlerts}</Link>
          </aside>
        </div>
      </section>

      <section className="municipal-section municipal-quick-section">
        <div className="container">
          <div className="municipal-section-heading block-heading">
            <h2>{text.quickLinksTitle}</h2>
            <p>{text.quickLinksSubtitle}</p>
          </div>
          <div className="municipal-quick-grid">
            {text.quickLinks.map((item) => (
              <Link key={item.label} to={item.to} className="municipal-quick-card">
                <span className="municipal-card-icon"><MunicipalIcon name={item.icon} /></span>
                <strong>{item.label}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="municipal-section municipal-departments-section">
        <div className="container">
          <div className="municipal-section-heading block-heading light-heading">
            <h2>{text.departmentsTitle}</h2>
            <p>{text.departmentsSubtitle}</p>
          </div>
          <div className="municipal-department-grid">
            {text.departmentCards.map((card) => (
              <article key={card.title} className="municipal-department-card">
                <div className="municipal-section-heading department-heading">
                  <MunicipalIcon name={card.icon} />
                  <h3>{card.title}</h3>
                </div>
                <ul>
                  {card.links.map((link) => (
                    <li key={link.label}><Link to={link.to}>{link.label}</Link></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="municipal-section municipal-feature-section">
        <div className="container">
          <div className="municipal-feature-grid">
            {text.featureCards.map((card) => (
              <Link key={card.title} to={card.to} className="municipal-feature-card">
                <span className="municipal-card-icon"><MunicipalIcon name={card.icon} /></span>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

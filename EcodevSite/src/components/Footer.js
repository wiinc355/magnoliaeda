import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/COM-Logo2026A.png';
import MunicipalIcon from './MunicipalIcon';

export default function Footer() {
  const { pathname } = useLocation();

  const servicesBySection = {
    about: [
      { label: 'Overview', to: '/overview' },
      { label: 'Staff & Board', to: '/staff-board' },
      { label: 'Contacts', to: '/contacts' },
      { label: 'Projects', to: '/projects' }
    ],
    siteSelection: [
      { label: 'Sites & Buildings', to: '/sites-buildings' },
      { label: 'Incentives & Taxes', to: '/incentives-taxes' },
      { label: 'Infrastructure', to: '/infrastructure' },
      { label: 'Workforce Training', to: '/workforce-training' },
      { label: 'Projects', to: '/projects' }
    ],
    laborForce: [
      { label: 'Demographics', to: '/demographics' },
      { label: 'Wage Rates', to: '/wage-rates' },
      { label: 'Commuting Patterns', to: '/commuting-patterns' },
      { label: 'Workforce Training', to: '/workforce-training' }
    ],
    businessIndustry: [
      { label: 'Target Industries', to: '/target-industries' },
      { label: 'Major Employers', to: '/major-employers' },
      { label: 'Projects', to: '/projects' },
      { label: 'Sites & Buildings', to: '/sites-buildings' }
    ],
    transportation: [
      { label: 'Trans-Modal', to: '/trans-modal' },
      { label: 'Maps', to: '/maps' },
      { label: 'Infrastructure', to: '/infrastructure' },
      { label: 'Sites & Buildings', to: '/sites-buildings' }
    ],
    livingHere: [
      { label: 'Living Here', to: '/living-here' },
      { label: 'Contacts', to: '/contacts' },
      { label: 'Demographics', to: '/demographics' },
      { label: 'Projects', to: '/projects' }
    ],
    contacts: [
      { label: 'Contacts', to: '/contacts' },
      { label: 'Overview', to: '/overview' },
      { label: 'Staff & Board', to: '/staff-board' },
      { label: 'Projects', to: '/projects' }
    ],
    projects: [
      { label: 'Projects', to: '/projects' },
      { label: 'Sites & Buildings', to: '/sites-buildings' },
      { label: 'Target Industries', to: '/target-industries' },
      { label: 'Incentives & Taxes', to: '/incentives-taxes' }
    ],
    default: [
      { label: 'Overview', to: '/overview' },
      { label: 'Sites & Buildings', to: '/sites-buildings' },
      { label: 'Demographics', to: '/demographics' },
      { label: 'Target Industries', to: '/target-industries' },
      { label: 'Contacts', to: '/contacts' },
      { label: 'Projects', to: '/projects' }
    ]
  };

  function getSectionKey(path) {
    if (path.startsWith('/overview') || path.startsWith('/staff-board')) return 'about';
    if (path.startsWith('/sites-buildings') || path.startsWith('/incentives-taxes') || path.startsWith('/infrastructure') || path.startsWith('/workforce-training')) return 'siteSelection';
    if (path.startsWith('/demographics') || path.startsWith('/wage-rates') || path.startsWith('/commuting-patterns')) return 'laborForce';
    if (path.startsWith('/target-industries') || path.startsWith('/major-employers')) return 'businessIndustry';
    if (path.startsWith('/trans-modal') || path.startsWith('/maps')) return 'transportation';
    if (path.startsWith('/living-here')) return 'livingHere';
    if (path.startsWith('/contacts')) return 'contacts';
    if (path.startsWith('/projects')) return 'projects';
    return 'default';
  }

  const sectionKey = getSectionKey(pathname || '/');
  const popularServices = (servicesBySection[sectionKey] || servicesBySection.default).slice(0, 6);

  return (
    <>
      <section className="contact-section">
        <div className="container">
          <div className="inner eda-footer-columns">
            <div className="eda-footer-column eda-footer-column-primary">
              <div className="eda-footer-brand" aria-label="City of Magnolia contact information">
                <img
                  className="eda-footer-logo"
                  src={logoImage}
                  alt="City of Magnolia logo"
                />
                <div className="eda-footer-brand-info">
                  <p className="eda-footer-kicker eda-footer-kicker-welcome">Welcome To</p>
                  <p className="eda-footer-city">City of Magnolia</p>
                  <p className="eda-footer-summary">A welcoming Mississippi community focused on service, transparency, and hometown quality of life.</p>
                </div>
              </div>
            </div>

            <div className="eda-footer-column eda-footer-column-visit">
              <h3 className="eda-footer-section-title">Visit</h3>
              <p className="eda-footer-detail">
                <span className="eda-footer-detail-icon" aria-hidden="true"><MunicipalIcon name="map-pin" /></span>
                115 W Bay Street, Magnolia, MS 39652
              </p>
              <p className="eda-footer-detail">
                <span className="eda-footer-detail-icon" aria-hidden="true"><MunicipalIcon name="phone" /></span>
                (601) 876-5678
              </p>
              <p className="eda-footer-detail">
                <span className="eda-footer-detail-icon" aria-hidden="true"><MunicipalIcon name="globe" /></span>
                <a href="https://www.cityofmagnolia-ms.gov/" target="_blank" rel="noreferrer">www.cityofmagnolia-ms.gov</a>
              </p>
              <p className="eda-footer-detail">
                <span className="eda-footer-detail-icon" aria-hidden="true"><MunicipalIcon name="file" /></span>
                <a href="mailto:cityhall@cityofmagnolia-ms.gov">cityhall@cityofmagnolia-ms.gov</a>
              </p>
            </div>

            <div className="eda-footer-column eda-footer-column-secondary">
              <h3 className="eda-footer-section-title">Popular Services</h3>
              <ul className="eda-footer-services-list">
                {popularServices.map((service) => (
                  <li key={service.to}>
                    <Link to={service.to}>{service.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="eda-footer-column eda-footer-column-hours">
              <h3 className="eda-footer-section-title">Office Hours</h3>
              <p className="eda-footer-hours-line">Monday - Thursday: 8:00 AM - 5:00 PM</p>
              <p className="eda-footer-hours-line">Friday: 8:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <p className="copyright">
            &copy; 2026 City of Magnolia All Rights Reserved.
          </p>
          <p className="powered">
            Powered by: <a href="//wiinc.com" target="_blank" rel="noreferrer">WIInc</a>
          </p>
        </div>
      </footer>
    </>
  );
}

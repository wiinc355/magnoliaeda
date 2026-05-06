import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getCityContent } from './cityContent';

const ROUTE_MAP = {
  mayorCouncil: '/government/mayor-council',
  townManager: '/government/town-manager',
  boardsCommittees: '/government/boards-committees',
  fire: '/department/fire',
  police: '/department/police',
  parksRecreation: '/department/parks-recreation',
  publicWorks: '/department/public-works',
  finance: '/department/finance',
  onlineBillPay: '/resource/online-bill-pay',
  agendasMinutes: '/resource/agendas-minutes',
  solidWaste: '/resource/solid-waste-recycling',
  permitsLicenses: '/resource/permits-licenses',
  calendar: '/calendar',
  enotify: '/alerts/enotify',
  contactUs: '/how-do-i/contact-us'
};

const EXTRA_RESULTS_EN = [
  {
    key: 'departmentsDirectory',
    title: 'Departments',
    to: '/departments',
    category: 'Departments',
    content:
      'Browse Magnolia city departments, leadership offices, finance, fire, parks and recreation, police, public works, boards and committees, and resident services.'
  },
  {
    key: 'policeStaff',
    title: 'Police Department Staff Contacts',
    to: '/department/police',
    category: 'Departments',
    content:
      'Police Department mission statement, staff contacts, communications center, emergency and non-emergency contact information, and Magnolia public safety services.'
  },
  {
    key: 'departmentFinance',
    title: 'Finance Department',
    to: '/department/finance',
    category: 'Departments',
    content:
      'Finance Department, budgeting, accounting, public reporting, revenue collection, procurement, audits, and Magnolia financial operations.'
  },
  {
    key: 'departmentFire',
    title: 'Fire Department',
    to: '/department/fire',
    category: 'Departments',
    content:
      'Fire Department, emergency response, rescue support, fire prevention, inspections, and Magnolia fire safety services.'
  },
  {
    key: 'departmentParks',
    title: 'Parks & Recreation Department',
    to: '/department/parks-recreation',
    category: 'Departments',
    content:
      'Parks and Recreation, city facilities, programs, reservations, recreation spaces, community fields, and active living in Magnolia.'
  },
  {
    key: 'departmentPublicWorks',
    title: 'Public Works Department',
    to: '/department/public-works',
    category: 'Departments',
    content:
      'Public Works, streets, drainage, water, sewer, fleet maintenance, right-of-way upkeep, and service requests in Magnolia.'
  },
  {
    key: 'departmentBoards',
    title: 'Boards & Committees',
    to: '/government/boards-committees',
    category: 'Departments',
    content:
      'Boards and committees, planning and zoning, historic preservation, parks advisory, public safety, and volunteer opportunities.'
  },
  {
    key: 'departmentResources',
    title: 'Department Resources',
    to: '/departments',
    category: 'Resources',
    content:
      'Human resources, emergency services, solid waste and recycling, permits and licenses, contact city hall, and resident service resources.'
  },
  {
    key: 'policeRelatedPages',
    title: 'Police Department Related Pages',
    to: '/department/police',
    category: 'Departments',
    content:
      'Behavioral Health Liaisons, Domestic Violence, Forms, History, Report and Records Request, Sex Offenders, Staff Directory, and Visiting City of Magnolia FAQs.'
  },
  {
    key: 'policeContact',
    title: 'Contact the Police Department',
    to: '/department/police',
    category: 'Departments',
    content:
      '115 W Bay St Magnolia MS 39652, non-emergency phone 601-876-5678, emergency 911, communications center, and police contact information.'
  }
];

const EXTRA_RESULTS_ES = [
  {
    key: 'departmentsDirectory',
    title: 'Departamentos',
    to: '/departments',
    category: 'Departamentos',
    content:
      'Explore departamentos de Magnolia, oficinas de liderazgo, finanzas, bomberos, parques y recreacion, policia, obras publicas, juntas y comites y servicios para residentes.'
  },
  {
    key: 'policeStaff',
    title: 'Contactos del Departamento de Policia',
    to: '/department/police',
    category: 'Departamentos',
    content:
      'Mision del Departamento de Policia, contactos del personal, centro de comunicaciones, informacion de emergencia y servicios de seguridad publica de Magnolia.'
  },
  {
    key: 'departmentFinance',
    title: 'Departamento de Finanzas',
    to: '/department/finance',
    category: 'Departamentos',
    content:
      'Departamento de finanzas, presupuesto, contabilidad, reportes publicos, ingresos, compras, auditorias y operaciones financieras de Magnolia.'
  },
  {
    key: 'departmentFire',
    title: 'Departamento de Bomberos',
    to: '/department/fire',
    category: 'Departamentos',
    content:
      'Departamento de bomberos, respuesta de emergencia, rescate, prevencion de incendios, inspecciones y servicios de seguridad contra incendios en Magnolia.'
  },
  {
    key: 'departmentParks',
    title: 'Departamento de Parques y Recreacion',
    to: '/department/parks-recreation',
    category: 'Departamentos',
    content:
      'Parques y recreacion, instalaciones municipales, programas, reservas, espacios recreativos, canchas y vida activa en Magnolia.'
  },
  {
    key: 'departmentPublicWorks',
    title: 'Departamento de Obras Publicas',
    to: '/department/public-works',
    category: 'Departamentos',
    content:
      'Obras publicas, calles, drenaje, agua, alcantarillado, mantenimiento de flota, derecho de paso y solicitudes de servicio en Magnolia.'
  },
  {
    key: 'departmentBoards',
    title: 'Juntas y Comites',
    to: '/government/boards-committees',
    category: 'Departamentos',
    content:
      'Juntas y comites, planificacion y zonificacion, preservacion historica, consejo de parques, seguridad publica y oportunidades de voluntariado.'
  },
  {
    key: 'departmentResources',
    title: 'Recursos de Departamentos',
    to: '/departments',
    category: 'Recursos',
    content:
      'Recursos humanos, servicios de emergencia, residuos solidos y reciclaje, permisos y licencias, contactar ayuntamiento y recursos para residentes.'
  },
  {
    key: 'policeRelatedPages',
    title: 'Paginas Relacionadas de la Policia',
    to: '/department/police',
    category: 'Departamentos',
    content:
      'Enlaces de salud conductual, violencia domestica, formularios, historia, solicitud de reportes y registros, ofensores sexuales, directorio de personal y preguntas frecuentes de la ciudad de Magnolia.'
  },
  {
    key: 'policeContact',
    title: 'Contacto del Departamento de Policia',
    to: '/department/police',
    category: 'Departamentos',
    content:
      '115 W Bay St Magnolia MS 39652, telefono no urgente 601-876-5678, emergencia 911, centro de comunicaciones e informacion de contacto de la policia.'
  }
];

function normalizeText(value) {
  return value.toLowerCase();
}

function buildSnippet(content, query) {
  const plain = content.replace(/\s+/g, ' ').trim();
  if (!plain) return '';
  const normalizedContent = normalizeText(plain);
  const normalizedQuery = normalizeText(query);
  const queryIndex = normalizedContent.indexOf(normalizedQuery);

  if (queryIndex === -1) {
    return plain.slice(0, 180);
  }

  const start = Math.max(0, queryIndex - 70);
  const end = Math.min(plain.length, queryIndex + normalizedQuery.length + 110);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < plain.length ? '...' : '';
  return `${prefix}${plain.slice(start, end)}${suffix}`;
}

function highlightQuery(text, query) {
  if (!query.trim()) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${escapedQuery})`, 'ig');
  return text.split(pattern).map((part, index) => {
    const isMatch = part.toLowerCase() === query.toLowerCase();
    return isMatch ? <mark key={`${part}-${index}`}>{part}</mark> : part;
  });
}

function getSearchEntries(language) {
  const cityContent = getCityContent(language);
  const pageEntries = Object.entries(cityContent).map(([key, page]) => {
    const sectionText = page.sections
      .flatMap((section) => [
        section.heading,
        ...(section.paragraphs || []),
        ...(section.bullets || [])
      ])
      .join(' ');

    return {
      key,
      title: page.title,
      to: ROUTE_MAP[key],
      category: 'MainSite',
      content: `${page.intro} ${sectionText}`
    };
  });

  const extras = language === 'es' ? EXTRA_RESULTS_ES : EXTRA_RESULTS_EN;
  return [...pageEntries, ...extras];
}

export default function SearchPage() {
  const { isSpanish, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);

  const text = isSpanish ? {
    title: 'Buscar',
    subtitle: 'Busque paginas, servicios y recursos de la Ciudad de Magnolia.',
    countLabel: 'resultados',
    noResults: 'No se encontraron resultados para esta busqueda.',
    prompt: 'Ingrese una palabra clave para comenzar a buscar.',
    help: 'Pruebe terminos como policia, permisos, agua, agenda o email.',
    button: 'Buscar',
    about: 'Aproximadamente',
    seconds: 'segundos'
  } : {
    title: 'Search',
    subtitle: 'Search City of Magnolia pages, services, and resident resources.',
    countLabel: 'results',
    noResults: 'No results found for this search.',
    prompt: 'Enter a keyword to start searching.',
    help: 'Try terms like police, permits, water, agenda, or email.',
    button: 'Search',
    about: 'About',
    seconds: 'seconds'
  };

  const searchEntries = useMemo(() => getSearchEntries(language), [language]);

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  const results = useMemo(() => {
    const query = queryFromUrl.trim();
    if (!query) return [];

    const terms = normalizeText(query).split(/\s+/).filter(Boolean);

    return searchEntries
      .map((entry) => {
        const haystack = normalizeText(`${entry.title} ${entry.category} ${entry.content}`);
        const score = terms.reduce((total, term) => {
          let next = total;
          if (normalizeText(entry.title).includes(term)) next += 8;
          if (normalizeText(entry.category).includes(term)) next += 3;
          if (haystack.includes(term)) next += 2;
          return next;
        }, 0);

        if (score === 0) {
          return null;
        }

        return {
          ...entry,
          score,
          snippet: buildSnippet(entry.content, query)
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));
  }, [queryFromUrl, searchEntries]);

  function handleSubmit(event) {
    event.preventDefault();
    const nextQuery = searchQuery.trim();
    navigate(`/search${nextQuery ? `?q=${encodeURIComponent(nextQuery)}` : ''}`);
  }

  const resultTime = (0.18 + results.length * 0.03).toFixed(2);

  return (
    <section className="municipal-search-page">
      <div className="container municipal-search-wrap">
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem', fontSize: '14px', fontWeight: 600 }}>
          <Link to="/" style={{ color: '#c9a227', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem', color: '#888' }}>›</span>
          <span style={{ color: '#333' }}>Search</span>
        </nav>
        <div className="municipal-section-heading block-heading">
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>

        <form className="municipal-search-form" onSubmit={handleSubmit}>
          <input
            type="search"
            className="municipal-search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="What can we help you find today?"
            aria-label={text.title}
          />
          <button type="submit" className="municipal-search-submit">{text.button}</button>
        </form>

        {queryFromUrl.trim() ? (
          <div className="municipal-search-results">
            <p className="municipal-search-meta">
              {highlightQuery(`"${queryFromUrl}"`, queryFromUrl)} {text.about} {results.length} {text.countLabel} ({resultTime} {text.seconds})
            </p>

            {results.length > 0 ? (
              <div className="municipal-search-result-list">
                {results.map((result) => (
                  <article key={result.key} className="municipal-search-result-item">
                    <Link to={result.to} className="municipal-search-result-title">{result.title}</Link>
                    <p className="municipal-search-result-url">magnolia.ms.gov {result.to}</p>
                    <p className="municipal-search-result-snippet">
                      {highlightQuery(result.snippet, queryFromUrl)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="municipal-search-empty">
                <p>{text.noResults}</p>
                <p>{text.help}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="municipal-search-empty">
            <p>{text.prompt}</p>
            <p>{text.help}</p>
          </div>
        )}
      </div>
    </section>
  );
}
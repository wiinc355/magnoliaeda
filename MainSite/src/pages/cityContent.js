import { CITYHALL_EMAIL, SITE_HOST } from '../config/siteConfig';

const cityContentEn = {
  mayorCouncil: {
    title: 'Mayor & Council',
    intro:
      'The City of Magnolia is governed by a mayor-council form of government focused on responsive services, fiscal accountability, and long-range planning.',
    sections: [
      {
        heading: 'Meeting Information',
        paragraphs: [
          'Regular City Council meetings are held on the second and fourth Tuesday of each month at City Hall.',
          'Work sessions and special meetings are posted in advance on the city calendar and agendas portal.'
        ]
      },
      {
        heading: 'Responsibilities',
        bullets: [
          'Adopt and amend city ordinances',
          'Approve annual budgets and capital plans',
          'Set policy priorities for public safety and infrastructure',
          'Appoint members to boards and commissions'
        ]
      }
    ]
  },
  townManager: {
    title: 'City Administrator',
    intro:
      'The City Administrator oversees daily municipal operations and coordinates implementation of policies adopted by the Mayor and Council.',
    sections: [
      {
        heading: 'Office Functions',
        bullets: [
          'Department coordination and service delivery',
          'Budget preparation and performance reporting',
          'Personnel administration and policy compliance',
          'Intergovernmental coordination and grant support'
        ]
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Phone: (601) 876-5678',
          `Email: ${CITYHALL_EMAIL}`
        ]
      }
    ]
  },
  boardsCommittees: {
    title: 'Boards & Committees',
    intro:
      'Boards and committees help the city gather public input and provide recommendations on key programs and projects.',
    sections: [
      {
        heading: 'Current Boards',
        bullets: [
          'Planning and Zoning Board',
          'Historic Preservation Commission',
          'Parks and Recreation Advisory Board',
          'Public Safety Committee'
        ]
      },
      {
        heading: 'Volunteer Opportunities',
        paragraphs: [
          'Residents interested in serving may submit a board application through City Hall.'
        ]
      }
    ]
  },
  fire: {
    title: 'Fire Department',
    intro:
      'Magnolia Fire Department provides fire suppression, rescue support, and fire prevention education for residents and businesses.',
    sections: [
      {
        heading: 'Services',
        bullets: [
          'Emergency fire response',
          'Incident command support',
          'Public fire safety outreach',
          'Business and occupancy inspections'
        ]
      },
      {
        heading: 'Non-Emergency Contact',
        paragraphs: ['Call City Hall at (601) 876-5678 for administrative assistance.']
      }
    ]
  },
  police: {
    title: 'Police Department',
    intro:
      'Magnolia Police Department works in partnership with the community to promote safety, neighborhood trust, and professional public service.',
    sections: [
      {
        heading: 'Programs',
        bullets: [
          'Community patrol and neighborhood engagement',
          'Traffic enforcement and roadway safety',
          'Crime prevention outreach',
          'Business safety coordination'
        ]
      },
      {
        heading: 'Records & Requests',
        paragraphs: [
          'For records requests, incident copies, or non-emergency police matters, contact City Hall during business hours.'
        ]
      }
    ]
  },
  parksRecreation: {
    title: 'Parks & Recreation',
    intro:
      'The Parks and Recreation Department maintains city facilities and hosts programs that support active, healthy community life.',
    sections: [
      {
        heading: 'Facilities',
        bullets: [
          'Neighborhood parks',
          'Community fields and courts',
          'Walking and green spaces',
          'Seasonal recreation programming'
        ]
      },
      {
        heading: 'Reservations',
        paragraphs: ['Facility reservation requests may be submitted through City Hall.']
      }
    ]
  },
  publicWorks: {
    title: 'Public Works',
    intro:
      'Public Works manages critical infrastructure and maintenance services that keep Magnolia clean, safe, and operational.',
    sections: [
      {
        heading: 'Core Services',
        bullets: [
          'Street maintenance and drainage support',
          'Water and sewer system operations',
          'Fleet and equipment maintenance',
          'Right-of-way and signage upkeep'
        ]
      },
      {
        heading: 'Service Requests',
        paragraphs: [
          'Residents can report potholes, drainage issues, and public infrastructure concerns by contacting City Hall.'
        ]
      }
    ]
  },
  finance: {
    title: 'Finance Department',
    intro:
      'The Finance Department manages budgeting, procurement, accounting, and financial reporting for the city.',
    sections: [
      {
        heading: 'Financial Operations',
        bullets: [
          'Annual budget development',
          'Accounts payable and receivable',
          'Audit coordination and compliance',
          'Revenue collection and financial reporting'
        ]
      },
      {
        heading: 'Public Access',
        paragraphs: ['Budget summaries and key financial documents are made available to residents.']
      }
    ]
  },
  onlineBillPay: {
    title: 'Online Bill Pay',
    intro:
      'Magnolia offers convenient online payment options for eligible city services.',
    sections: [
      {
        heading: 'Available Payments',
        bullets: ['Utility billing', 'Permits and fees', 'Municipal court payments (when available)']
      },
      {
        heading: 'Need Help?',
        paragraphs: ['For payment issues or account questions, contact the Finance Department at City Hall.']
      }
    ]
  },
  agendasMinutes: {
    title: 'Agendas & Minutes',
    intro:
      'Review current and archived agendas and minutes for City Council and advisory meetings.',
    sections: [
      {
        heading: 'Document Access',
        bullets: [
          'City Council agendas',
          'City Council approved minutes',
          'Board and commission meeting packets',
          'Public hearing notices'
        ]
      },
      {
        heading: 'Transparency',
        paragraphs: [
          'The City of Magnolia is committed to accessible, transparent decision-making and public records.'
        ]
      }
    ]
  },
  solidWaste: {
    title: 'Solid Waste & Recycling',
    intro:
      'Find collection schedules, acceptable materials, and disposal guidelines for residents and businesses.',
    sections: [
      {
        heading: 'Collection Topics',
        bullets: [
          'Household trash collection schedule',
          'Yard debris guidance',
          'Bulk item pickup process',
          'Holiday schedule updates'
        ]
      },
      {
        heading: 'Recycling',
        paragraphs: [
          'Recycling access and accepted materials may vary by service area. Contact City Hall for current details.'
        ]
      }
    ]
  },
  permitsLicenses: {
    title: 'Permits & Licenses',
    intro:
      'The city processes permits and licenses to support safe development and compliant business activity.',
    sections: [
      {
        heading: 'Common Applications',
        bullets: [
          'Building and trade permits',
          'Business licenses',
          'Sign permits',
          'Special event applications'
        ]
      },
      {
        heading: 'Before You Apply',
        paragraphs: [
          'Please confirm zoning and documentation requirements before submitting your application.'
        ]
      }
    ]
  },
  calendar: {
    title: 'Calendar',
    intro:
      'Stay informed about upcoming city meetings, deadlines, and community events.',
    sections: [
      {
        heading: 'Upcoming Highlights',
        bullets: [
          'City Council meetings',
          'Planning and Zoning meetings',
          'Community events and notices',
          'Holiday service schedule changes'
        ]
      },
      {
        heading: 'Monthly View',
        paragraphs: ['A full city calendar view is updated regularly with new events and notices.']
      }
    ]
  },
  enotify: {
    title: 'E-Notifications',
    intro:
      'Sign up to receive city notices by email, including meeting announcements, alerts, and service updates.',
    sections: [
      {
        heading: 'Notification Categories',
        bullets: [
          'City Council and committee meetings',
          'Public works and utility updates',
          'Emergency notifications',
          'Community announcements'
        ]
      },
      {
        heading: 'How To Register',
        paragraphs: [
          'Visit City Hall or contact staff for assistance setting up your e-notification preferences.'
        ]
      }
    ]
  },
  contactUs: {
    title: 'Contact Us',
    intro:
      'If you did not find what you need, City Hall staff is ready to help direct your request.',
    sections: [
      {
        heading: 'City Hall',
        paragraphs: [
          'Address: 115 W Bay Street, Magnolia, MS 39652',
          'Phone: (601) 876-5678',
          `Email: ${CITYHALL_EMAIL}`,
          `Website: ${SITE_HOST}`,
          'Hours: Mon-Thu 8:00am-5:00pm; Fri 8:00am-12:00pm'
        ]
      },
      {
        heading: 'Need Direction?',
        bullets: [
          'Service requests and utility questions',
          'Permit and licensing support',
          'Meeting and records information',
          'Department contact referrals'
        ]
      }
    ]
  }
};

const cityContentEs = {
  mayorCouncil: {
    title: 'Alcalde y Concejo',
    intro:
      'La Ciudad de Magnolia se gobierna con un modelo de alcalde y concejo enfocado en servicios eficaces, responsabilidad fiscal y planificacion a largo plazo.',
    sections: [
      {
        heading: 'Informacion de Reuniones',
        paragraphs: [
          'Las reuniones regulares del Concejo Municipal se realizan el segundo y cuarto martes de cada mes en el Ayuntamiento.',
          'Las sesiones de trabajo y reuniones especiales se publican con anticipacion en el calendario municipal y el portal de agendas.'
        ]
      },
      {
        heading: 'Responsabilidades',
        bullets: [
          'Adoptar y modificar ordenanzas municipales',
          'Aprobar presupuestos anuales y planes de capital',
          'Definir prioridades de politica para seguridad publica e infraestructura',
          'Nombrar integrantes de juntas y comisiones'
        ]
      }
    ]
  },
  townManager: {
    title: 'Administrador de la Ciudad',
    intro:
      'El Administrador de la Ciudad supervisa las operaciones municipales diarias y coordina la implementacion de las politicas adoptadas por el Alcalde y el Concejo.',
    sections: [
      {
        heading: 'Funciones de la Oficina',
        bullets: [
          'Coordinacion de departamentos y entrega de servicios',
          'Preparacion presupuestaria y reportes de desempeno',
          'Administracion de personal y cumplimiento de politicas',
          'Coordinacion intergubernamental y apoyo en subvenciones'
        ]
      },
      {
        heading: 'Contacto',
        paragraphs: [
          'Telefono: (601) 876-5678',
          `Correo: ${CITYHALL_EMAIL}`
        ]
      }
    ]
  },
  boardsCommittees: {
    title: 'Juntas y Comites',
    intro:
      'Las juntas y comites ayudan a la ciudad a recopilar participacion publica y ofrecer recomendaciones sobre programas y proyectos clave.',
    sections: [
      {
        heading: 'Juntas Actuales',
        bullets: [
          'Junta de Planificacion y Zonificacion',
          'Comision de Preservacion Historica',
          'Junta Asesora de Parques y Recreacion',
          'Comite de Seguridad Publica'
        ]
      },
      {
        heading: 'Oportunidades de Voluntariado',
        paragraphs: [
          'Los residentes interesados en participar pueden presentar una solicitud en el Ayuntamiento.'
        ]
      }
    ]
  },
  fire: {
    title: 'Departamento de Bomberos',
    intro:
      'El Departamento de Bomberos de Magnolia brinda respuesta a incendios, apoyo de rescate y educacion preventiva para residentes y empresas.',
    sections: [
      {
        heading: 'Servicios',
        bullets: [
          'Respuesta de emergencia a incendios',
          'Apoyo de comando de incidentes',
          'Capacitacion comunitaria en prevencion de incendios',
          'Inspecciones comerciales y de ocupacion'
        ]
      },
      {
        heading: 'Contacto No Urgente',
        paragraphs: ['Llame al Ayuntamiento al (601) 876-5678 para asistencia administrativa.']
      }
    ]
  },
  police: {
    title: 'Departamento de Policia',
    intro:
      'El Departamento de Policia de Magnolia trabaja en alianza con la comunidad para promover seguridad, confianza vecinal y servicio publico profesional.',
    sections: [
      {
        heading: 'Programas',
        bullets: [
          'Patrullaje comunitario y vinculacion vecinal',
          'Control de trafico y seguridad vial',
          'Alcance preventivo del delito',
          'Coordinacion de seguridad empresarial'
        ]
      },
      {
        heading: 'Registros y Solicitudes',
        paragraphs: [
          'Para solicitudes de registros, copias de incidentes o asuntos policiales no urgentes, contacte al Ayuntamiento en horario laboral.'
        ]
      }
    ]
  },
  parksRecreation: {
    title: 'Parques y Recreacion',
    intro:
      'El Departamento de Parques y Recreacion mantiene instalaciones municipales y coordina programas que apoyan una vida comunitaria activa y saludable.',
    sections: [
      {
        heading: 'Instalaciones',
        bullets: [
          'Parques vecinales',
          'Canchas y espacios comunitarios',
          'Senderos y areas verdes',
          'Programacion recreativa de temporada'
        ]
      },
      {
        heading: 'Reservaciones',
        paragraphs: ['Las solicitudes de reservacion de instalaciones pueden presentarse en el Ayuntamiento.']
      }
    ]
  },
  publicWorks: {
    title: 'Obras Publicas',
    intro:
      'Obras Publicas administra servicios esenciales de infraestructura y mantenimiento para mantener Magnolia limpia, segura y en funcionamiento.',
    sections: [
      {
        heading: 'Servicios Principales',
        bullets: [
          'Mantenimiento vial y apoyo de drenaje',
          'Operacion de sistemas de agua y alcantarillado',
          'Mantenimiento de flotilla y equipo',
          'Conservacion de derecho de via y senalizacion'
        ]
      },
      {
        heading: 'Solicitudes de Servicio',
        paragraphs: [
          'Los residentes pueden reportar baches, problemas de drenaje y asuntos de infraestructura publica contactando al Ayuntamiento.'
        ]
      }
    ]
  },
  finance: {
    title: 'Departamento de Finanzas',
    intro:
      'El Departamento de Finanzas administra presupuesto, adquisiciones, contabilidad e informes financieros de la ciudad.',
    sections: [
      {
        heading: 'Operaciones Financieras',
        bullets: [
          'Desarrollo del presupuesto anual',
          'Cuentas por pagar y por cobrar',
          'Coordinacion de auditorias y cumplimiento',
          'Recaudacion e informes financieros'
        ]
      },
      {
        heading: 'Acceso Publico',
        paragraphs: ['Los resumenes presupuestarios y documentos financieros clave estan disponibles para residentes.']
      }
    ]
  },
  onlineBillPay: {
    title: 'Pago en Linea',
    intro:
      'Magnolia ofrece opciones de pago en linea convenientes para servicios municipales elegibles.',
    sections: [
      {
        heading: 'Pagos Disponibles',
        bullets: ['Facturacion de servicios', 'Permisos y tarifas', 'Pagos de tribunal municipal (cuando aplique)']
      },
      {
        heading: 'Necesita Ayuda?',
        paragraphs: ['Para problemas de pago o dudas de cuenta, contacte al Departamento de Finanzas en el Ayuntamiento.']
      }
    ]
  },
  agendasMinutes: {
    title: 'Agendas y Actas',
    intro:
      'Revise agendas y actas actuales e historicas del Concejo Municipal y reuniones de juntas.',
    sections: [
      {
        heading: 'Acceso a Documentos',
        bullets: [
          'Agendas del Concejo Municipal',
          'Actas aprobadas del Concejo Municipal',
          'Paquetes de reuniones de juntas y comisiones',
          'Avisos de audiencias publicas'
        ]
      },
      {
        heading: 'Transparencia',
        paragraphs: [
          'La Ciudad de Magnolia mantiene un compromiso con decisiones transparentes y registros publicos accesibles.'
        ]
      }
    ]
  },
  solidWaste: {
    title: 'Residuos Solidos y Reciclaje',
    intro:
      'Encuentre horarios de recoleccion, materiales aceptados y guias de disposicion para residentes y empresas.',
    sections: [
      {
        heading: 'Temas de Recoleccion',
        bullets: [
          'Horario de recoleccion de basura residencial',
          'Guia para residuos de jardin',
          'Proceso de recoleccion de articulos voluminosos',
          'Actualizaciones por dias feriados'
        ]
      },
      {
        heading: 'Reciclaje',
        paragraphs: [
          'El acceso a reciclaje y los materiales aceptados pueden variar segun el area de servicio. Contacte al Ayuntamiento para detalles actuales.'
        ]
      }
    ]
  },
  permitsLicenses: {
    title: 'Permisos y Licencias',
    intro:
      'La ciudad tramita permisos y licencias para apoyar desarrollo seguro y actividad comercial en cumplimiento.',
    sections: [
      {
        heading: 'Solicitudes Comunes',
        bullets: [
          'Permisos de construccion y oficios',
          'Licencias comerciales',
          'Permisos de senaletica',
          'Solicitudes para eventos especiales'
        ]
      },
      {
        heading: 'Antes de Solicitar',
        paragraphs: [
          'Confirme requisitos de zonificacion y documentacion antes de presentar su solicitud.'
        ]
      }
    ]
  },
  calendar: {
    title: 'Calendario',
    intro:
      'Mantengase informado sobre reuniones, fechas limite y eventos comunitarios proximos.',
    sections: [
      {
        heading: 'Proximos Destacados',
        bullets: [
          'Reuniones del Concejo Municipal',
          'Reuniones de Planificacion y Zonificacion',
          'Eventos y avisos comunitarios',
          'Cambios de servicio por dias feriados'
        ]
      },
      {
        heading: 'Vista Mensual',
        paragraphs: ['La vista completa del calendario municipal se actualiza regularmente con nuevos eventos y avisos.']
      }
    ]
  },
  enotify: {
    title: 'Notificaciones Electronicas',
    intro:
      'Suscribase para recibir avisos de la ciudad por correo electronico, incluyendo anuncios de reuniones, alertas y actualizaciones de servicio.',
    sections: [
      {
        heading: 'Categorias de Notificacion',
        bullets: [
          'Reuniones del Concejo y comites',
          'Actualizaciones de obras publicas y servicios',
          'Notificaciones de emergencia',
          'Anuncios comunitarios'
        ]
      },
      {
        heading: 'Como Registrarse',
        paragraphs: [
          'Visite el Ayuntamiento o contacte al personal para ayuda con sus preferencias de notificacion.'
        ]
      }
    ]
  },
  contactUs: {
    title: 'Contactenos',
    intro:
      'Si no encontro lo que necesita, el personal del Ayuntamiento esta listo para ayudarle con su solicitud.',
    sections: [
      {
        heading: 'Ayuntamiento',
        paragraphs: [
          'Direccion: 115 W Bay Street, Magnolia, MS 39652',
          'Telefono: (601) 876-5678',
          `Correo: ${CITYHALL_EMAIL}`,
          `Sitio web: ${SITE_HOST}`,
          'Horario: Lun-Jue 8:00am-5:00pm; Vie 8:00am-12:00pm'
        ]
      },
      {
        heading: 'Necesita Orientacion?',
        bullets: [
          'Solicitudes de servicio y dudas de servicios publicos',
          'Apoyo para permisos y licencias',
          'Informacion de reuniones y registros',
          'Referencias de contacto departamental'
        ]
      }
    ]
  }
};

export function getCityContent(language) {
  return language === 'es' ? cityContentEs : cityContentEn;
}

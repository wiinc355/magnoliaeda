export default function MunicipalIcon({ name, className = '' }) {
  const classes = `municipal-icon ${className}`.trim();

  switch (name) {
    case 'map-pin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
          <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a13.5 13.5 0 0 1 0 18" />
          <path d="M12 3a13.5 13.5 0 0 0 0 18" />
        </svg>
      );
    case 'file':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
          <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={classes} aria-hidden="true">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.87.24-1.46 1.49-1.46H16V5.02c-.48-.06-1.38-.12-2.63-.12-2.6 0-4.37 1.59-4.37 4.5V11H6v3h3v7h4.5Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={classes} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
          <path d="M16 11.37a4 4 0 1 1-7.75 1.26 4 4 0 0 1 7.75-1.26Z" />
          <path d="M17.5 6.5h.01" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={classes} aria-hidden="true">
          <path d="M21.58 7.19a2.8 2.8 0 0 0-1.97-1.98C17.88 4.75 12 4.75 12 4.75s-5.88 0-7.61.46A2.8 2.8 0 0 0 2.42 7.2 29.7 29.7 0 0 0 2 12a29.7 29.7 0 0 0 .42 4.81 2.8 2.8 0 0 0 1.97 1.98c1.73.46 7.61.46 7.61.46s5.88 0 7.61-.46a2.8 2.8 0 0 0 1.97-1.98c.28-1.59.42-3.2.42-4.81s-.14-3.22-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

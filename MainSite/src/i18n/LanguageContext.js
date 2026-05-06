import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'municipal-language';

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (storedLanguage === 'en' || storedLanguage === 'es') {
    return storedLanguage;
  }

  const browserLanguage = (window.navigator.language || '').toLowerCase();
  return browserLanguage.startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    isSpanish: language === 'es'
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}

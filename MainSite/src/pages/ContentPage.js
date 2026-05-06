import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { getCityContent } from './cityContent';
import { useLanguage } from '../i18n/LanguageContext';

export default function ContentPage({ pageKey }) {
  const { language, isSpanish } = useLanguage();
  const cityContent = getCityContent(language);
  const page = cityContent[pageKey];

  if (!page) {
    return (
      <div>
        <PageBanner title={isSpanish ? 'Pagina No Encontrada' : 'Page Not Found'} />
        <section className="content-section first-section">
          <div className="container">
            <h3>{isSpanish ? 'El contenido aun no esta disponible.' : 'Content is not available yet.'}</h3>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageBanner title={page.title} />

      <section className="content-section first-section">
        <div className="container city-content-wrap">
          <h3>{page.title}</h3>
          <p>{page.intro}</p>

          {page.sections.map((section) => (
            <article key={section.heading} className="city-article">
              <h4>{section.heading}</h4>
              {section.paragraphs && section.paragraphs.map((text) => <p key={text}>{text}</p>)}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

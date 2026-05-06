import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function WorkforceTraining() {
  return (
    <div>
      <PageBanner title="Workforce Training" />

      <section className="content-section first-section">
        <div className="container">
          <h3>A Skilled, Ready Workforce</h3>
          <div className="text-wrapper">
            <p>
              Magnolia and Pike County offer businesses access to a skilled, motivated workforce
              backed by strong educational institutions and customized training programs designed
              to meet employer needs.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <h4>Southwest Mississippi Community College (SMCC)</h4>
          <p>
            Located in Summit, just 12 miles from Magnolia, SMCC provides associate degrees,
            technical certificates, and customized workforce training. The college partners
            with businesses to develop tailored training programs that meet specific industry needs,
            often at no cost to the employer through Mississippi's <strong>Workforce Enhancement
            Training (WET) Fund</strong>.
          </p>

          <h4>Mississippi Development Authority (MDA) — Workforce Programs</h4>
          <p>
            MDA offers several programs to help businesses find, train, and retain workers:
          </p>
          <ul>
            <li>
              <strong>WIN Job Centers</strong> — Workforce Investment Network centers provide
              free employee recruitment, screening, and pre-employment services
            </li>
            <li>
              <strong>On-the-Job Training (OJT)</strong> — Wage reimbursements for training
              newly hired employees on-site
            </li>
            <li>
              <strong>Workforce Enhancement Training Fund</strong> — Funds customized
              occupational skills training for existing and new industries
            </li>
          </ul>

          <h4>Pike County School District</h4>
          <p>
            The Pike County School District prepares a steady pipeline of local talent through
            career and technical education (CTE) programs in manufacturing, healthcare, information
            technology, agriculture, and other fields aligned with regional employer needs.
          </p>

          <h4>Customized Training</h4>
          <p>
            The Magnolia EDA works directly with new and expanding industries to develop
            customized pre-employment and on-the-job training programs. We coordinate with
            SMCC, MDA, and the WIN Job Center to ensure your workforce is trained and ready
            before your facility opens.
          </p>

          <div style={{ background: '#e8f4ee', padding: '1.5rem', borderRadius: 4, marginTop: '2rem' }}>
            <h4 style={{ color: '#2d6a4f', marginBottom: '.5rem' }}>Contact Us About Workforce Solutions</h4>
            <p style={{ margin: 0 }}>
              Let us build a customized workforce solution for your business.
              Contact the Magnolia EDA at <a href="mailto:eda@cityofmagnolia.com">eda@cityofmagnolia.com</a> or
              call <a href="tel:+16018765678">(601) 876-5678</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

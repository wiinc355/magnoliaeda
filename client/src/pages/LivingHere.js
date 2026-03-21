import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function LivingHere() {
  return (
    <div>
      <PageBanner title="Living Here" />

      <section className="content-section first-section">
        <div className="container">
          <h3>The Sweet Life in Magnolia</h3>
          <div className="text-wrapper">
            <p>
              <strong>Magnolia, Mississippi</strong> offers the ideal blend of a slower pace of
              life and ready access to the amenities that are necessary in today's world — all
              wrapped in the warmth of a true small-town community.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section living-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <h4>Education</h4>
          <p>
            The <strong>South Pike School District</strong> serves Magnolia with quality
            K-12 education, including career and technical education pathways that prepare
            students for both college and careers. Advanced coursework and dual enrollment
            opportunities are available through Southwest Mississippi Community College.
          </p>
          <p>
            <strong>Southwest Mississippi Community College (SMCC)</strong> in Summit
            (12 miles) provides two-year degree programs, technical certificates, and
            a strong transfer program to four-year universities. <strong>Alcorn State
            University</strong> (Lorman campus, ~55 miles) and <strong>Mississippi College</strong>
            (Clinton, ~90 miles) are among the regional four-year institutions.
          </p>

          <h4>Healthcare</h4>
          <p>
            Excellent healthcare is available at <strong>Southwest Mississippi Regional
            Medical Center</strong> in McComb (10 miles), a full-service regional hospital
            offering emergency care, surgical services, cardiology, oncology, and much more.
            The hospital employs over 1,200 healthcare professionals and consistently ranks
            among the top hospitals in the state for quality of care.
          </p>
          <p>
            Local clinics, physicians' offices, and specialty providers serve Magnolia
            and the surrounding communities.
          </p>

          <div style={{
            background: 'linear-gradient(135deg, #2d6a4f, #1b4d38)',
            height: 300,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            margin: '2rem 0'
          }}>
            Downtown Magnolia, Mississippi
          </div>

          <h4>Things to Do</h4>
          <p>
            Magnolia is the quintessential Southern small town, with a historic downtown
            featuring locally owned shops, restaurants, and community gathering places.
            The city's parks and recreational facilities offer year-round activities for
            families of all ages.
          </p>
          <p>
            Nearby <strong>Percy Quin State Park</strong> (15 miles) offers camping, fishing,
            golf, swimming, tennis, and miles of trails around the beautiful Lake Tangipahoa.
            The park is one of Mississippi's most beloved outdoor destinations.
          </p>
          <p>
            The <strong>Bogue Chitto National Wildlife Refuge</strong> (20 miles south) provides
            excellent bird-watching, wildlife viewing, canoeing, and hunting. The Pearl River
            system offers world-class bass fishing just miles from downtown.
          </p>
          <p>
            Residents are just a 2-hour drive from the beaches and entertainment of the
            Mississippi Gulf Coast, and 2 hours from the world-class dining, music, and
            culture of New Orleans, Louisiana.
          </p>

          <div style={{
            background: 'linear-gradient(135deg, #b5811a, #d4a03a)',
            height: 280,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            margin: '2rem 0'
          }}>
            Percy Quin State Park &amp; Natural Beauty
          </div>

          <h4>Cost of Living</h4>
          <p>
            Magnolia and Pike County offer an exceptional value. Housing costs are
            significantly below the national average, with a variety of options including
            historic homes, new construction neighborhoods, rural acreage, and affordable
            rentals.
          </p>
          <p>
            On national cost-of-living indices, southwest Mississippi consistently scores
            25–30% below the national average, with housing costs up to 50% below the
            national average. For employers, this means your workers' compensation goes
            further, improving quality of life and employee retention.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {[
              { icon: '🏡', label: 'Housing', detail: '~50% below national avg.' },
              { icon: '🚗', label: 'Transportation', detail: '~25% below national avg.' },
              { icon: '🛒', label: 'Groceries', detail: 'Well below national avg.' },
              { icon: '🏥', label: 'Healthcare', detail: 'Competitive regional rates' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8f8f6', padding: '1.25rem', textAlign: 'center', borderRadius: 4, borderTop: '3px solid #2d6a4f' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.4rem' }}>{item.icon}</div>
                <strong style={{ color: '#2d6a4f', display: 'block', marginBottom: '.2rem' }}>{item.label}</strong>
                <span style={{ fontSize: '.82rem', color: '#666' }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

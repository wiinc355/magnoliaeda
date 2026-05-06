import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function TargetIndustries() {
  return (
    <div>
      <PageBanner title="Target Industries" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Bold Choice</h3>
          <div className="text-wrapper">
            <p>
              <strong>Magnolia, Mississippi</strong> is poised to attract a variety of industry
              sectors, especially food processing &amp; agribusiness, manufacturing, distribution
              &amp; logistics, and healthcare services.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <h4>Food Processing &amp; Agribusiness</h4>
          <p>
            Southwest Mississippi has a rich agricultural heritage with abundant production of
            broilers, timber, sweet potatoes, and other crops. The area's agricultural supply
            chain, available workforce, and proximity to Gulf ports make Magnolia ideal for
            food manufacturers, processors, and distributors seeking to source locally and ship
            globally. The Mississippi River system and Port of New Orleans provide cost-effective
            export options for bulk agricultural products.
          </p>

          <h4>Distribution &amp; Warehousing</h4>
          <p>
            Magnolia's location on the I-55 corridor with US 51 and US 98 intersecting in the
            city makes it highly attractive to logistics and distribution companies. Within a
            day's drive of 60% of the US population, Magnolia is well-suited for regional
            distribution centers. The Kansas City Southern (CPKC) Railway provides an
            additional freight option. Approximately 120 miles from the Port of New Orleans
            and 165 miles from the Port of Mobile, Magnolia is ideally positioned for
            import/export operations.
          </p>

          <h4>Advanced Manufacturing</h4>
          <p>
            The availability of industrial-zoned land, competitive utility rates, a willing
            workforce, and generous incentives make Magnolia an excellent location for
            manufacturers. Southwest Mississippi Community College provides customized training
            in industrial maintenance, welding, CNC technology, and other manufacturing-related
            fields to ensure a pipeline of trained workers.
          </p>

          <h4>Healthcare &amp; Life Sciences</h4>
          <p>
            Southwest Mississippi Regional Medical Center (McComb) anchors the regional healthcare
            ecosystem. There is growing opportunity for medical offices, specialty care clinics,
            assisted living facilities, and health-related manufacturing and services to serve
            the growing regional population in Pike County and surrounding areas.
          </p>

          <h4>Timber &amp; Wood Products</h4>
          <p>
            Pike County and the surrounding region are rich in timber resources. Sawmills, wood
            products manufacturers, paper and pulp operations, and bioenergy facilities can
            capitalize on the abundant, sustainably managed timber supply and available
            industrial sites with rail access.
          </p>

          <div style={{ background: '#e8f4ee', padding: '1.5rem', borderRadius: 4, marginTop: '2rem' }}>
            <p style={{ margin: 0 }}>
              <strong>Interested in locating in Magnolia?</strong> Contact the Magnolia EDA to
              discuss your project and learn how we can help make it a success.{' '}
              <a href="mailto:eda@cityofmagnolia.com">eda@cityofmagnolia.com</a> •{' '}
              <a href="tel:+16018765678">(601) 876-5678</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

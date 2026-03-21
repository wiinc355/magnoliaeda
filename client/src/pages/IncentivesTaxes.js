import React from 'react';
import { PageBanner } from '../components/PageBanner';

export default function IncentivesTaxes() {
  return (
    <div>
      <PageBanner title="Incentives &amp; Taxes" />

      <section className="content-section first-section">
        <div className="container">
          <h3>Full-Bodied Incentives</h3>
          <div className="text-wrapper">
            <p>
              The <strong>Magnolia EDA</strong> aggressively pursues federal, state, and local
              incentives to make the cost of relocating and operating your business extremely
              competitive. We will work with your company to identify the most beneficial tax,
              financing, development, and training incentives available.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className="container">

          <h4>Federal Incentives</h4>
          <p>
            Portions of Pike County and the City of Magnolia are designated as{' '}
            <strong>Federal Opportunity Zones</strong>, providing investors capital gains tax
            incentives. The area also qualifies for{' '}
            <strong>New Markets Tax Credits</strong>, allowing companies investing in Magnolia
            the potential for significant savings on their investments.
          </p>
          <p>
            Magnolia is eligible for <strong>USDA Rural Development</strong> programs including
            Business &amp; Industry Loan Guarantees, Community Facilities grants, and Rural
            Business Development Grants.
          </p>

          <h4>State Incentives</h4>
          <p>
            Mississippi offers some of the nation's most competitive business incentives,
            including:
          </p>
          <ul>
            <li><strong>Mississippi Advantage Jobs Incentive Program</strong> — payroll rebate for qualifying new jobs</li>
            <li><strong>Mississippi Job Tax Credit</strong> — income tax credit for each new full-time job</li>
            <li><strong>Mississippi Investment Tax Credit</strong> — credit for capital investment in eligible projects</li>
            <li><strong>Mississippi Enterprise Zone Program</strong> — property tax exemptions and other credits</li>
            <li><strong>Sales Tax Exemption</strong> on manufacturing machinery, equipment, and raw materials</li>
            <li><strong>Property Tax Exemption</strong> (PILOT agreements) for eligible new industries</li>
          </ul>

          <h4>Local Incentives</h4>
          <p>
            The Magnolia EDA and Pike County can provide a wealth of local incentives tailored
            to your project, including:
          </p>
          <ul>
            <li>Fee-free site preparation assistance</li>
            <li>Infrastructure extensions at reduced or no cost</li>
            <li>Property tax abatements and PILOT agreements</li>
            <li>Low-interest revolving loan fund financing</li>
            <li>Customized workforce recruitment and training</li>
          </ul>

          <h4>Tax Rates</h4>

          <table className="tax-table">
            <tbody>
              <tr>
                <td>State Corporate Income Tax</td>
                <td>5.0% (flat rate)</td>
              </tr>
              <tr>
                <td>State Sales Tax</td>
                <td>7%</td>
              </tr>
              <tr>
                <td>Local Option Sales Tax</td>
                <td>1%</td>
              </tr>
              <tr>
                <td>City of Magnolia Property Tax (millage)</td>
                <td>Contact EDA</td>
              </tr>
              <tr>
                <td>Pike County Property Tax (millage)</td>
                <td>Contact EDA</td>
              </tr>
            </tbody>
          </table>

          <div style={{ background: '#f8f8f6', padding: '1.25rem', borderLeft: '4px solid #2d6a4f', marginTop: '1.5rem', borderRadius: 2 }}>
            <p style={{ margin: 0, fontSize: '.95rem' }}>
              <strong>Manufacturing Exemptions:</strong> Mississippi offers a full sales tax
              exemption on manufacturing machinery and equipment, as well as raw materials
              used in the manufacturing process — providing substantial savings for industrial operations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

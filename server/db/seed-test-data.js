const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// ── Announcements ────────────────────────────────────────────────────────────
const announcements = [
  { title: 'City Hall Summer Hours Begin June 1', body: 'City Hall will operate on summer hours (Mon–Thu, 7 AM–5 PM) starting June 1 through August 31. Regular hours resume September 2.', category: 'General', published_at: '2026-05-01', expires_at: '2026-08-31', created_by: 'admin' },
  { title: 'Water Main Repair – Oak Street Closure', body: 'Oak Street between Main St and Elm Ave will be closed May 12–14 for emergency water main repairs. Detour signs will be posted.', category: 'Public Works', published_at: '2026-05-05', expires_at: '2026-05-15', created_by: 'admin' },
  { title: 'Online Bill Pay Now Available', body: 'Residents can now pay water, sewer, and solid waste bills online at magnolia.ms.gov/pay. Convenience fee applies to card payments.', category: 'Finance', published_at: '2026-04-15', expires_at: null, created_by: 'admin' },
  { title: 'Public Hearing: FY 2027 Budget', body: 'The City Council will hold a public hearing on the proposed FY 2027 budget on May 19, 2026 at 6 PM in Council Chambers. All residents are encouraged to attend.', category: 'Government', published_at: '2026-05-01', expires_at: '2026-05-19', created_by: 'admin' },
  { title: 'Brush & Bulk Pickup Schedule – May', body: 'Monthly brush and bulk item pickup will run May 20–24. Items must be placed at curb by 7 AM on your scheduled day. No hazardous materials accepted.', category: 'Public Works', published_at: '2026-05-10', expires_at: '2026-05-24', created_by: 'admin' },
  { title: 'Hiring: Part-Time Parks Maintenance', body: 'The City of Magnolia is accepting applications for two part-time Parks Maintenance positions. Applications available at City Hall or online. Deadline: May 30.', category: 'Employment', published_at: '2026-05-03', expires_at: '2026-05-30', created_by: 'admin' },
  { title: 'Notice of Planned Burn – Pike County Road 12', body: 'The Mississippi Forestry Commission will conduct a controlled burn near Pike County Road 12 on May 8, weather permitting. Expect smoke in the area.', category: 'Public Safety', published_at: '2026-05-06', expires_at: '2026-05-10', created_by: 'admin' },
  { title: 'Community Garden Plots Still Available', body: 'A limited number of raised garden plots remain available at Magnolia Community Garden. Annual fee is $25. Contact Parks & Recreation to reserve yours.', category: 'Community', published_at: '2026-04-20', expires_at: '2026-06-01', created_by: 'admin' },
  { title: 'Road Resurfacing Project: Phase 2 Begins', body: 'Phase 2 of the city-wide road resurfacing project begins May 13 on Walnut Street, Pine Street, and Cedar Lane. Expect temporary lane closures 7 AM–4 PM weekdays.', category: 'Public Works', published_at: '2026-05-08', expires_at: '2026-06-30', created_by: 'admin' },
  { title: 'Police Department: Safe Exchange Zone Now Open', body: 'A new Safe Exchange Zone for online marketplace transactions is now available 24/7 in the Magnolia Police Department parking lot at 210 E Bay St.', category: 'Public Safety', published_at: '2026-04-28', expires_at: null, created_by: 'admin' },
];

const insertAnnouncement = db.prepare(`
  INSERT INTO announcements (title, body, category, is_active, published_at, expires_at, created_by)
  VALUES (@title, @body, @category, 1, @published_at, @expires_at, @created_by)
`);

// ── Events ────────────────────────────────────────────────────────────────────
const events = [
  { title: 'City Council Regular Meeting', description: 'Monthly regular meeting of the Magnolia City Council. Public comments accepted at the start of the meeting.', location: 'City Hall Council Chambers, 115 W Bay St', event_date: '2026-05-19', end_date: '2026-05-19', category: 'Government', created_by: 'admin' },
  { title: 'Memorial Day Ceremony', description: 'Annual Memorial Day ceremony honoring Magnolia veterans. Ceremony begins at 10 AM followed by a community reception.', location: 'Veterans Memorial Park, 200 S Cherry St', event_date: '2026-05-25', end_date: '2026-05-25', category: 'Community', created_by: 'admin' },
  { title: 'Summer Splash Pool Opening Day', description: 'Magnolia Community Pool opens for the summer season. Free admission on opening day for all residents. Season passes on sale.', location: 'Magnolia Community Pool, 400 N Pine St', event_date: '2026-05-31', end_date: '2026-05-31', category: 'Parks & Recreation', created_by: 'admin' },
  { title: 'Farmers Market – Season Opener', description: 'The Magnolia Downtown Farmers Market returns for another season. Local produce, crafts, and food vendors every Saturday through October.', location: 'Downtown Magnolia, Railroad Ave', event_date: '2026-05-10', end_date: '2026-10-31', category: 'Community', created_by: 'admin' },
  { title: 'Free Shredding & Electronics Recycling Day', description: 'Bring up to 5 boxes of documents for free shredding. Electronics accepted for proper disposal. No TVs or monitors.', location: 'Magnolia Public Works Lot, 310 S Pearl St', event_date: '2026-05-17', end_date: '2026-05-17', category: 'Public Works', created_by: 'admin' },
  { title: 'Youth Summer Baseball League Registration', description: 'Registration open for ages 7–16. League runs June through July. $40 per player includes uniform. Register online or at Parks & Recreation office.', location: 'Magnolia Parks & Recreation, 400 N Pine St', event_date: '2026-05-12', end_date: '2026-05-29', category: 'Parks & Recreation', created_by: 'admin' },
  { title: 'Planning & Zoning Commission Meeting', description: 'Regular monthly meeting. Agenda includes variance requests for 320 Walnut St and a rezoning application on Hwy 98 corridor.', location: 'City Hall, Room 102, 115 W Bay St', event_date: '2026-05-13', end_date: '2026-05-13', category: 'Government', created_by: 'admin' },
  { title: 'Senior Bingo Night', description: 'Monthly bingo night for Magnolia seniors 55+. Light refreshments provided. Free to attend. Doors open at 6 PM, first game at 6:30 PM.', location: 'Magnolia Senior Center, 505 W Railroad Ave', event_date: '2026-05-22', end_date: '2026-05-22', category: 'Community', created_by: 'admin' },
  { title: 'Fire Safety Open House', description: 'Tour the fire station, meet firefighters, and learn fire prevention tips. Activities for kids including fire truck tours. Hosted by Magnolia Fire Department.', location: 'Magnolia Fire Station No. 1, 220 E Bay St', event_date: '2026-06-07', end_date: '2026-06-07', category: 'Public Safety', created_by: 'admin' },
  { title: 'Juneteenth Community Celebration', description: 'Celebrate Juneteenth with music, food, and community activities. Hosted by the City of Magnolia in partnership with local organizations.', location: 'Magnolia City Park, 100 Park Dr', event_date: '2026-06-19', end_date: '2026-06-19', category: 'Community', created_by: 'admin' },
];

const insertEvent = db.prepare(`
  INSERT INTO events (title, description, location, event_date, end_date, category, is_active, created_by)
  VALUES (@title, @description, @location, @event_date, @end_date, @category, 1, @created_by)
`);

// ── Projects ──────────────────────────────────────────────────────────────────
const projects = [
  { name: 'FY 2026 Road Resurfacing – Phase 2', description: 'Resurfacing of Walnut Street, Pine Street, and Cedar Lane using MDOT allocation funds. Estimated completion: June 30, 2026.' },
  { name: 'City Hall HVAC Replacement', description: 'Replacement of aging HVAC units serving City Hall main building and annex. Contract awarded to Pike County HVAC Services. Start date: July 2026.' },
  { name: 'Community Pool Pump & Filter Upgrade', description: 'Upgrade of filtration and pump systems at Magnolia Community Pool to meet updated MSDH standards. Work scheduled during off-season.' },
  { name: 'Broadband Feasibility Study', description: 'Independent feasibility study for municipal broadband expansion to underserved areas of Magnolia. Study funded through ARPA local recovery funds.' },
  { name: 'Downtown Sidewalk Repair Program', description: 'ADA-compliant sidewalk repairs on Main St, Bay St, and Railroad Ave. Phase 1 targeting 12 identified hazard locations. Grant-funded through CDBG.' },
  { name: 'Police Department Body Camera Program', description: 'Procurement and deployment of body-worn cameras for all patrol officers. Policy development and officer training included in project scope.' },
  { name: 'Wastewater Treatment Plant Upgrade', description: 'Upgrade of secondary treatment capacity at the Magnolia WWTP to comply with updated MDEQ discharge permit requirements. Engineering phase underway.' },
  { name: 'Parks Master Plan Update', description: 'Comprehensive update to the 2014 Parks & Recreation Master Plan. Public input sessions planned for June–August 2026. Consultant selected.' },
  { name: 'Cemetery Records Digitization', description: 'Digitization and online publication of Magnolia City Cemetery records dating to 1892. Partnership with Pike-Amite-Walthall Library System.' },
  { name: 'Solar Panel Installation – Public Works Facility', description: 'Installation of rooftop solar array at Public Works facility on S Pearl St. Projected to offset 40% of facility electricity consumption.' },
];

const insertProject = db.prepare(`
  INSERT INTO projects (name, description) VALUES (@name, @description)
`);

// ── Personnel (Staff) ─────────────────────────────────────────────────────────
const personnel = [
  { full_name: 'Marcus T. Williams', job_title: 'City Administrator', department: 'Administration', email: 'mwilliams@magnolia.ms.gov', phone: '(601) 876-5678 ext. 101' },
  { full_name: 'Sandra J. Polk', job_title: 'City Clerk', department: 'Administration', email: 'spolk@magnolia.ms.gov', phone: '(601) 876-5678 ext. 102' },
  { full_name: 'Chief Darnell R. Haynes', job_title: 'Chief of Police', department: 'Police', email: 'dhaynes@magnolia.ms.gov', phone: '(601) 876-5010' },
  { full_name: 'Fire Chief LaTonya M. Simmons', job_title: 'Fire Chief', department: 'Fire', email: 'lsimmons@magnolia.ms.gov', phone: '(601) 876-5020' },
  { full_name: 'Raymond E. Tucker', job_title: 'Public Works Director', department: 'Public Works', email: 'rtucker@magnolia.ms.gov', phone: '(601) 876-5030' },
  { full_name: 'Angela D. Forrest', job_title: 'Finance Director', department: 'Finance', email: 'aforrest@magnolia.ms.gov', phone: '(601) 876-5040' },
  { full_name: 'Jerome K. Barnes', job_title: 'Parks & Recreation Director', department: 'Parks & Recreation', email: 'jbarnes@magnolia.ms.gov', phone: '(601) 876-5050' },
  { full_name: 'Cynthia L. Odom', job_title: 'Code Enforcement Officer', department: 'Administration', email: 'codom@magnolia.ms.gov', phone: '(601) 876-5678 ext. 110' },
  { full_name: 'Terrell A. Monroe', job_title: 'Water & Sewer Superintendent', department: 'Public Works', email: 'tmonroe@magnolia.ms.gov', phone: '(601) 876-5031' },
  { full_name: 'Brenda F. Watts', job_title: 'Administrative Assistant', department: 'Administration', email: 'bwatts@magnolia.ms.gov', phone: '(601) 876-5678 ext. 103' },
];

const insertPersonnel = db.prepare(`
  INSERT INTO personnel (full_name, job_title, department, email, phone, is_active)
  VALUES (@full_name, @job_title, @department, @email, @phone, 1)
`);

// ── Contacts (Local Residents) ────────────────────────────────────────────────
const contacts = [
  { full_name: 'Dorothy M. Henderson', email: 'dorothy.henderson@email.com', phone: '(601) 555-0101' },
  { full_name: 'James R. Causey', email: 'jcausey@email.com', phone: '(601) 555-0102' },
  { full_name: 'Patricia A. Greer', email: 'p.greer@email.com', phone: '(601) 555-0103' },
  { full_name: 'Robert L. Dillon', email: 'rdillon@email.com', phone: '(601) 555-0104' },
  { full_name: 'Evelyn C. Price', email: 'evelyn.price@email.com', phone: '(601) 555-0105' },
  { full_name: 'Harold W. Stokes', email: 'hwstokes@email.com', phone: '(601) 555-0106' },
  { full_name: 'Carolyn B. Nash', email: 'cnash@email.com', phone: '(601) 555-0107' },
  { full_name: 'Willie F. Cross', email: 'wcross@email.com', phone: '(601) 555-0108' },
  { full_name: 'Ruth E. Longfellow', email: 'r.longfellow@email.com', phone: '(601) 555-0109' },
  { full_name: 'George T. Mabry', email: 'gmabry@email.com', phone: '(601) 555-0110' },
];

const insertContact = db.prepare(`
  INSERT INTO contacts (full_name, email, phone) VALUES (@full_name, @email, @phone)
`);

// ── Buildings ─────────────────────────────────────────────────────────────────
const buildings = [
  { building_name: 'City Hall', department: 'Administration', street: '115 W Bay St', postal_code: '39652', phone: '(601) 876-5678', office_hours: 'Mon–Fri 8 AM–5 PM', map_url: '' },
  { building_name: 'Magnolia Police Department', department: 'Police', street: '210 E Bay St', postal_code: '39652', phone: '(601) 876-5010', office_hours: 'Open 24/7', map_url: '' },
  { building_name: 'Magnolia Fire Station No. 1', department: 'Fire', street: '220 E Bay St', postal_code: '39652', phone: '(601) 876-5020', office_hours: 'Open 24/7', map_url: '' },
  { building_name: 'Public Works Facility', department: 'Public Works', street: '310 S Pearl St', postal_code: '39652', phone: '(601) 876-5030', office_hours: 'Mon–Fri 7 AM–4 PM', map_url: '' },
  { building_name: 'Parks & Recreation Office', department: 'Parks & Recreation', street: '400 N Pine St', postal_code: '39652', phone: '(601) 876-5050', office_hours: 'Mon–Fri 8 AM–5 PM', map_url: '' },
  { building_name: 'Magnolia Community Pool', department: 'Parks & Recreation', street: '400 N Pine St', postal_code: '39652', phone: '(601) 876-5051', office_hours: 'Memorial Day–Labor Day, Daily 10 AM–6 PM', map_url: '' },
  { building_name: 'Magnolia Senior Center', department: 'Parks & Recreation', street: '505 W Railroad Ave', postal_code: '39652', phone: '(601) 876-5055', office_hours: 'Mon–Fri 9 AM–4 PM', map_url: '' },
  { building_name: 'Finance & Utility Billing Office', department: 'Finance', street: '115 W Bay St Suite 104', postal_code: '39652', phone: '(601) 876-5040', office_hours: 'Mon–Fri 8 AM–4:30 PM', map_url: '' },
  { building_name: 'Magnolia Wastewater Treatment Plant', department: 'Public Works', street: '820 S Cherry St', postal_code: '39652', phone: '(601) 876-5035', office_hours: 'Mon–Fri 7 AM–3:30 PM', map_url: '' },
  { building_name: 'Magnolia City Cemetery Office', department: 'Administration', street: '615 N Oak St', postal_code: '39652', phone: '(601) 876-5678 ext. 115', office_hours: 'Daily Dawn–Dusk (Office Mon–Fri 8 AM–4 PM)', map_url: '' },
];

const insertBuilding = db.prepare(`
  INSERT INTO building_addresses (building_name, department, street, city, state, postal_code, phone, office_hours, map_url, is_active)
  VALUES (@building_name, @department, @street, 'Magnolia', 'MS', @postal_code, @phone, @office_hours, @map_url, 1)
`);

// ── Run all inserts in a single transaction ───────────────────────────────────
const seed = db.transaction(() => {
  for (const row of announcements) insertAnnouncement.run(row);
  for (const row of events) insertEvent.run(row);
  for (const row of projects) insertProject.run(row);
  for (const row of personnel) insertPersonnel.run(row);
  for (const row of contacts) insertContact.run(row);
  for (const row of buildings) insertBuilding.run(row);
});

seed();

console.log('Seed complete:');
console.log(`  ${announcements.length} announcements`);
console.log(`  ${events.length} events`);
console.log(`  ${projects.length} projects`);
console.log(`  ${personnel.length} personnel`);
console.log(`  ${contacts.length} contacts`);
console.log(`  ${buildings.length} buildings`);

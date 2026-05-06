const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function avatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0a4f90&color=fff&size=128`;
}

// 10 staff profiles — match the personnel seeded earlier
const staffProfiles = [
  {
    email: 'mwilliams@magnolia.ms.gov',
    display_name: 'Marcus T. Williams',
    job_title: 'City Administrator',
    department: 'Administration',
    role_label: 'Admin',
    phone: '(601) 876-5678 ext. 101',
    birth_date: '1971-03-14',
    bio: 'Marcus has served as City Administrator since 2018, overseeing all municipal operations and departments for the City of Magnolia.'
  },
  {
    email: 'spolk@magnolia.ms.gov',
    display_name: 'Sandra J. Polk',
    job_title: 'City Clerk',
    department: 'Administration',
    role_label: 'Staff',
    phone: '(601) 876-5678 ext. 102',
    birth_date: '1978-07-22',
    bio: 'Sandra manages official city records, council meeting minutes, and public records requests.'
  },
  {
    email: 'dhaynes@magnolia.ms.gov',
    display_name: 'Darnell R. Haynes',
    job_title: 'Chief of Police',
    department: 'Police',
    role_label: 'Department User',
    phone: '(601) 876-5010',
    birth_date: '1969-11-05',
    bio: 'Chief Haynes leads the Magnolia Police Department with a focus on community policing and public safety partnerships.'
  },
  {
    email: 'lsimmons@magnolia.ms.gov',
    display_name: 'LaTonya M. Simmons',
    job_title: 'Fire Chief',
    department: 'Fire',
    role_label: 'Department User',
    phone: '(601) 876-5020',
    birth_date: '1974-02-18',
    bio: 'Fire Chief Simmons oversees fire suppression, emergency medical services, and fire prevention education programs.'
  },
  {
    email: 'rtucker@magnolia.ms.gov',
    display_name: 'Raymond E. Tucker',
    job_title: 'Public Works Director',
    department: 'Public Works',
    role_label: 'Department User',
    phone: '(601) 876-5030',
    birth_date: '1967-09-30',
    bio: 'Raymond directs street maintenance, water and sewer infrastructure, and solid waste operations for the city.'
  },
  {
    email: 'aforrest@magnolia.ms.gov',
    display_name: 'Angela D. Forrest',
    job_title: 'Finance Director',
    department: 'Finance',
    role_label: 'Department User',
    phone: '(601) 876-5040',
    birth_date: '1980-05-12',
    bio: 'Angela manages the city budget, utility billing, accounts payable, and financial reporting.'
  },
  {
    email: 'jbarnes@magnolia.ms.gov',
    display_name: 'Jerome K. Barnes',
    job_title: 'Parks & Recreation Director',
    department: 'Parks & Recreation',
    role_label: 'Department User',
    phone: '(601) 876-5050',
    birth_date: '1983-12-01',
    bio: 'Jerome oversees parks maintenance, youth and senior programs, and special events for the City of Magnolia.'
  },
  {
    email: 'codom@magnolia.ms.gov',
    display_name: 'Cynthia L. Odom',
    job_title: 'Code Enforcement Officer',
    department: 'Administration',
    role_label: 'Staff',
    phone: '(601) 876-5678 ext. 110',
    birth_date: '1985-04-27',
    bio: 'Cynthia enforces municipal property maintenance codes and zoning ordinances across the city.'
  },
  {
    email: 'tmonroe@magnolia.ms.gov',
    display_name: 'Terrell A. Monroe',
    job_title: 'Water & Sewer Superintendent',
    department: 'Public Works',
    role_label: 'Staff',
    phone: '(601) 876-5031',
    birth_date: '1976-08-15',
    bio: 'Terrell supervises daily operations of the water distribution and wastewater collection systems.'
  },
  {
    email: 'bwatts@magnolia.ms.gov',
    display_name: 'Brenda F. Watts',
    job_title: 'Administrative Assistant',
    department: 'Administration',
    role_label: 'Staff',
    phone: '(601) 876-5678 ext. 103',
    birth_date: '1990-01-09',
    bio: 'Brenda provides administrative support to City Hall, assists the public at the front desk, and coordinates scheduling.'
  }
];

// 10 public user profiles — match the resident contacts seeded earlier
const publicProfiles = [
  {
    email: 'dorothy.henderson@email.com',
    display_name: 'Dorothy M. Henderson',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0101',
    birth_date: '1952-06-03',
    bio: 'Long-time Magnolia resident and volunteer with the city beautification committee.'
  },
  {
    email: 'jcausey@email.com',
    display_name: 'James R. Causey',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0102',
    birth_date: '1968-10-19',
    bio: 'Local business owner on Railroad Avenue. Active member of the Downtown Magnolia Association.'
  },
  {
    email: 'p.greer@email.com',
    display_name: 'Patricia A. Greer',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0103',
    birth_date: '1975-03-28',
    bio: 'Parent and school board volunteer. Attends city council meetings regularly.'
  },
  {
    email: 'rdillon@email.com',
    display_name: 'Robert L. Dillon',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0104',
    birth_date: '1944-12-11',
    bio: 'Retired teacher and longtime resident of the Oak Street neighborhood.'
  },
  {
    email: 'evelyn.price@email.com',
    display_name: 'Evelyn C. Price',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0105',
    birth_date: '1960-08-07',
    bio: 'Volunteer at Magnolia Senior Center. Participates in the community garden program.'
  },
  {
    email: 'hwstokes@email.com',
    display_name: 'Harold W. Stokes',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0106',
    birth_date: '1957-02-14',
    bio: 'Owner of Stokes Hardware on Main Street. Serves on the Planning & Zoning Advisory Board.'
  },
  {
    email: 'cnash@email.com',
    display_name: 'Carolyn B. Nash',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0107',
    birth_date: '1982-05-20',
    bio: 'Resident of the Pine Street neighborhood. Youth baseball coach with the Parks & Recreation league.'
  },
  {
    email: 'wcross@email.com',
    display_name: 'Willie F. Cross',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0108',
    birth_date: '1939-09-02',
    bio: 'Retired city employee and historian. Contributor to the Magnolia City Cemetery digitization project.'
  },
  {
    email: 'r.longfellow@email.com',
    display_name: 'Ruth E. Longfellow',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0109',
    birth_date: '1971-11-30',
    bio: 'Nurse at Southwest Mississippi Regional Medical Center. Resident of the Cherry Street area.'
  },
  {
    email: 'gmabry@email.com',
    display_name: 'George T. Mabry',
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '(601) 555-0110',
    birth_date: '1985-07-16',
    bio: 'Contractor and licensed electrician. Frequently works with the city on infrastructure projects.'
  }
];

const insert = db.prepare(`
  INSERT INTO user_profiles
    (email, display_name, job_title, department, role_label, phone, birth_date, avatar_url, bio)
  VALUES
    (@email, @display_name, @job_title, @department, @role_label, @phone, @birth_date, @avatar_url, @bio)
  ON CONFLICT(email) DO UPDATE SET
    display_name = excluded.display_name,
    job_title    = excluded.job_title,
    department   = excluded.department,
    role_label   = excluded.role_label,
    phone        = excluded.phone,
    birth_date   = excluded.birth_date,
    avatar_url   = excluded.avatar_url,
    bio          = excluded.bio,
    updated_at   = CURRENT_TIMESTAMP
`);

const seed = db.transaction(() => {
  for (const p of [...staffProfiles, ...publicProfiles]) {
    insert.run({ ...p, avatar_url: avatar(p.display_name) });
  }
});

seed();
console.log(`Seeded ${staffProfiles.length + publicProfiles.length} user profiles.`);

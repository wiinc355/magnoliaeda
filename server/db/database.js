const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT,
    category TEXT DEFAULT 'General',
    is_active INTEGER DEFAULT 1,
    published_at TEXT,
    expires_at TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    event_date TEXT NOT NULL,
    end_date TEXT,
    category TEXT DEFAULT 'General',
    is_active INTEGER DEFAULT 1,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS personnel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    job_title TEXT,
    department TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS building_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_name TEXT NOT NULL,
    department TEXT,
    street TEXT NOT NULL,
    city TEXT DEFAULT 'Magnolia',
    state TEXT DEFAULT 'MS',
    postal_code TEXT,
    phone TEXT,
    office_hours TEXT,
    map_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add new columns to events if they don't exist yet
['start_time', 'end_time', 'contact_name', 'contact_phone', 'contact_email'].forEach((col) => {
  try { db.exec(`ALTER TABLE events ADD COLUMN ${col} TEXT DEFAULT ''`); } catch (_) {}
});

// Scheduling columns for events and announcements
['publish_at', 'expires_at'].forEach((col) => {
  try { db.exec(`ALTER TABLE events ADD COLUMN ${col} TEXT DEFAULT NULL`); } catch (_) {}
});
// published_at already exists on announcements; add expires_at if missing (older DBs)
['expires_at'].forEach((col) => {
  try { db.exec(`ALTER TABLE announcements ADD COLUMN ${col} TEXT DEFAULT NULL`); } catch (_) {}
});

// Attachment columns
['attachment_url', 'attachment_name'].forEach((col) => {
  try { db.exec(`ALTER TABLE events ADD COLUMN ${col} TEXT DEFAULT ''`); } catch (_) {}
  try { db.exec(`ALTER TABLE announcements ADD COLUMN ${col} TEXT DEFAULT ''`); } catch (_) {}
});

db.exec(`
  CREATE TABLE IF NOT EXISTS marquee_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    link_url TEXT DEFAULT '',
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    publish_at TEXT,
    expires_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS marquee_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    is_enabled INTEGER DEFAULT 1,
    duration_seconds INTEGER DEFAULT 40,
    background_color TEXT DEFAULT '#0a4f90',
    text_color TEXT DEFAULT '#ffffff',
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
db.prepare(`INSERT OR IGNORE INTO marquee_settings (id) VALUES (1)`).run();

db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    channels TEXT NOT NULL DEFAULT 'email',
    categories TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'pending',
    email_confirmed INTEGER DEFAULT 0,
    phone_confirmed INTEGER DEFAULT 0,
    confirm_token TEXT,
    unsubscribe_token TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TEXT,
    unsubscribed_at TEXT,
    notes TEXT DEFAULT ''
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notifications_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_id INTEGER,
    recipient TEXT NOT NULL,
    channel TEXT NOT NULL,
    subject TEXT,
    body TEXT,
    related_type TEXT,
    related_id INTEGER,
    status TEXT NOT NULL DEFAULT 'mocked',
    error TEXT,
    sent_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    job_title TEXT DEFAULT '',
    department TEXT DEFAULT '',
    role_label TEXT DEFAULT 'Public User',
    phone TEXT DEFAULT '',
    birth_date TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;

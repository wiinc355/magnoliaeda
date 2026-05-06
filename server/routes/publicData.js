const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/personnel', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT id, full_name, job_title, department, email, phone
       FROM personnel
       WHERE is_active = 1
       ORDER BY department ASC, full_name ASC`
    ).all();

    res.json(rows);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch personnel' });
  }
});

// Returns ISO-like 'YYYY-MM-DDTHH:MM' in server local time for scheduling comparisons
function localNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

router.get('/events', (req, res) => {
  try {
    const month = String(req.query.month || '').trim();
    const now = localNow();
    let sql = `SELECT id, title, description, location, event_date, end_date,
                      start_time, end_time, category,
                      contact_name, contact_phone, contact_email,
                      attachment_url, attachment_name
               FROM events
               WHERE is_active = 1
                 AND (publish_at IS NULL OR publish_at <= ?)
                 AND (expires_at IS NULL OR expires_at > ?)`;
    const params = [now, now];
    if (month) {
      sql += ` AND (event_date LIKE ? OR end_date LIKE ?)`;
      params.push(`${month}%`, `${month}%`);
    }
    sql += ` ORDER BY event_date ASC, start_time ASC`;
    const rows = db.prepare(sql).all(...params);
    res.json(rows);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/announcements', (req, res) => {
  try {
    const now = localNow();
    const rows = db.prepare(
      `SELECT id, title, body, category, published_at, created_at,
              attachment_url, attachment_name
       FROM announcements
       WHERE is_active = 1
         AND (published_at IS NULL OR published_at <= ?)
         AND (expires_at IS NULL OR expires_at > ?)
       ORDER BY created_at DESC`
    ).all(now, now);
    res.json(rows);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.get('/building-addresses', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT id, building_name, department, street, city, state, postal_code, phone, office_hours, map_url
       FROM building_addresses
       WHERE is_active = 1
       ORDER BY department ASC, building_name ASC`
    ).all();

    res.json(rows);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch building addresses' });
  }
});

module.exports = router;

const express = require('express');
const db = require('../db/database');

const router = express.Router();

// ─── Stats ────────────────────────────────────────────────────────────────────

router.get('/stats', (req, res) => {
  try {
    const totalContacts = db.prepare('SELECT COUNT(*) AS count FROM contacts').get().count;
    const totalProjects = db.prepare('SELECT COUNT(*) AS count FROM projects').get().count;
    const totalAnnouncements = db.prepare('SELECT COUNT(*) AS count FROM announcements WHERE is_active = 1').get().count;
    const totalEvents = db.prepare('SELECT COUNT(*) AS count FROM events WHERE is_active = 1').get().count;
    const totalPersonnel = db.prepare('SELECT COUNT(*) AS count FROM personnel WHERE is_active = 1').get().count;
    const totalBuildings = db.prepare('SELECT COUNT(*) AS count FROM building_addresses WHERE is_active = 1').get().count;
    const recentContacts = db.prepare(
      'SELECT id, full_name, email, phone, created_at FROM contacts ORDER BY id DESC LIMIT 5'
    ).all();
    const upcomingEvents = db.prepare(
      "SELECT id, title, event_date, location FROM events WHERE is_active = 1 AND event_date >= date('now') ORDER BY event_date ASC LIMIT 5"
    ).all();
    res.json({
      totalContacts,
      totalProjects,
      totalAnnouncements,
      totalEvents,
      totalPersonnel,
      totalBuildings,
      recentContacts,
      upcomingEvents
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ─── Announcements ────────────────────────────────────────────────────────────

router.get('/announcements', (req, res) => {
  try {
    const rows = db.prepare(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    ).all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.post('/announcements', (req, res) => {
  const { title, body = '', category = 'General', is_active = 1, publish_at = null, expires_at = null } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const createdBy = req.session && req.session.user ? req.session.user.displayName : 'Staff';
  try {
    const result = db.prepare(
      `INSERT INTO announcements (title, body, category, is_active, published_at, expires_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(title.trim(), String(body), String(category), is_active ? 1 : 0, publish_at || null, expires_at || null, createdBy);
    const row = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.put('/announcements/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  const { title, body = '', category = 'General', is_active = 1, publish_at = null, expires_at = null } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  try {
    const result = db.prepare(
      `UPDATE announcements SET title = ?, body = ?, category = ?, is_active = ?,
       published_at = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(title.trim(), String(body), String(category), is_active ? 1 : 0, publish_at || null, expires_at || null, id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(db.prepare('SELECT * FROM announcements WHERE id = ?').get(id));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update announcement' });
  }
});

router.delete('/announcements/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// ─── Events ───────────────────────────────────────────────────────────────────

router.get('/events', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM events ORDER BY event_date DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.post('/events', (req, res) => {
  const {
    title, description = '', location = '', event_date, end_date = null,
    start_time = '', end_time = '', category = 'General',
    contact_name = '', contact_phone = '', contact_email = '',
    publish_at = null, expires_at = null
  } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!event_date) return res.status(400).json({ error: 'event_date is required' });
  const createdBy = req.session && req.session.user ? req.session.user.displayName : 'Staff';
  try {
    const result = db.prepare(
      `INSERT INTO events
         (title, description, location, event_date, end_date, start_time, end_time,
          category, contact_name, contact_phone, contact_email, publish_at, expires_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      title.trim(), String(description), String(location), event_date, end_date || null,
      String(start_time), String(end_time), String(category),
      String(contact_name), String(contact_phone), String(contact_email),
      publish_at || null, expires_at || null, createdBy
    );
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

router.put('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  const {
    title, description = '', location = '', event_date, end_date = null,
    start_time = '', end_time = '', category = 'General', is_active = 1,
    contact_name = '', contact_phone = '', contact_email = '',
    publish_at = null, expires_at = null
  } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!event_date) return res.status(400).json({ error: 'event_date is required' });
  try {
    const result = db.prepare(
      `UPDATE events SET
         title = ?, description = ?, location = ?, event_date = ?, end_date = ?,
         start_time = ?, end_time = ?, category = ?, is_active = ?,
         contact_name = ?, contact_phone = ?, contact_email = ?,
         publish_at = ?, expires_at = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(
      title.trim(), String(description), String(location), event_date, end_date || null,
      String(start_time), String(end_time), String(category), is_active ? 1 : 0,
      String(contact_name), String(contact_phone), String(contact_email),
      publish_at || null, expires_at || null, id
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(db.prepare('SELECT * FROM events WHERE id = ?').get(id));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete event' });
  }
});

// ─── Personnel ───────────────────────────────────────────────────────────────

router.get('/personnel', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT *
       FROM personnel
       ORDER BY department ASC, full_name ASC`
    ).all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personnel' });
  }
});

router.post('/personnel', (req, res) => {
  const {
    full_name,
    job_title = '',
    department,
    email = '',
    phone = '',
    is_active = 1
  } = req.body;

  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return res.status(400).json({ error: 'full_name is required' });
  }
  if (!department || typeof department !== 'string' || !department.trim()) {
    return res.status(400).json({ error: 'department is required' });
  }

  try {
    const result = db.prepare(
      `INSERT INTO personnel (full_name, job_title, department, email, phone, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      full_name.trim(),
      String(job_title),
      department.trim(),
      String(email),
      String(phone),
      is_active ? 1 : 0
    );

    const row = db.prepare('SELECT * FROM personnel WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create personnel entry' });
  }
});

router.put('/personnel/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

  const {
    full_name,
    job_title = '',
    department,
    email = '',
    phone = '',
    is_active = 1
  } = req.body;

  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return res.status(400).json({ error: 'full_name is required' });
  }
  if (!department || typeof department !== 'string' || !department.trim()) {
    return res.status(400).json({ error: 'department is required' });
  }

  try {
    const result = db.prepare(
      `UPDATE personnel
       SET full_name = ?, job_title = ?, department = ?, email = ?, phone = ?, is_active = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(
      full_name.trim(),
      String(job_title),
      department.trim(),
      String(email),
      String(phone),
      is_active ? 1 : 0,
      id
    );

    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(db.prepare('SELECT * FROM personnel WHERE id = ?').get(id));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update personnel entry' });
  }
});

router.delete('/personnel/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

  try {
    const result = db.prepare('DELETE FROM personnel WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete personnel entry' });
  }
});

// ─── Building Addresses ──────────────────────────────────────────────────────

router.get('/building-addresses', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT *
       FROM building_addresses
       ORDER BY department ASC, building_name ASC`
    ).all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch building addresses' });
  }
});

router.post('/building-addresses', (req, res) => {
  const {
    building_name,
    department = '',
    street,
    city = 'Magnolia',
    state = 'MS',
    postal_code = '',
    phone = '',
    office_hours = '',
    map_url = '',
    is_active = 1
  } = req.body;

  if (!building_name || typeof building_name !== 'string' || !building_name.trim()) {
    return res.status(400).json({ error: 'building_name is required' });
  }
  if (!street || typeof street !== 'string' || !street.trim()) {
    return res.status(400).json({ error: 'street is required' });
  }

  try {
    const result = db.prepare(
      `INSERT INTO building_addresses
      (building_name, department, street, city, state, postal_code, phone, office_hours, map_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      building_name.trim(),
      String(department),
      street.trim(),
      String(city),
      String(state),
      String(postal_code),
      String(phone),
      String(office_hours),
      String(map_url),
      is_active ? 1 : 0
    );

    const row = db.prepare('SELECT * FROM building_addresses WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create building address' });
  }
});

router.put('/building-addresses/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

  const {
    building_name,
    department = '',
    street,
    city = 'Magnolia',
    state = 'MS',
    postal_code = '',
    phone = '',
    office_hours = '',
    map_url = '',
    is_active = 1
  } = req.body;

  if (!building_name || typeof building_name !== 'string' || !building_name.trim()) {
    return res.status(400).json({ error: 'building_name is required' });
  }
  if (!street || typeof street !== 'string' || !street.trim()) {
    return res.status(400).json({ error: 'street is required' });
  }

  try {
    const result = db.prepare(
      `UPDATE building_addresses
       SET building_name = ?, department = ?, street = ?, city = ?, state = ?, postal_code = ?,
           phone = ?, office_hours = ?, map_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(
      building_name.trim(),
      String(department),
      street.trim(),
      String(city),
      String(state),
      String(postal_code),
      String(phone),
      String(office_hours),
      String(map_url),
      is_active ? 1 : 0,
      id
    );

    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(db.prepare('SELECT * FROM building_addresses WHERE id = ?').get(id));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update building address' });
  }
});

router.delete('/building-addresses/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

  try {
    const result = db.prepare('DELETE FROM building_addresses WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete building address' });
  }
});

module.exports = router;

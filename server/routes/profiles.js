const express = require('express');
const db = require('../db/database');
const { requireAuth, requireAnyRole } = require('../middleware/authSession');

const router = express.Router();

function avatarUrl(name) {
  const encoded = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${encoded}&background=0a4f90&color=fff&size=128`;
}

function profileOrDefault(row, email, displayName) {
  if (row) return row;
  return {
    id: null,
    email,
    display_name: displayName || email,
    job_title: '',
    department: '',
    role_label: 'Public User',
    phone: '',
    birth_date: '',
    avatar_url: '',
    bio: '',
    is_active: 1
  };
}

// GET /api/profiles  — admin/staff list all
router.get('/', requireAuth, requireAnyRole(['Admin', 'Staff']), (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    const role = String(req.query.role || '').trim();
    let sql = 'SELECT * FROM user_profiles WHERE is_active = 1';
    const params = [];
    if (q) {
      sql += ' AND (LOWER(display_name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(department) LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (role) {
      sql += ' AND role_label = ?';
      params.push(role);
    }
    sql += ' ORDER BY role_label ASC, display_name ASC';
    const rows = db.prepare(sql).all(...params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// GET /api/profiles/me  — own profile (any authenticated user)
router.get('/me', requireAuth, (req, res) => {
  try {
    const email = req.session.user.email;
    const displayName = req.session.user.displayName;
    const row = db.prepare('SELECT * FROM user_profiles WHERE email = ?').get(email);
    return res.json(profileOrDefault(row, email, displayName));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profiles/me  — update or create own profile
router.put('/me', requireAuth, (req, res) => {
  try {
    const email = req.session.user.email;
    const displayName = req.session.user.displayName;
    const {
      display_name = displayName,
      job_title = '',
      department = '',
      phone = '',
      birth_date = '',
      avatar_url = '',
      bio = ''
    } = req.body;

    if (!display_name || typeof display_name !== 'string' || !display_name.trim()) {
      return res.status(400).json({ error: 'display_name is required' });
    }

    const existing = db.prepare('SELECT id FROM user_profiles WHERE email = ?').get(email);

    if (existing) {
      db.prepare(
        `UPDATE user_profiles
         SET display_name = ?, job_title = ?, department = ?, phone = ?,
             birth_date = ?, avatar_url = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
         WHERE email = ?`
      ).run(
        display_name.trim(), String(job_title), String(department),
        String(phone), String(birth_date), String(avatar_url), String(bio), email
      );
    } else {
      const roles = (req.session.user.roles || []);
      const roleLabel = roles.includes('Admin') ? 'Admin'
        : roles.includes('Staff') ? 'Staff'
        : roles.includes('Department User') ? 'Department User'
        : 'Public User';
      db.prepare(
        `INSERT INTO user_profiles
         (email, display_name, job_title, department, role_label, phone, birth_date, avatar_url, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        email, display_name.trim(), String(job_title), String(department),
        roleLabel, String(phone), String(birth_date), String(avatar_url), String(bio)
      );
    }

    const updated = db.prepare('SELECT * FROM user_profiles WHERE email = ?').get(email);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profiles/:id  — get any profile by id (admin/staff)
router.get('/:id', requireAuth, requireAnyRole(['Admin', 'Staff']), (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const row = db.prepare('SELECT * FROM user_profiles WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    return res.json(row);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = { router, avatarUrl };

const express = require('express');
const crypto = require('crypto');
const db = require('../db/database');
const notifier = require('../lib/notifier');

const router = express.Router();

const ALLOWED_CATEGORIES = [
  'General', 'Events', 'Public Safety', 'Public Works',
  'Emergency', 'Government', 'City Council', 'Holiday',
  'Parks & Recreation', 'Community'
];
const ALLOWED_CHANNELS = ['email', 'sms'];

function token() { return crypto.randomBytes(24).toString('hex'); }

function normalizeChannels(v) {
  const list = Array.isArray(v) ? v : String(v || 'email').split(',');
  return list.map((s) => String(s).trim().toLowerCase()).filter((c) => ALLOWED_CHANNELS.includes(c));
}

function normalizeCategories(v) {
  const list = Array.isArray(v) ? v : [];
  return list.map((s) => String(s).trim()).filter((c) => ALLOWED_CATEGORIES.includes(c));
}

router.post('/subscribe', async (req, res) => {
  const { full_name = '', email = '', phone = '', channels = ['email'], categories = [] } = req.body || {};
  const name = String(full_name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPhone = String(phone).trim();
  const cleanChannels = normalizeChannels(channels);
  const cleanCategories = normalizeCategories(categories);

  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (cleanChannels.length === 0) return res.status(400).json({ error: 'At least one channel (email or SMS) is required' });
  if (cleanChannels.includes('email') && !cleanEmail) return res.status(400).json({ error: 'Email is required when Email channel is selected' });
  if (cleanChannels.includes('sms') && !cleanPhone) return res.status(400).json({ error: 'Phone is required when SMS channel is selected' });
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ error: 'Email address looks invalid' });

  const confirm_token = token();
  const unsubscribe_token = token();

  try {
    if (cleanEmail) {
      const existing = db.prepare(
        `SELECT id, status FROM subscribers WHERE email = ? COLLATE NOCASE`
      ).get(cleanEmail);
      if (existing && existing.status === 'active') {
        return res.status(409).json({ error: 'This email is already subscribed and confirmed.' });
      }
    }

    const result = db.prepare(
      `INSERT INTO subscribers
         (full_name, email, phone, channels, categories, status, confirm_token, unsubscribe_token)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`
    ).run(
      name, cleanEmail, cleanPhone,
      cleanChannels.join(','),
      JSON.stringify(cleanCategories),
      confirm_token, unsubscribe_token
    );

    const row = db.prepare('SELECT * FROM subscribers WHERE id = ?').get(result.lastInsertRowid);
    await notifier.sendConfirmation(row);
    return res.status(201).json({
      success: true,
      message: 'Subscription created. Please check your email (or text messages) for a confirmation link.',
      id: row.id
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create subscription' });
  }
});

router.get('/confirm/:token', (req, res) => {
  const t = String(req.params.token || '').trim();
  if (!t) return res.status(400).json({ error: 'Missing confirmation token' });
  const row = db.prepare(`SELECT * FROM subscribers WHERE confirm_token = ?`).get(t);
  if (!row) return res.status(404).json({ error: 'Invalid or expired confirmation link' });
  if (row.status === 'active') {
    return res.json({ success: true, alreadyConfirmed: true, full_name: row.full_name });
  }
  try {
    db.prepare(
      `UPDATE subscribers SET status = 'active', email_confirmed = 1, phone_confirmed = 1,
              confirmed_at = CURRENT_TIMESTAMP, confirm_token = NULL
        WHERE id = ?`
    ).run(row.id);
    return res.json({ success: true, full_name: row.full_name });
  } catch (_) {
    return res.status(500).json({ error: 'Failed to confirm subscription' });
  }
});

router.get('/unsubscribe/:token', (req, res) => {
  const t = String(req.params.token || '').trim();
  if (!t) return res.status(400).json({ error: 'Missing token' });
  const row = db.prepare(`SELECT * FROM subscribers WHERE unsubscribe_token = ?`).get(t);
  if (!row) return res.status(404).json({ error: 'Invalid or expired link' });
  try {
    db.prepare(
      `UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(row.id);
    return res.json({ success: true, full_name: row.full_name });
  } catch (_) {
    return res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

router.get('/categories', (_req, res) => {
  res.json({ categories: ALLOWED_CATEGORIES, channels: ALLOWED_CHANNELS });
});

// ─── Manage Subscription (subscriber self-service) ────────────────────────────

router.get('/manage/:token', (req, res) => {
  const t = String(req.params.token || '').trim();
  if (!t) return res.status(400).json({ error: 'Missing token' });
  try {
    const row = db.prepare(
      `SELECT id, full_name, email, phone, channels, categories, status FROM subscribers 
        WHERE unsubscribe_token = ?`
    ).get(t);
    if (!row) return res.status(404).json({ error: 'Invalid or expired token' });
    return res.json({
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      phone: row.phone,
      channels: row.channels ? row.channels.split(',') : [],
      categories: row.categories ? JSON.parse(row.categories || '[]') : [],
      status: row.status
    });
  } catch (_) {
    return res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

router.put('/manage/:token', (req, res) => {
  const t = String(req.params.token || '').trim();
  if (!t) return res.status(400).json({ error: 'Missing token' });
  const { full_name, email, phone, channels, categories } = req.body || {};
  
  const name = String(full_name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPhone = String(phone || '').trim();
  const cleanChannels = normalizeChannels(channels || []);
  const cleanCategories = normalizeCategories(categories || []);

  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (cleanChannels.length === 0) return res.status(400).json({ error: 'At least one channel is required' });
  if (cleanChannels.includes('email') && !cleanEmail) return res.status(400).json({ error: 'Email required for email channel' });
  if (cleanChannels.includes('sms') && !cleanPhone) return res.status(400).json({ error: 'Phone required for SMS channel' });
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ error: 'Invalid email' });

  try {
    const row = db.prepare(`SELECT * FROM subscribers WHERE unsubscribe_token = ?`).get(t);
    if (!row) return res.status(404).json({ error: 'Invalid or expired token' });

    // Check if new email already exists and is different
    if (cleanEmail && cleanEmail !== row.email) {
      const existing = db.prepare(
        `SELECT id FROM subscribers WHERE email = ? COLLATE NOCASE AND id != ?`
      ).get(cleanEmail, row.id);
      if (existing) return res.status(409).json({ error: 'This email is already used by another subscription' });
    }

    db.prepare(
      `UPDATE subscribers 
        SET full_name = ?, email = ?, phone = ?, channels = ?, categories = ?
        WHERE unsubscribe_token = ?`
    ).run(
      name, cleanEmail, cleanPhone,
      cleanChannels.join(','),
      JSON.stringify(cleanCategories),
      t
    );

    const updated = db.prepare(
      `SELECT id, full_name, email, phone, channels, categories, status FROM subscribers 
        WHERE unsubscribe_token = ?`
    ).get(t);

    return res.json({
      success: true,
      id: updated.id,
      full_name: updated.full_name,
      email: updated.email,
      phone: updated.phone,
      channels: updated.channels ? updated.channels.split(',') : [],
      categories: updated.categories ? JSON.parse(updated.categories || '[]') : [],
      status: updated.status
    });
  } catch (_) {
    return res.status(500).json({ error: 'Failed to update subscription' });
  }
});

router.delete('/manage/:token', (req, res) => {
  const t = String(req.params.token || '').trim();
  if (!t) return res.status(400).json({ error: 'Missing token' });
  try {
    const row = db.prepare(`SELECT * FROM subscribers WHERE unsubscribe_token = ?`).get(t);
    if (!row) return res.status(404).json({ error: 'Invalid or expired token' });
    
    db.prepare(`DELETE FROM subscribers WHERE unsubscribe_token = ?`).run(t);
    return res.json({ success: true, message: 'Subscription deleted' });
  } catch (_) {
    return res.status(500).json({ error: 'Failed to delete subscription' });
  }
});

module.exports = router;

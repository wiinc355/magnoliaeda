const express = require('express');
const db = require('../db/database');
const notifier = require('../lib/notifier');

const router = express.Router();

router.get('/subscribers', (_req, res) => {
  try {
    const rows = db.prepare(
      `SELECT id, full_name, email, phone, channels, categories, status,
              email_confirmed, phone_confirmed,
              created_at, confirmed_at, unsubscribed_at, notes
         FROM subscribers
        ORDER BY created_at DESC`
    ).all();
    res.json(rows);
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

router.put('/subscribers/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  const allowed = ['active', 'pending', 'rejected', 'unsubscribed'];
  const { status, notes } = req.body || {};
  if (status && !allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    if (status) {
      db.prepare(`UPDATE subscribers SET status = ? WHERE id = ?`).run(status, id);
    }
    if (typeof notes === 'string') {
      db.prepare(`UPDATE subscribers SET notes = ? WHERE id = ?`).run(notes, id);
    }
    const row = db.prepare(`SELECT * FROM subscribers WHERE id = ?`).get(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    return res.json(row);
  } catch (_) {
    return res.status(500).json({ error: 'Failed to update subscriber' });
  }
});

router.delete('/subscribers/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const r = db.prepare(`DELETE FROM subscribers WHERE id = ?`).run(id);
    if (r.changes === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  } catch (_) {
    return res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

router.get('/notifications-log', (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 200, 1000);
    const rows = db.prepare(
      `SELECT id, subscriber_id, recipient, channel, subject, body,
              related_type, related_id, status, error, sent_at
         FROM notifications_log
        ORDER BY id DESC
        LIMIT ?`
    ).all(limit);
    res.json(rows);
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch notifications log' });
  }
});

router.post('/blast', async (req, res) => {
  const { subject = '', body = '', category = null } = req.body || {};
  if (!subject.trim() || !body.trim()) {
    return res.status(400).json({ error: 'Subject and body are required' });
  }
  try {
    const result = await notifier.fanOut({
      category,
      subject: subject.trim(),
      body: body.trim(),
      related_type: 'manual_blast',
      related_id: null
    });
    res.json({ success: true, ...result, mocked: notifier.isMock() });
  } catch (_) {
    res.status(500).json({ error: 'Failed to send blast' });
  }
});

module.exports = router;

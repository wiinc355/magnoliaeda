const express = require('express');
const db = require('../db/database');

const router = express.Router();

function localNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ─── Admin: settings ───────────────────────────────────────────────────────────

router.get('/marquee-settings', (_req, res) => {
  try {
    const row = db.prepare(`SELECT * FROM marquee_settings WHERE id = 1`).get();
    res.json(row);
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch marquee settings' });
  }
});

router.put('/marquee-settings', (req, res) => {
  const { is_enabled, duration_seconds, background_color, text_color } = req.body || {};
  const enabled = is_enabled ? 1 : 0;
  const duration = Math.min(Math.max(Number(duration_seconds) || 40, 5), 240);
  const bg = String(background_color || '#0a4f90').slice(0, 32);
  const tx = String(text_color || '#ffffff').slice(0, 32);
  try {
    db.prepare(
      `UPDATE marquee_settings
          SET is_enabled = ?, duration_seconds = ?, background_color = ?, text_color = ?,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = 1`
    ).run(enabled, duration, bg, tx);
    const row = db.prepare(`SELECT * FROM marquee_settings WHERE id = 1`).get();
    res.json(row);
  } catch (_) {
    res.status(500).json({ error: 'Failed to update marquee settings' });
  }
});

// ─── Admin: messages ───────────────────────────────────────────────────────────

router.get('/marquee-messages', (_req, res) => {
  try {
    const rows = db.prepare(
      `SELECT * FROM marquee_messages
        ORDER BY sort_order ASC, id ASC`
    ).all();
    res.json(rows);
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch marquee messages' });
  }
});

router.post('/marquee-messages', (req, res) => {
  const { text, link_url = '', is_active = 1, sort_order = 0, publish_at = null, expires_at = null } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  try {
    const r = db.prepare(
      `INSERT INTO marquee_messages (text, link_url, is_active, sort_order, publish_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(text.trim(), String(link_url), is_active ? 1 : 0, Number(sort_order) || 0, publish_at || null, expires_at || null);
    const row = db.prepare(`SELECT * FROM marquee_messages WHERE id = ?`).get(r.lastInsertRowid);
    res.status(201).json(row);
  } catch (_) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.put('/marquee-messages/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  const { text, link_url = '', is_active = 1, sort_order = 0, publish_at = null, expires_at = null } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  try {
    const r = db.prepare(
      `UPDATE marquee_messages
          SET text = ?, link_url = ?, is_active = ?, sort_order = ?,
              publish_at = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`
    ).run(text.trim(), String(link_url), is_active ? 1 : 0, Number(sort_order) || 0, publish_at || null, expires_at || null, id);
    if (r.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json(db.prepare(`SELECT * FROM marquee_messages WHERE id = ?`).get(id));
  } catch (_) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

router.delete('/marquee-messages/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const r = db.prepare(`DELETE FROM marquee_messages WHERE id = ?`).run(id);
    if (r.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (_) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Public read — used by site marquee component
function publicMarquee(_req, res) {
  try {
    const settings = db.prepare(`SELECT * FROM marquee_settings WHERE id = 1`).get();
    if (!settings || !settings.is_enabled) {
      return res.json({ enabled: false, messages: [], settings: settings || null });
    }
    const now = localNow();
    const messages = db.prepare(
      `SELECT id, text, link_url
         FROM marquee_messages
        WHERE is_active = 1
          AND (publish_at IS NULL OR publish_at <= ?)
          AND (expires_at IS NULL OR expires_at > ?)
        ORDER BY sort_order ASC, id ASC`
    ).all(now, now);
    res.json({ enabled: messages.length > 0, settings, messages });
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch marquee' });
  }
}

module.exports = { router, publicMarquee };

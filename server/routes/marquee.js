const express = require('express');
const db = require('../db/database');

const router = express.Router();

const SITE_KEYS = new Set(['mainsite', 'ecodevsite']);

function resolveSiteKey(req) {
  const candidate = String(
    (req.query && req.query.site)
      || (req.body && req.body.site_key)
      || req.get('x-site-key')
      || 'mainsite'
  ).trim().toLowerCase();
  return SITE_KEYS.has(candidate) ? candidate : 'mainsite';
}

function stripHtml(input) {
  return String(input || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeStyleJson(value) {
  let parsed = {};
  if (value && typeof value === 'object') parsed = value;
  else if (typeof value === 'string' && value.trim()) {
    try {
      parsed = JSON.parse(value);
    } catch (_) {
      parsed = {};
    }
  }

  const style = {
    fontFamily: String(parsed.fontFamily || '').slice(0, 100),
    fontSizePx: Math.min(Math.max(parseInt(parsed.fontSizePx, 10) || 16, 12), 64),
    textAlign: ['left', 'center', 'right'].includes(String(parsed.textAlign)) ? String(parsed.textAlign) : 'left'
  };

  return JSON.stringify(style);
}

function localNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ─── Admin: settings ───────────────────────────────────────────────────────────

router.get('/marquee-settings', (req, res) => {
  try {
    const siteKey = resolveSiteKey(req);
    const row = db.prepare(`SELECT * FROM marquee_site_settings WHERE site_key = ?`).get(siteKey);
    res.json(row);
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch marquee settings' });
  }
});

router.put('/marquee-settings', (req, res) => {
  const siteKey = resolveSiteKey(req);
  const {
    is_enabled, duration_seconds, background_color, text_color,
    font_weight, font_size_px, text_decoration, text_transform
  } = req.body || {};
  const enabled = is_enabled ? 1 : 0;
  const duration = Math.min(Math.max(Number(duration_seconds) || 40, 5), 240);
  const bg = String(background_color || '#0a4f90').slice(0, 32);
  const tx = String(text_color || '#ffffff').slice(0, 32);
  const weight = String(font_weight) === 'bold' ? 'bold' : 'normal';
  const size = Math.min(Math.max(parseInt(font_size_px, 10) || 15, 10), 40);
  const decoration = String(text_decoration) === 'underline' ? 'underline' : 'none';
  const transform = ['uppercase', 'lowercase'].includes(String(text_transform))
    ? String(text_transform)
    : 'none';
  try {
    db.prepare(
      `UPDATE marquee_site_settings
          SET is_enabled = ?, duration_seconds = ?, background_color = ?, text_color = ?,
              font_weight = ?, font_size_px = ?, text_decoration = ?, text_transform = ?,
              updated_at = CURRENT_TIMESTAMP
        WHERE site_key = ?`
    ).run(enabled, duration, bg, tx, weight, size, decoration, transform, siteKey);
    const row = db.prepare(`SELECT * FROM marquee_site_settings WHERE site_key = ?`).get(siteKey);
    res.json(row);
  } catch (_) {
    res.status(500).json({ error: 'Failed to update marquee settings' });
  }
});

// ─── Admin: messages ───────────────────────────────────────────────────────────

router.get('/marquee-messages', (req, res) => {
  try {
    const siteKey = resolveSiteKey(req);
    const rows = db.prepare(
      `SELECT * FROM marquee_messages
        WHERE site_key = ?
        ORDER BY sort_order ASC, id ASC`
    ).all(siteKey);
    res.json(rows);
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch marquee messages' });
  }
});

router.post('/marquee-messages', (req, res) => {
  const siteKey = resolveSiteKey(req);
  const {
    text,
    rich_text = '',
    text_style_json = '{}',
    link_url = '',
    is_active = 1,
    sort_order = 0,
    publish_at = null,
    expires_at = null
  } = req.body || {};

  const plain = String(text || '').trim() || stripHtml(rich_text);
  if (!plain) {
    return res.status(400).json({ error: 'text is required' });
  }
  try {
    const r = db.prepare(
      `INSERT INTO marquee_messages (site_key, text, rich_text, text_style_json, link_url, is_active, sort_order, publish_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      siteKey,
      plain.slice(0, 600),
      String(rich_text || '').slice(0, 12000),
      normalizeStyleJson(text_style_json),
      String(link_url),
      is_active ? 1 : 0,
      Number(sort_order) || 0,
      publish_at || null,
      expires_at || null
    );
    const row = db.prepare(`SELECT * FROM marquee_messages WHERE id = ?`).get(r.lastInsertRowid);
    res.status(201).json(row);
  } catch (_) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.put('/marquee-messages/:id', (req, res) => {
  const siteKey = resolveSiteKey(req);
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

  const {
    text,
    rich_text = '',
    text_style_json = '{}',
    link_url = '',
    is_active = 1,
    sort_order = 0,
    publish_at = null,
    expires_at = null
  } = req.body || {};

  const plain = String(text || '').trim() || stripHtml(rich_text);
  if (!plain) {
    return res.status(400).json({ error: 'text is required' });
  }
  try {
    const r = db.prepare(
      `UPDATE marquee_messages
          SET text = ?, rich_text = ?, text_style_json = ?, link_url = ?, is_active = ?, sort_order = ?,
              publish_at = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND site_key = ?`
    ).run(
      plain.slice(0, 600),
      String(rich_text || '').slice(0, 12000),
      normalizeStyleJson(text_style_json),
      String(link_url),
      is_active ? 1 : 0,
      Number(sort_order) || 0,
      publish_at || null,
      expires_at || null,
      id,
      siteKey
    );
    if (r.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json(db.prepare(`SELECT * FROM marquee_messages WHERE id = ?`).get(id));
  } catch (_) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

router.delete('/marquee-messages/:id', (req, res) => {
  const siteKey = resolveSiteKey(req);
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const r = db.prepare(`DELETE FROM marquee_messages WHERE id = ? AND site_key = ?`).run(id, siteKey);
    if (r.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (_) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Public read — used by site marquee component
function publicMarquee(req, res) {
  try {
    const siteKey = resolveSiteKey(req);
    const settings = db.prepare(`SELECT * FROM marquee_site_settings WHERE site_key = ?`).get(siteKey);
    if (!settings || !settings.is_enabled) {
      return res.json({ enabled: false, messages: [], settings: settings || null });
    }
    const now = localNow();
    const messages = db.prepare(
      `SELECT id, text, rich_text, text_style_json, link_url
         FROM marquee_messages
        WHERE site_key = ?
          AND is_active = 1
          AND (publish_at IS NULL OR publish_at <= ?)
          AND (expires_at IS NULL OR expires_at > ?)
        ORDER BY sort_order ASC, id ASC`
    ).all(siteKey, now, now);
    res.json({ enabled: messages.length > 0, settings, messages });
  } catch (_) {
    res.status(500).json({ error: 'Failed to fetch marquee' });
  }
}

module.exports = { router, publicMarquee };

/**
 * Notifier abstraction — currently mocks email + SMS by writing to
 * notifications_log. Swap MOCK_MODE off and plug in a real provider
 * (Nodemailer / Twilio) when ready; consumers do not change.
 */

const db = require('../db/database');

const MOCK_MODE = process.env.NOTIFIER_MODE !== 'live';
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

function logSend({ subscriber_id = null, recipient, channel, subject = '', body = '', related_type = null, related_id = null, status = 'mocked', error = null }) {
  try {
    db.prepare(
      `INSERT INTO notifications_log
         (subscriber_id, recipient, channel, subject, body, related_type, related_id, status, error)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(subscriber_id, recipient, channel, subject, body, related_type, related_id, status, error);
  } catch (_) {}
}

async function sendEmail({ subscriber_id, to, subject, body, related_type, related_id }) {
  if (!to) return { status: 'skipped', reason: 'no_address' };
  if (MOCK_MODE) {
    logSend({ subscriber_id, recipient: to, channel: 'email', subject, body, related_type, related_id, status: 'mocked' });
    return { status: 'mocked' };
  }
  return { status: 'mocked' };
}

async function sendSms({ subscriber_id, to, body, related_type, related_id }) {
  if (!to) return { status: 'skipped', reason: 'no_number' };
  if (MOCK_MODE) {
    logSend({ subscriber_id, recipient: to, channel: 'sms', subject: '', body, related_type, related_id, status: 'mocked' });
    return { status: 'mocked' };
  }
  return { status: 'mocked' };
}

function buildConfirmUrl(token) {
  return `${APP_BASE_URL}/enotify/confirm/${encodeURIComponent(token)}`;
}

function buildUnsubscribeUrl(token) {
  return `${APP_BASE_URL}/enotify/unsubscribe/${encodeURIComponent(token)}`;
}

async function sendConfirmation(subscriber) {
  const confirmUrl = buildConfirmUrl(subscriber.confirm_token);
  const channels = String(subscriber.channels || 'email').split(',').map((s) => s.trim()).filter(Boolean);
  const results = {};

  if (channels.includes('email') && subscriber.email) {
    results.email = await sendEmail({
      subscriber_id: subscriber.id,
      to: subscriber.email,
      subject: 'Confirm your City of Magnolia eNotify subscription',
      body:
        `Hello ${subscriber.full_name || ''},\n\n` +
        `Thanks for subscribing to City of Magnolia alerts. ` +
        `Please confirm your subscription by clicking the link below:\n\n` +
        `${confirmUrl}\n\n` +
        `If you did not request this, you can ignore this message.`,
      related_type: 'confirmation',
      related_id: subscriber.id
    });
  }

  if (channels.includes('sms') && subscriber.phone) {
    results.sms = await sendSms({
      subscriber_id: subscriber.id,
      to: subscriber.phone,
      body: `City of Magnolia: confirm your eNotify subscription: ${confirmUrl}`,
      related_type: 'confirmation',
      related_id: subscriber.id
    });
  }

  return results;
}

async function fanOut({ category, subject, body, related_type, related_id }) {
  let rows = [];
  try {
    rows = db.prepare(
      `SELECT id, full_name, email, phone, channels, categories, unsubscribe_token
         FROM subscribers
        WHERE status = 'active'`
    ).all();
  } catch (_) { rows = []; }

  let sent = 0;
  for (const sub of rows) {
    let cats = [];
    try { cats = JSON.parse(sub.categories || '[]'); } catch (_) {}
    if (cats.length && category && !cats.includes(category)) continue;

    const channels = String(sub.channels || 'email').split(',').map((s) => s.trim()).filter(Boolean);
    const unsubUrl = buildUnsubscribeUrl(sub.unsubscribe_token || '');

    if (channels.includes('email') && sub.email) {
      await sendEmail({
        subscriber_id: sub.id,
        to: sub.email,
        subject,
        body: `${body}\n\n— City of Magnolia\nUnsubscribe: ${unsubUrl}`,
        related_type,
        related_id
      });
      sent++;
    }
    if (channels.includes('sms') && sub.phone) {
      const trimmed = body.length > 280 ? `${body.slice(0, 270)}…` : body;
      await sendSms({
        subscriber_id: sub.id,
        to: sub.phone,
        body: `${subject}: ${trimmed} STOP: ${unsubUrl}`,
        related_type,
        related_id
      });
      sent++;
    }
  }
  return { sent, recipients: rows.length };
}

module.exports = {
  sendEmail,
  sendSms,
  sendConfirmation,
  fanOut,
  buildConfirmUrl,
  buildUnsubscribeUrl,
  isMock: () => MOCK_MODE
};

const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const contacts = db
      .prepare(
        `SELECT id, full_name, email, phone, created_at, updated_at
         FROM contacts
         ORDER BY id DESC`
      )
      .all();

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.post('/', (req, res) => {
  const { full_name, email = '', phone = '' } = req.body;

  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return res.status(400).json({ error: 'full_name is required' });
  }

  try {
    const insert = db.prepare(
      'INSERT INTO contacts (full_name, email, phone) VALUES (?, ?, ?)'
    );
    const result = insert.run(full_name.trim(), String(email), String(phone));

    const contact = db
      .prepare(
        `SELECT id, full_name, email, phone, created_at, updated_at
         FROM contacts
         WHERE id = ?`
      )
      .get(result.lastInsertRowid);

    return res.status(201).json(contact);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create contact' });
  }
});

router.put('/:id', (req, res) => {
  const contactId = Number(req.params.id);
  const { full_name, email = '', phone = '' } = req.body;

  if (!Number.isInteger(contactId) || contactId <= 0) {
    return res.status(400).json({ error: 'Invalid contact id' });
  }

  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return res.status(400).json({ error: 'full_name is required' });
  }

  try {
    const update = db.prepare(
      `UPDATE contacts
       SET full_name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    );

    const result = update.run(full_name.trim(), String(email), String(phone), contactId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = db
      .prepare(
        `SELECT id, full_name, email, phone, created_at, updated_at
         FROM contacts
         WHERE id = ?`
      )
      .get(contactId);

    return res.json(contact);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update contact' });
  }
});

router.delete('/:id', (req, res) => {
  const contactId = Number(req.params.id);

  if (!Number.isInteger(contactId) || contactId <= 0) {
    return res.status(400).json({ error: 'Invalid contact id' });
  }

  try {
    const remove = db.prepare('DELETE FROM contacts WHERE id = ?');
    const result = remove.run(contactId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;

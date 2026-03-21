const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const projects = db
      .prepare('SELECT id, name, description, created_at FROM projects ORDER BY id DESC')
      .all();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', (req, res) => {
  const { name, description = '' } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const insert = db.prepare('INSERT INTO projects (name, description) VALUES (?, ?)');
    const result = insert.run(name.trim(), String(description));

    const project = db
      .prepare('SELECT id, name, description, created_at FROM projects WHERE id = ?')
      .get(result.lastInsertRowid);

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/:id', (req, res) => {
  const projectId = Number(req.params.id);
  const { name, description = '' } = req.body;

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(400).json({ error: 'Invalid project id' });
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const update = db.prepare('UPDATE projects SET name = ?, description = ? WHERE id = ?');
    const result = update.run(name.trim(), String(description), projectId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = db
      .prepare('SELECT id, name, description, created_at FROM projects WHERE id = ?')
      .get(projectId);

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/:id', (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(400).json({ error: 'Invalid project id' });
  }

  try {
    const remove = db.prepare('DELETE FROM projects WHERE id = ?');
    const result = remove.run(projectId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;

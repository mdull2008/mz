const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db/schema');

router.get('/', (req, res) => {
  const { q, category } = req.query;
  let where = [];
  const params = [];
  if (q) { where.push('name LIKE ?'); params.push(`%${q}%`); }
  if (category) { where.push('category = ?'); params.push(category); }
  const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const fandoms = db.prepare(`SELECT * FROM fandoms ${whereStr} ORDER BY stories_count DESC LIMIT 50`).all(...params);
  res.json(fandoms);
});

router.post('/', (req, res) => {
  const { name, description, category } = req.body;
  if (!name) return res.status(400).json({ error: 'Название обязательно' });
  const existing = db.prepare('SELECT id FROM fandoms WHERE name = ?').get(name);
  if (existing) return res.json(existing);
  const id = uuid();
  db.prepare('INSERT INTO fandoms (id, name, description, category) VALUES (?,?,?,?)').run(id, name, description || '', category || 'other');
  res.json(db.prepare('SELECT * FROM fandoms WHERE id=?').get(id));
});

module.exports = router;

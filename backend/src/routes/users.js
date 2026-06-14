const router = require('express').Router();
const db = require('../db/schema');
const { authRequired, authOptional } = require('../middleware/auth');

router.get('/:username', authOptional, (req, res) => {
  const user = db.prepare('SELECT id, username, display_name, bio, avatar, banner, location, website, is_writer, followers_count, following_count, stories_count, posts_count, created_at FROM users WHERE username = ?').get(req.params.username.toLowerCase());
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

  let is_following = false;
  if (req.user) {
    const f = db.prepare('SELECT 1 FROM follows WHERE follower_id=? AND following_id=?').get(req.user.id, user.id);
    is_following = !!f;
  }
  res.json({ ...user, is_following });
});

router.post('/:id/follow', authRequired, (req, res) => {
  const target = db.prepare('SELECT id FROM users WHERE id=?').get(req.params.id);
  if (!target) return res.status(404).json({ error: 'Не найдено' });
  if (target.id === req.user.id) return res.status(400).json({ error: 'Нельзя подписаться на себя' });

  const existing = db.prepare('SELECT 1 FROM follows WHERE follower_id=? AND following_id=?').get(req.user.id, target.id);
  if (existing) {
    db.prepare('DELETE FROM follows WHERE follower_id=? AND following_id=?').run(req.user.id, target.id);
    db.prepare('UPDATE users SET followers_count = MAX(0, followers_count-1) WHERE id=?').run(target.id);
    db.prepare('UPDATE users SET following_count = MAX(0, following_count-1) WHERE id=?').run(req.user.id);
    return res.json({ following: false });
  }
  db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?,?)').run(req.user.id, target.id);
  db.prepare('UPDATE users SET followers_count = followers_count+1 WHERE id=?').run(target.id);
  db.prepare('UPDATE users SET following_count = following_count+1 WHERE id=?').run(req.user.id);
  res.json({ following: true });
});

router.get('/:id/followers', authOptional, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const users = db.prepare(`SELECT u.id, u.username, u.display_name, u.bio, u.avatar, u.is_writer, u.followers_count
    FROM follows f JOIN users u ON f.follower_id = u.id WHERE f.following_id = ? LIMIT ? OFFSET ?`).all(req.params.id, limit, offset);
  res.json(users);
});

router.get('/:id/following', authOptional, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const users = db.prepare(`SELECT u.id, u.username, u.display_name, u.bio, u.avatar, u.is_writer, u.followers_count
    FROM follows f JOIN users u ON f.following_id = u.id WHERE f.follower_id = ? LIMIT ? OFFSET ?`).all(req.params.id, limit, offset);
  res.json(users);
});

router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const users = db.prepare(`SELECT id, username, display_name, bio, avatar, is_writer, followers_count FROM users
    WHERE username LIKE ? OR display_name LIKE ? LIMIT 20`).all(`%${q}%`, `%${q}%`);
  res.json(users);
});

module.exports = router;

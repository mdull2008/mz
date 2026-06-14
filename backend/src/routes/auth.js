const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const db = require('../db/schema');
const { JWT_SECRET, authRequired } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { username, display_name, email, password, is_writer } = req.body;
    if (!username || !email || !password || !display_name) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (username.length < 3) return res.status(400).json({ error: 'Имя пользователя минимум 3 символа' });
    if (password.length < 6) return res.status(400).json({ error: 'Пароль минимум 6 символов' });

    const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existing) return res.status(400).json({ error: 'Пользователь уже существует' });

    const hash = await bcrypt.hash(password, 10);
    const id = uuid();
    db.prepare(`INSERT INTO users (id, username, display_name, email, password_hash, is_writer)
                VALUES (?, ?, ?, ?, ?, ?)`).run(id, username.toLowerCase(), display_name, email, hash, is_writer ? 1 : 0);

    const user = db.prepare('SELECT id, username, display_name, email, bio, avatar, banner, is_writer, followers_count, following_count, stories_count, posts_count, created_at FROM users WHERE id = ?').get(id);
    const token = jwt.sign({ id, username: username.toLowerCase() }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(login, login);
    if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль' });

    const { password_hash, ...safe } = user;
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ user: safe, token });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/me', authRequired, (req, res) => {
  const user = db.prepare('SELECT id, username, display_name, email, bio, avatar, banner, location, website, is_writer, followers_count, following_count, stories_count, posts_count, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Не найдено' });
  res.json(user);
});

router.put('/me', authRequired, (req, res) => {
  const { display_name, bio, avatar, banner, location, website } = req.body;
  db.prepare('UPDATE users SET display_name=?, bio=?, avatar=?, banner=?, location=?, website=? WHERE id=?')
    .run(display_name || '', bio || '', avatar || '', banner || '', location || '', website || '', req.user.id);
  const user = db.prepare('SELECT id, username, display_name, email, bio, avatar, banner, location, website, is_writer, followers_count, following_count, stories_count, posts_count, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

module.exports = router;

const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db/schema');
const { authRequired, authOptional } = require('../middleware/auth');

router.get('/', authOptional, (req, res) => {
  const { user_id, page = 1 } = req.query;
  const limit = 20;
  const offset = (parseInt(page) - 1) * limit;
  const params = [];
  let replyFilter = 'WHERE p.reply_to IS NULL';
  if (user_id) { replyFilter = 'WHERE p.user_id = ? AND p.reply_to IS NULL'; params.push(user_id); }

  const posts = db.prepare(`
    SELECT p.*, u.username, u.display_name, u.avatar,
      rp.id as repost_data_id, rp.content as repost_content, rp.created_at as repost_created_at,
      ru.username as repost_username, ru.display_name as repost_display_name, ru.avatar as repost_avatar
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN posts rp ON p.repost_of = rp.id
    LEFT JOIN users ru ON rp.user_id = ru.id
    ${replyFilter}
    ORDER BY p.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const result = posts.map(p => enrichPost(p, req.user?.id));
  res.json(result);
});

router.post('/', authRequired, (req, res) => {
  const { content, images, repost_of, reply_to } = req.body;
  if (!content && !repost_of) return res.status(400).json({ error: 'Текст обязателен' });
  if (content && content.length > 500) return res.status(400).json({ error: 'Максимум 500 символов' });

  const id = uuid();
  db.prepare('INSERT INTO posts (id, user_id, content, images, repost_of, reply_to) VALUES (?,?,?,?,?,?)')
    .run(id, req.user.id, content || '', JSON.stringify(images || []), repost_of || null, reply_to || null);
  db.prepare('UPDATE users SET posts_count=posts_count+1 WHERE id=?').run(req.user.id);

  if (reply_to) db.prepare('UPDATE posts SET replies_count=replies_count+1 WHERE id=?').run(reply_to);
  if (repost_of) db.prepare('UPDATE posts SET reposts_count=reposts_count+1 WHERE id=?').run(repost_of);

  const post = db.prepare(`SELECT p.*, u.username, u.display_name, u.avatar FROM posts p JOIN users u ON p.user_id=u.id WHERE p.id=?`).get(id);
  res.json(enrichPost(post, req.user.id));
});

router.get('/feed', authRequired, (req, res) => {
  const { page = 1 } = req.query;
  const limit = 20;
  const offset = (parseInt(page) - 1) * limit;

  const following = db.prepare('SELECT following_id FROM follows WHERE follower_id=?').all(req.user.id).map(f => f.following_id);
  const ids = [req.user.id, ...following];
  const placeholders = ids.map(() => '?').join(',');

  const posts = db.prepare(`
    SELECT p.*, u.username, u.display_name, u.avatar,
      rp.id as repost_data_id, rp.content as repost_content, rp.created_at as repost_created_at,
      ru.username as repost_username, ru.display_name as repost_display_name, ru.avatar as repost_avatar
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN posts rp ON p.repost_of = rp.id
    LEFT JOIN users ru ON rp.user_id = ru.id
    WHERE p.user_id IN (${placeholders}) AND p.reply_to IS NULL
    ORDER BY p.created_at DESC LIMIT ? OFFSET ?
  `).all(...ids, limit, offset);

  res.json(posts.map(p => enrichPost(p, req.user.id)));
});

router.get('/:id', authOptional, (req, res) => {
  const post = db.prepare(`SELECT p.*, u.username, u.display_name, u.avatar FROM posts p JOIN users u ON p.user_id=u.id WHERE p.id=?`).get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Не найдено' });
  db.prepare('UPDATE posts SET views=views+1 WHERE id=?').run(post.id);

  const replies = db.prepare(`SELECT p.*, u.username, u.display_name, u.avatar FROM posts p JOIN users u ON p.user_id=u.id WHERE p.reply_to=? ORDER BY p.created_at ASC`).all(post.id);
  res.json({ ...enrichPost(post, req.user?.id), replies: replies.map(r => enrichPost(r, req.user?.id)) });
});

router.post('/:id/like', authRequired, (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id=?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Не найдено' });
  const existing = db.prepare('SELECT 1 FROM likes WHERE user_id=? AND entity_type=? AND entity_id=?').get(req.user.id, 'post', post.id);
  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id=? AND entity_type=? AND entity_id=?').run(req.user.id, 'post', post.id);
    db.prepare('UPDATE posts SET likes_count=MAX(0,likes_count-1) WHERE id=?').run(post.id);
    return res.json({ liked: false });
  }
  db.prepare('INSERT INTO likes (user_id, entity_type, entity_id) VALUES (?,?,?)').run(req.user.id, 'post', post.id);
  db.prepare('UPDATE posts SET likes_count=likes_count+1 WHERE id=?').run(post.id);
  res.json({ liked: true });
});

router.delete('/:id', authRequired, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id=?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Не найдено' });
  if (post.user_id !== req.user.id) return res.status(403).json({ error: 'Нет прав' });
  db.prepare('DELETE FROM posts WHERE id=?').run(post.id);
  db.prepare('UPDATE users SET posts_count=MAX(0,posts_count-1) WHERE id=?').run(req.user.id);
  res.json({ success: true });
});

function enrichPost(p, userId) {
  try { p.images = JSON.parse(p.images); } catch { p.images = []; }
  if (userId) {
    p.is_liked = !!db.prepare('SELECT 1 FROM likes WHERE user_id=? AND entity_type=? AND entity_id=?').get(userId, 'post', p.id);
  }
  if (p.repost_data_id) {
    p.repost = {
      id: p.repost_data_id,
      content: p.repost_content,
      created_at: p.repost_created_at,
      username: p.repost_username,
      display_name: p.repost_display_name,
      avatar: p.repost_avatar
    };
  }
  return p;
}

module.exports = router;

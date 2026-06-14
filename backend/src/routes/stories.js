const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db/schema');
const { authRequired, authOptional } = require('../middleware/auth');

function countWords(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

router.get('/', authOptional, (req, res) => {
  const { fandom, tag, rating, status, sort = 'updated', page = 1, q, author } = req.query;
  const limit = 20;
  const offset = (parseInt(page) - 1) * limit;
  let where = ['s.is_published = 1'];
  const params = [];

  if (fandom) { where.push('s.fandom_name LIKE ?'); params.push(`%${fandom}%`); }
  if (tag) { where.push('s.tags LIKE ?'); params.push(`%${tag}%`); }
  if (rating) { where.push('s.rating = ?'); params.push(rating); }
  if (status) { where.push('s.status = ?'); params.push(status); }
  if (q) { where.push('(s.title LIKE ? OR s.summary LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  if (author) { where.push('u.username = ?'); params.push(author.toLowerCase()); }

  const orderMap = { updated: 's.updated_at DESC', views: 's.views DESC', likes: 's.likes_count DESC', newest: 's.created_at DESC' };
  const order = orderMap[sort] || 's.updated_at DESC';

  const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const stories = db.prepare(`
    SELECT s.*, u.username, u.display_name, u.avatar
    FROM stories s JOIN users u ON s.author_id = u.id
    ${whereStr} ORDER BY ${order} LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`SELECT COUNT(*) as c FROM stories s JOIN users u ON s.author_id = u.id ${whereStr}`).get(...params);
  res.json({ stories: stories.map(parseStory), total: total.c, page: parseInt(page), limit });
});

router.post('/', authRequired, (req, res) => {
  const { title, summary, fandom_name, tags, rating, genre, warnings, pairing, language, status, cover_image } = req.body;
  if (!title) return res.status(400).json({ error: 'Название обязательно' });

  const id = uuid();
  db.prepare(`INSERT INTO stories (id, title, summary, author_id, fandom_name, tags, rating, genre, warnings, pairing, language, status, cover_image)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    id, title, summary || '', req.user.id,
    fandom_name || '', JSON.stringify(tags || []),
    rating || 'G', JSON.stringify(genre || []),
    JSON.stringify(warnings || []), pairing || '',
    language || 'Русский', status || 'ongoing', cover_image || ''
  );
  db.prepare('UPDATE users SET stories_count = stories_count+1 WHERE id=?').run(req.user.id);
  const story = db.prepare('SELECT s.*, u.username, u.display_name, u.avatar FROM stories s JOIN users u ON s.author_id=u.id WHERE s.id=?').get(id);
  res.json(parseStory(story));
});

router.get('/:id', authOptional, (req, res) => {
  const story = db.prepare('SELECT s.*, u.username, u.display_name, u.avatar FROM stories s JOIN users u ON s.author_id=u.id WHERE s.id=?').get(req.params.id);
  if (!story) return res.status(404).json({ error: 'Не найдено' });
  db.prepare('UPDATE stories SET views = views+1 WHERE id=?').run(story.id);

  let is_liked = false, is_bookmarked = false;
  if (req.user) {
    is_liked = !!db.prepare('SELECT 1 FROM likes WHERE user_id=? AND entity_type=? AND entity_id=?').get(req.user.id, 'story', story.id);
    is_bookmarked = !!db.prepare('SELECT 1 FROM bookmarks WHERE user_id=? AND story_id=?').get(req.user.id, story.id);
  }
  res.json({ ...parseStory(story), is_liked, is_bookmarked });
});

router.put('/:id', authRequired, (req, res) => {
  const story = db.prepare('SELECT * FROM stories WHERE id=?').get(req.params.id);
  if (!story) return res.status(404).json({ error: 'Не найдено' });
  if (story.author_id !== req.user.id) return res.status(403).json({ error: 'Нет прав' });

  const { title, summary, fandom_name, tags, rating, genre, warnings, pairing, language, status, cover_image } = req.body;
  db.prepare(`UPDATE stories SET title=?, summary=?, fandom_name=?, tags=?, rating=?, genre=?, warnings=?, pairing=?, language=?, status=?, cover_image=?, updated_at=datetime('now') WHERE id=?`)
    .run(title || story.title, summary ?? story.summary, fandom_name ?? story.fandom_name,
      JSON.stringify(tags || JSON.parse(story.tags)),
      rating || story.rating, JSON.stringify(genre || JSON.parse(story.genre)),
      JSON.stringify(warnings || JSON.parse(story.warnings)),
      pairing ?? story.pairing, language || story.language,
      status || story.status, cover_image ?? story.cover_image, story.id);
  const updated = db.prepare('SELECT s.*, u.username, u.display_name, u.avatar FROM stories s JOIN users u ON s.author_id=u.id WHERE s.id=?').get(story.id);
  res.json(parseStory(updated));
});

router.delete('/:id', authRequired, (req, res) => {
  const story = db.prepare('SELECT * FROM stories WHERE id=?').get(req.params.id);
  if (!story) return res.status(404).json({ error: 'Не найдено' });
  if (story.author_id !== req.user.id) return res.status(403).json({ error: 'Нет прав' });
  db.prepare('DELETE FROM stories WHERE id=?').run(story.id);
  db.prepare('UPDATE users SET stories_count = MAX(0, stories_count-1) WHERE id=?').run(req.user.id);
  res.json({ success: true });
});

// Chapters
router.get('/:id/chapters', authOptional, (req, res) => {
  const chapters = db.prepare('SELECT * FROM chapters WHERE story_id=? ORDER BY chapter_number ASC').all(req.params.id);
  res.json(chapters);
});

router.post('/:id/chapters', authRequired, (req, res) => {
  const story = db.prepare('SELECT * FROM stories WHERE id=?').get(req.params.id);
  if (!story) return res.status(404).json({ error: 'Не найдено' });
  if (story.author_id !== req.user.id) return res.status(403).json({ error: 'Нет прав' });

  const { title, content, notes } = req.body;
  if (!content) return res.status(400).json({ error: 'Содержание обязательно' });

  const chapterNum = db.prepare('SELECT MAX(chapter_number) as m FROM chapters WHERE story_id=?').get(story.id).m || 0;
  const wc = countWords(content);
  const id = uuid();
  db.prepare('INSERT INTO chapters (id, story_id, title, content, chapter_number, word_count, notes) VALUES (?,?,?,?,?,?,?)')
    .run(id, story.id, title || `Глава ${chapterNum + 1}`, content, chapterNum + 1, wc, notes || '');

  const totalWC = db.prepare('SELECT SUM(word_count) as s FROM chapters WHERE story_id=?').get(story.id).s || 0;
  db.prepare("UPDATE stories SET chapters_count=chapters_count+1, word_count=?, updated_at=datetime('now') WHERE id=?").run(totalWC, story.id);

  const chapter = db.prepare('SELECT * FROM chapters WHERE id=?').get(id);
  res.json(chapter);
});

router.put('/:id/chapters/:chapterId', authRequired, (req, res) => {
  const story = db.prepare('SELECT * FROM stories WHERE id=?').get(req.params.id);
  if (!story || story.author_id !== req.user.id) return res.status(403).json({ error: 'Нет прав' });
  const { title, content, notes } = req.body;
  const wc = countWords(content);
  db.prepare('UPDATE chapters SET title=?, content=?, notes=?, word_count=? WHERE id=? AND story_id=?')
    .run(title || '', content || '', notes || '', wc, req.params.chapterId, story.id);
  const totalWC = db.prepare('SELECT SUM(word_count) as s FROM chapters WHERE story_id=?').get(story.id).s || 0;
  db.prepare("UPDATE stories SET word_count=?, updated_at=datetime('now') WHERE id=?").run(totalWC, story.id);
  const chapter = db.prepare('SELECT * FROM chapters WHERE id=?').get(req.params.chapterId);
  res.json(chapter);
});

// Likes
router.post('/:id/like', authRequired, (req, res) => {
  const story = db.prepare('SELECT id FROM stories WHERE id=?').get(req.params.id);
  if (!story) return res.status(404).json({ error: 'Не найдено' });
  const existing = db.prepare('SELECT 1 FROM likes WHERE user_id=? AND entity_type=? AND entity_id=?').get(req.user.id, 'story', story.id);
  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id=? AND entity_type=? AND entity_id=?').run(req.user.id, 'story', story.id);
    db.prepare('UPDATE stories SET likes_count=MAX(0,likes_count-1) WHERE id=?').run(story.id);
    return res.json({ liked: false });
  }
  db.prepare('INSERT INTO likes (user_id, entity_type, entity_id) VALUES (?,?,?)').run(req.user.id, 'story', story.id);
  db.prepare('UPDATE stories SET likes_count=likes_count+1 WHERE id=?').run(story.id);
  res.json({ liked: true });
});

// Bookmarks
router.post('/:id/bookmark', authRequired, (req, res) => {
  const story = db.prepare('SELECT id FROM stories WHERE id=?').get(req.params.id);
  if (!story) return res.status(404).json({ error: 'Не найдено' });
  const existing = db.prepare('SELECT 1 FROM bookmarks WHERE user_id=? AND story_id=?').get(req.user.id, story.id);
  if (existing) {
    db.prepare('DELETE FROM bookmarks WHERE user_id=? AND story_id=?').run(req.user.id, story.id);
    db.prepare('UPDATE stories SET bookmarks_count=MAX(0,bookmarks_count-1) WHERE id=?').run(story.id);
    return res.json({ bookmarked: false });
  }
  db.prepare('INSERT INTO bookmarks (user_id, story_id) VALUES (?,?)').run(req.user.id, story.id);
  db.prepare('UPDATE stories SET bookmarks_count=bookmarks_count+1 WHERE id=?').run(story.id);
  res.json({ bookmarked: true });
});

// Comments
router.get('/:id/comments', (req, res) => {
  const comments = db.prepare(`SELECT c.*, u.username, u.display_name, u.avatar
    FROM comments c JOIN users u ON c.user_id=u.id
    WHERE c.entity_type='story' AND c.entity_id=? ORDER BY c.created_at ASC`).all(req.params.id);
  res.json(comments);
});

router.post('/:id/comments', authRequired, (req, res) => {
  const { content, parent_id } = req.body;
  if (!content) return res.status(400).json({ error: 'Текст обязателен' });
  const id = uuid();
  db.prepare('INSERT INTO comments (id, entity_type, entity_id, user_id, parent_id, content) VALUES (?,?,?,?,?,?)')
    .run(id, 'story', req.params.id, req.user.id, parent_id || null, content);
  db.prepare('UPDATE stories SET comments_count=comments_count+1 WHERE id=?').run(req.params.id);
  const comment = db.prepare('SELECT c.*, u.username, u.display_name, u.avatar FROM comments c JOIN users u ON c.user_id=u.id WHERE c.id=?').get(id);
  res.json(comment);
});

function parseStory(s) {
  if (!s) return s;
  try { s.tags = JSON.parse(s.tags); } catch { s.tags = []; }
  try { s.genre = JSON.parse(s.genre); } catch { s.genre = []; }
  try { s.warnings = JSON.parse(s.warnings); } catch { s.warnings = []; }
  return s;
}

module.exports = router;

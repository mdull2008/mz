const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/fandoms', require('./routes/fandoms'));

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ users: [], stories: [], posts: [] });
  const db = require('./db/schema');
  const users = db.prepare('SELECT id, username, display_name, bio, avatar, is_writer FROM users WHERE username LIKE ? OR display_name LIKE ? LIMIT 5').all(`%${q}%`, `%${q}%`);
  const stories = db.prepare('SELECT s.id, s.title, s.summary, s.fandom_name, s.rating, s.word_count, u.username, u.display_name FROM stories s JOIN users u ON s.author_id=u.id WHERE s.title LIKE ? OR s.summary LIKE ? LIMIT 5').all(`%${q}%`, `%${q}%`);
  const posts = db.prepare('SELECT p.id, p.content, p.created_at, u.username, u.display_name, u.avatar FROM posts p JOIN users u ON p.user_id=u.id WHERE p.content LIKE ? LIMIT 5').all(`%${q}%`);
  res.json({ users, stories, posts });
});

// Seed demo data on first run
const db = require('./db/schema');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

async function seed() {
  const existing = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existing) return;

  const hash = await bcrypt.hash('demo1234', 10);

  const users = [
    { id: uuid(), username: 'luna_writer', display_name: 'Луна ✨', bio: 'Пишу о любви, магии и приключениях. Фанатка HP и Marvel', is_writer: 1 },
    { id: uuid(), username: 'darkreader99', display_name: 'Темный Читатель', bio: 'Читаю всё подряд, особенно драму', is_writer: 0 },
    { id: uuid(), username: 'stardust_fic', display_name: 'Звёздная Пыль', bio: 'Автор фанфиков про аниме | 15+ произведений', is_writer: 1 },
  ];

  for (const u of users) {
    db.prepare('INSERT INTO users (id, username, display_name, email, password_hash, bio, is_writer) VALUES (?,?,?,?,?,?,?)')
      .run(u.id, u.username, u.display_name, `${u.username}@demo.com`, hash, u.bio, u.is_writer);
  }

  const stories = [
    {
      id: uuid(), author_id: users[0].id,
      title: 'Между мирами', summary: 'Гермиона случайно попадает в параллельный мир, где Волдеморт победил. Теперь ей нужно найти путь домой вместе с незнакомой версией Малфоя.',
      fandom_name: 'Harry Potter', rating: 'PG-13', status: 'ongoing',
      tags: JSON.stringify(['AU', 'параллельные миры', 'дружба', 'романтика']),
      genre: JSON.stringify(['Приключения', 'Романтика']),
      warnings: JSON.stringify([]),
      pairing: 'Hermione/Draco', word_count: 47832, chapters_count: 12, views: 15420, likes_count: 892
    },
    {
      id: uuid(), author_id: users[2].id,
      title: 'Последний закат Токио', summary: 'История о двух студентах художественного колледжа, которые встречаются на крыше небоскрёба в последний день лета.',
      fandom_name: 'Оригинальное', rating: 'G', status: 'complete',
      tags: JSON.stringify(['Слайс-оф-лайф', 'романтика', 'Токио']),
      genre: JSON.stringify(['Романтика', 'Драма']),
      warnings: JSON.stringify([]),
      pairing: 'OC/OC', word_count: 23100, chapters_count: 5, views: 8930, likes_count: 543
    },
    {
      id: uuid(), author_id: users[0].id,
      title: 'Клинок теней', summary: 'Темный маг Эзра ищет легендарный артефакт, не подозревая что артефакт — это живой человек.',
      fandom_name: 'Оригинальное', rating: 'R', status: 'ongoing',
      tags: JSON.stringify(['тёмное фэнтези', 'магия', 'квест']),
      genre: JSON.stringify(['Фэнтези', 'Приключения', 'Экшн']),
      warnings: JSON.stringify(['Насилие']),
      pairing: '', word_count: 89200, chapters_count: 24, views: 22000, likes_count: 1205
    }
  ];

  for (const s of stories) {
    db.prepare(`INSERT INTO stories (id, title, summary, author_id, fandom_name, tags, rating, genre, warnings, pairing, word_count, chapters_count, views, likes_count, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(s.id, s.title, s.summary, s.author_id, s.fandom_name, s.tags, s.rating, s.genre, s.warnings, s.pairing, s.word_count, s.chapters_count, s.views, s.likes_count, s.status);
  }

  db.prepare('UPDATE users SET stories_count=2 WHERE id=?').run(users[0].id);
  db.prepare('UPDATE users SET stories_count=1 WHERE id=?').run(users[2].id);

  const chapterId = uuid();
  db.prepare('INSERT INTO chapters (id, story_id, title, content, chapter_number, word_count) VALUES (?,?,?,?,?,?)')
    .run(chapterId, stories[0].id, 'Пролог. Зазеркалье',
      `Зеркало разбилось в 23:47 по Гринвичу.\n\nГермиона не успела даже вскрикнуть — мир вокруг неё сложился, как карточный домик, и она оказалась в темноте, где не было ни воздуха, ни света, ни привычного веса собственного тела.\n\nА потом был свет.\n\nРезкий, слепящий, неожиданный — как пощёчина. Она упала на холодный мрамор и закашлялась, вдыхая воздух, который пах пылью и старыми заклинаниями.\n\n— Что за... — она подняла голову и встретилась взглядом с серыми глазами.\n\nМалфой. Но не тот Малфой, которого она знала. Этот был в чёрных мантиях с серебряными застёжками, с осунувшимся лицом и тенями под глазами. И смотрел на неё так, будто видел призрака.\n\n— Грейнджер, — произнёс он тихо. — Ты мертва. Я видел твою казнь три года назад.\n\nГермиона медленно встала, не сводя с него глаз.\n\n— Значит, ты видел казнь другой Гермионы Грейнджер, — ответила она ровным голосом, хотя сердце билось в ушах. — Потому что я только что прошла сквозь разбитое зеркало и понятия не имею, где нахожусь.\n\nТишина растянулась между ними, как струна.\n\n— Зазеркалье, — наконец произнёс он. — Добро пожаловать в мир, где Тёмный Лорд победил.`,
      1, 312);

  const postTexts = [
    { user_id: users[0].id, content: 'Только что написала 3000 слов за один вечер. Музы снизошла 🔥 Новая глава "Между мирами" выйдет завтра! #фанфики #HPfandom' },
    { user_id: users[1].id, content: 'Дочитала "Последний закат Токио" и теперь не могу перестать плакать. Почему такие хорошие фики заканчиваются? 😭' },
    { user_id: users[2].id, content: 'Совет начинающим авторам: прежде чем писать, составьте хотя бы базовый план глав. Это сэкономит вам сотни часов переписывания. Говорю по личному опыту 💡' },
    { user_id: users[0].id, content: 'Горячий вопрос: как вы справляетесь с писательским кризисом? Я обычно перечитываю любимые фанфики для вдохновения 📚' },
    { user_id: users[1].id, content: 'Рейтинг прочитанного за месяц: 47 фанфиков, 312 000 слов. Это нормально? 😅' },
  ];

  for (const p of postTexts) {
    db.prepare('INSERT INTO posts (id, user_id, content) VALUES (?,?,?)').run(uuid(), p.user_id, p.content);
  }
  db.prepare('UPDATE users SET posts_count=2 WHERE id=?').run(users[0].id);
  db.prepare('UPDATE users SET posts_count=2 WHERE id=?').run(users[1].id);
  db.prepare('UPDATE users SET posts_count=1 WHERE id=?').run(users[2].id);

  const fandoms = [
    { id: uuid(), name: 'Harry Potter', category: 'книги', stories_count: 1 },
    { id: uuid(), name: 'Marvel', category: 'кино', stories_count: 0 },
    { id: uuid(), name: 'Наруто', category: 'аниме', stories_count: 0 },
    { id: uuid(), name: 'Атака Титанов', category: 'аниме', stories_count: 0 },
    { id: uuid(), name: 'Оригинальное', category: 'ориджинал', stories_count: 2 },
    { id: uuid(), name: 'Звёздные Войны', category: 'кино', stories_count: 0 },
    { id: uuid(), name: 'Ведьмак', category: 'игры', stories_count: 0 },
  ];
  for (const f of fandoms) {
    db.prepare('INSERT OR IGNORE INTO fandoms (id, name, category, stories_count) VALUES (?,?,?,?)').run(f.id, f.name, f.category, f.stories_count);
  }

  console.log('✅ Demo data seeded');
}

seed().catch(console.error);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

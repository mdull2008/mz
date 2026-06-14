type Story = {
  title: string;
  fandom: string;
  author: string;
  rating: string;
  status: string;
  chapters: number;
  likes: string;
  comments: number;
  description: string;
  tags: string[];
};

type Post = {
  author: string;
  handle: string;
  text: string;
  time: string;
  replies: number;
  reposts: number;
  likes: number;
};

type Writer = {
  name: string;
  handle: string;
  role: string;
  followers: string;
  works: number;
  bio: string;
};

const featuredStories: Story[] = [
  {
    title: "Город после полуночи",
    fandom: "Ориджинал / городское фэнтези",
    author: "Лиса на крыше",
    rating: "PG-13",
    status: "В процессе",
    chapters: 18,
    likes: "12.4k",
    comments: 842,
    description:
      "Детектив, ведьма и говорящий кот расследуют пропажу воспоминаний в городе, где магия работает только после заката.",
    tags: ["магия", "slow burn", "детектив", "юмор"],
  },
  {
    title: "Письма из соседней вселенной",
    fandom: "Научная фантастика",
    author: "Астра Нова",
    rating: "R",
    status: "Завершено",
    chapters: 42,
    likes: "31.8k",
    comments: 2410,
    description:
      "Два пилота с разных линий времени находят способ переписываться через черный ящик разбитого корабля.",
    tags: ["космос", "драма", "романтика", "альтернативная реальность"],
  },
  {
    title: "Король школьного двора",
    fandom: "Повседневность / AU",
    author: "Северный чай",
    rating: "G",
    status: "Обновлено сегодня",
    chapters: 9,
    likes: "8.1k",
    comments: 356,
    description:
      "Легкая комедия о школьном совете, тайном клубе писателей и битве за лучший выпускной спектакль.",
    tags: ["комедия", "школа", "дружба", "флафф"],
  },
];

const feedPosts: Post[] = [
  {
    author: "Лиса на крыше",
    handle: "@roof_fox",
    text: "Выложила новую главу. Там наконец-то сцена с рынком теней, ради которой я две недели собирала заметки.",
    time: "12 мин",
    replies: 43,
    reposts: 118,
    likes: 920,
  },
  {
    author: "Редакторский маяк",
    handle: "@beta_hub",
    text: "Открыли подбор бета-ридеров на длинные работы: фэнтези, слэш, ориджиналы и научная фантастика. Кидайте заявки в клуб.",
    time: "48 мин",
    replies: 16,
    reposts: 74,
    likes: 410,
  },
  {
    author: "Астра Нова",
    handle: "@astra_writes",
    text: "Опрос для читателей: хотите отдельный спин-офф про инженеров станции или лучше бонусные главы от лица антагониста?",
    time: "2 ч",
    replies: 89,
    reposts: 51,
    likes: 1300,
  },
];

const writers: Writer[] = [
  {
    name: "Лиса на крыше",
    handle: "@roof_fox",
    role: "Автор недели",
    followers: "58k",
    works: 27,
    bio: "Пишет городское фэнтези, любит сильные диалоги и живые комментарии читателей.",
  },
  {
    name: "Северный чай",
    handle: "@north_tea",
    role: "Популярный блог",
    followers: "21k",
    works: 14,
    bio: "Ведет дневник черновиков, собирает челленджи и регулярно делает разборы сцен.",
  },
];

const communityStats = [
  ["1.2 млн", "читателей"],
  ["340 тыс.", "историй"],
  ["76 тыс.", "авторов"],
  ["24/7", "живая лента"],
];

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="logo" href="#top" aria-label="ФанТвит на главную">
          <span className="logo-mark">ФТ</span>
          <span>ФанТвит</span>
        </a>
        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#stories">Фанфики</a>
          <a href="#feed">Лента</a>
          <a href="#profiles">Авторы</a>
          <a href="#editor">Написать</a>
        </nav>
        <button className="ghost-button" type="button">
          Войти
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Фанфики + аккаунты + блоги</p>
            <h1>Платформа, где истории живут рядом с авторской лентой.</h1>
            <p className="hero-text">
              Каталог как у крупного фикшен-сообщества, профили авторов,
              микроблоги, подписки, комментарии, подборки и удобный редактор в
              одном интерфейсе.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#editor">
                Начать писать
              </a>
              <a className="secondary-button" href="#stories">
                Смотреть каталог
              </a>
            </div>
          </div>
          <aside className="hero-card" aria-label="Пример публикации">
            <div className="compose-window">
              <div className="window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <h2>Новая глава</h2>
              <p>
                "Город после полуночи" обновлен: глава 18 уже доступна
                подписчикам и всем читателям в каталоге.
              </p>
              <div className="mini-metrics">
                <span>920 лайков</span>
                <span>43 ответа</span>
                <span>18 глава</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="stats-grid" aria-label="Статистика сообщества">
          {communityStats.map(([value, label]) => (
            <div className="stat-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="content-layout">
          <div className="main-column">
            <section className="section-block" id="stories">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Каталог</p>
                  <h2>Популярные фанфики</h2>
                </div>
                <a className="text-link" href="#editor">
                  Добавить работу
                </a>
              </div>
              <div className="story-grid">
                {featuredStories.map((story) => (
                  <article className="story-card" key={story.title}>
                    <div className="story-meta">
                      <span>{story.fandom}</span>
                      <span>{story.rating}</span>
                    </div>
                    <h3>{story.title}</h3>
                    <p>{story.description}</p>
                    <div className="tag-list">
                      {story.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="story-footer">
                      <span>by {story.author}</span>
                      <span>{story.status}</span>
                    </div>
                    <div className="story-stats">
                      <span>{story.chapters} глав</span>
                      <span>{story.likes} лайков</span>
                      <span>{story.comments} комм.</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="section-block" id="feed">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Социальная лента</p>
                  <h2>Блоги авторов и читателей</h2>
                </div>
                <button className="ghost-button compact" type="button">
                  Опубликовать
                </button>
              </div>
              <div className="post-list">
                {feedPosts.map((post) => (
                  <article className="post-card" key={`${post.handle}-${post.time}`}>
                    <div className="avatar" aria-hidden="true">
                      {post.author.slice(0, 1)}
                    </div>
                    <div>
                      <div className="post-header">
                        <strong>{post.author}</strong>
                        <span>{post.handle}</span>
                        <span>{post.time}</span>
                      </div>
                      <p>{post.text}</p>
                      <div className="post-actions" aria-label="Действия поста">
                        <span>{post.replies} ответов</span>
                        <span>{post.reposts} репостов</span>
                        <span>{post.likes} лайков</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="side-column">
            <section className="panel" id="profiles">
              <p className="eyebrow">Профили</p>
              <h2>Авторы в тренде</h2>
              {writers.map((writer) => (
                <article className="writer-card" key={writer.handle}>
                  <div className="writer-topline">
                    <div className="avatar large" aria-hidden="true">
                      {writer.name.slice(0, 1)}
                    </div>
                    <div>
                      <strong>{writer.name}</strong>
                      <span>{writer.handle}</span>
                    </div>
                  </div>
                  <p>{writer.bio}</p>
                  <div className="writer-stats">
                    <span>{writer.role}</span>
                    <span>{writer.followers} подписчиков</span>
                    <span>{writer.works} работ</span>
                  </div>
                </article>
              ))}
            </section>

            <section className="panel">
              <p className="eyebrow">Фильтры</p>
              <h2>Что есть в MVP</h2>
              <ul className="feature-list">
                <li>Каталог с жанрами, рейтингами и статусом работ.</li>
                <li>Личные страницы авторов и читателей.</li>
                <li>Лента коротких постов, репостов и обсуждений.</li>
                <li>Редактор фанфика с публикацией обновлений в блог.</li>
                <li>Комментарии, подписки, лайки и подборки.</li>
              </ul>
            </section>
          </aside>
        </section>

        <section className="editor-section" id="editor">
          <div>
            <p className="eyebrow">Редактор</p>
            <h2>Написать фанфик и сразу рассказать о нем подписчикам</h2>
            <p>
              Черновик, карточка работы и пост в блог собираются в одном месте,
              чтобы автор мог публиковать главы и общаться с аудиторией без
              переключения между сервисами.
            </p>
          </div>
          <form className="editor-form">
            <label>
              Название
              <input type="text" placeholder="Например: Последняя звезда" />
            </label>
            <label>
              Фандом или ориджинал
              <input type="text" placeholder="Фандом, AU, ориджинал" />
            </label>
            <label>
              Аннотация
              <textarea placeholder="Коротко расскажите, о чем история" />
            </label>
            <div className="form-row">
              <label>
                Рейтинг
                <select defaultValue="PG-13">
                  <option>G</option>
                  <option>PG-13</option>
                  <option>R</option>
                  <option>NC-17</option>
                </select>
              </label>
              <label>
                Статус
                <select defaultValue="draft">
                  <option value="draft">Черновик</option>
                  <option value="progress">В процессе</option>
                  <option value="done">Завершено</option>
                </select>
              </label>
            </div>
            <button className="primary-button full-width" type="button">
              Сохранить и опубликовать анонс
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;

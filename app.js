const STORAGE_KEY = "ficwave_state_v1";
const CURRENT_USER_KEY = "ficwave_current_user";

const elements = {
  userSwitcher: document.querySelector("#user-switcher"),
  currentUserBio: document.querySelector("#current-user-bio"),
  statStories: document.querySelector("#stat-stories"),
  statPosts: document.querySelector("#stat-posts"),
  statUsers: document.querySelector("#stat-users"),
  searchInput: document.querySelector("#search-input"),
  fandomFilter: document.querySelector("#fandom-filter"),
  ratingFilter: document.querySelector("#rating-filter"),
  postForm: document.querySelector("#post-form"),
  postBody: document.querySelector("#post-body"),
  postCounter: document.querySelector("#post-counter"),
  feedList: document.querySelector("#feed-list"),
  trendingList: document.querySelector("#trending-list"),
  storyList: document.querySelector("#story-list"),
  storyForm: document.querySelector("#story-form"),
  resetData: document.querySelector("#reset-data"),
  profileCard: document.querySelector("#profile-card"),
  profileActivity: document.querySelector("#profile-activity"),
  storyDialog: document.querySelector("#story-dialog"),
  storyDetail: document.querySelector("#story-detail"),
  dialogClose: document.querySelector(".dialog-close"),
  toast: document.querySelector("#toast"),
};

let state = loadState();
let currentUserId = loadCurrentUserId();
let activeStoryId = null;

function createDefaultState() {
  return {
    version: 1,
    users: [
      {
        id: "u-lira",
        name: "Лира Северная",
        handle: "@lira_writes",
        avatar: "ЛС",
        bio: "Пишу макси про магические академии, люблю медленную романтику и сильные диалоги.",
        followers: 1280,
        following: 148,
      },
      {
        id: "u-ray",
        name: "Рэй Чернов",
        handle: "@ray_reads",
        avatar: "РЧ",
        bio: "Бета-ридер, охочусь за хорошими ориджиналами и оставляю длинные отзывы.",
        followers: 870,
        following: 421,
      },
      {
        id: "u-mira",
        name: "Мира Шторм",
        handle: "@storm_archive",
        avatar: "МШ",
        bio: "Люблю sci-fi, found family и истории, где космос отвечает взаимностью.",
        followers: 2040,
        following: 205,
      },
    ],
    stories: [
      {
        id: "s-echoes",
        authorId: "u-mira",
        title: "Эхо на орбите",
        fandom: "Ориджинал",
        rating: "PG-13",
        status: "В процессе",
        tags: ["sci-fi", "found family", "космос"],
        summary:
          "Экипаж забытой станции ловит сигнал с планеты, которой нет на звездных картах.",
        chapters: [
          {
            title: "Глава 1. Сигнал",
            body:
              "Когда маяк проснулся впервые за семь лет, Ника решила, что это ошибка старого железа.\n\nНо сигнал повторился ровно через девять минут, и каждый раз в нем слышался новый голос.",
          },
          {
            title: "Глава 2. Карта без имени",
            body:
              "На общей палубе погасили свет, чтобы голограмма была четче. Планета висела над столом, синяя и невозможная, как обещание, данное во сне.",
          },
        ],
        likes: ["u-lira", "u-ray"],
        bookmarks: ["u-ray"],
        reviews: [
          {
            id: "r-1",
            userId: "u-ray",
            body: "Очень живой экипаж. Хочу больше сцен с Никой и старым ИИ станции.",
            createdAt: "2026-06-12T15:30:00.000Z",
          },
        ],
        reads: 1842,
        createdAt: "2026-06-10T12:00:00.000Z",
      },
      {
        id: "s-letters",
        authorId: "u-lira",
        title: "Письма из другого мира",
        fandom: "Магическая академия",
        rating: "G",
        status: "Завершен",
        tags: ["романтика", "академия", "дружба"],
        summary:
          "Студентка получает письма от человека, который живет в той же комнате, но на сто лет раньше.",
        chapters: [
          {
            title: "Глава 1. Чернила на подоконнике",
            body:
              "Первое письмо Алиса нашла утром. Оно лежало под чашкой с остывшим чаем, хотя дверь была заперта изнутри.\n\nПочерк был аккуратный, немного старомодный, и начинался с фразы: 'Если вы это читаете, значит комната снова выбрала собеседника'.",
          },
        ],
        likes: ["u-mira", "u-ray"],
        bookmarks: ["u-mira", "u-ray"],
        reviews: [
          {
            id: "r-2",
            userId: "u-mira",
            body: "Очень уютно. Финал первой главы сразу цепляет.",
            createdAt: "2026-06-11T10:20:00.000Z",
          },
        ],
        reads: 2310,
        createdAt: "2026-06-08T09:00:00.000Z",
      },
      {
        id: "s-rain",
        authorId: "u-ray",
        title: "Город, где дождь помнит",
        fandom: "Urban fantasy",
        rating: "R",
        status: "В процессе",
        tags: ["детектив", "мистика", "hurt/comfort"],
        summary:
          "Частный сыщик выясняет, почему дождь стирает людям воспоминания о пропавших.",
        chapters: [
          {
            title: "Глава 1. Мокрый асфальт",
            body:
              "В этом городе зонты продавали вместе с блокнотами. Люди записывали имена близких до того, как выйти под дождь.\n\nЯ не записал никого. И именно поэтому понял, что кого-то потерял.",
          },
        ],
        likes: ["u-lira"],
        bookmarks: ["u-lira"],
        reviews: [],
        reads: 1164,
        createdAt: "2026-06-09T18:00:00.000Z",
      },
    ],
    posts: [
      {
        id: "p-1",
        userId: "u-lira",
        body:
          "Дописываю бонусную сцену к 'Письмам'. Кажется, комната выбрала еще одного собеседника.",
        likes: ["u-mira", "u-ray"],
        reposts: ["u-ray"],
        createdAt: "2026-06-14T16:10:00.000Z",
      },
      {
        id: "p-2",
        userId: "u-ray",
        body:
          "Совет авторам: первая глава не обязана объяснять весь мир. Иногда достаточно вопроса, от которого читатель не сможет уйти.",
        likes: ["u-lira"],
        reposts: [],
        createdAt: "2026-06-14T14:45:00.000Z",
      },
      {
        id: "p-3",
        userId: "u-mira",
        body:
          "Выложила вторую главу 'Эха на орбите'. Там появилась карта, которой не должно существовать.",
        likes: ["u-lira", "u-ray"],
        reposts: ["u-lira"],
        createdAt: "2026-06-13T21:05:00.000Z",
      },
    ],
  };
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createDefaultState();
    }

    const parsed = JSON.parse(stored);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.users)) {
      return createDefaultState();
    }

    return parsed;
  } catch (error) {
    console.warn("Не удалось загрузить сохраненные данные FicWave:", error);
    return createDefaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadCurrentUserId() {
  const storedUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (storedUserId && state.users.some((user) => user.id === storedUserId)) {
    return storedUserId;
  }

  return state.users[0].id;
}

function saveCurrentUserId() {
  localStorage.setItem(CURRENT_USER_KEY, currentUserId);
}

function currentUser() {
  return state.users.find((user) => user.id === currentUserId) || state.users[0];
}

function findUser(userId) {
  return state.users.find((user) => user.id === userId) || state.users[0];
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatText(value) {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function pluralizeRu(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function toggleInArray(list, value) {
  const index = list.indexOf(value);
  if (index >= 0) {
    list.splice(index, 1);
    return false;
  }

  list.push(value);
  return true;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2400);
}

function renderUserSwitcher() {
  elements.userSwitcher.innerHTML = state.users
    .map((user) => `<option value="${user.id}">${escapeHtml(user.name)} ${escapeHtml(user.handle)}</option>`)
    .join("");
  elements.userSwitcher.value = currentUserId;
  elements.currentUserBio.textContent = currentUser().bio;
}

function renderStats() {
  elements.statStories.textContent = state.stories.length;
  elements.statPosts.textContent = state.posts.length;
  elements.statUsers.textContent = state.users.length;
}

function renderFilters() {
  const selectedFandom = elements.fandomFilter.value;
  const fandoms = [...new Set(state.stories.map((story) => story.fandom))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );

  elements.fandomFilter.innerHTML = [
    '<option value="">Все фандомы</option>',
    ...fandoms.map((fandom) => `<option value="${escapeHtml(fandom)}">${escapeHtml(fandom)}</option>`),
  ].join("");

  if (fandoms.includes(selectedFandom)) {
    elements.fandomFilter.value = selectedFandom;
  }
}

function renderFeed() {
  const sortedPosts = [...state.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!sortedPosts.length) {
    elements.feedList.innerHTML = '<div class="empty-state">В ленте пока нет постов.</div>';
    return;
  }

  elements.feedList.innerHTML = sortedPosts.map(renderPost).join("");
}

function renderPost(post) {
  const author = findUser(post.userId);
  const liked = post.likes.includes(currentUserId);
  const reposted = post.reposts.includes(currentUserId);

  return `
    <article class="post">
      <div class="post__author">
        <span class="avatar">${escapeHtml(author.avatar)}</span>
        <div class="author-meta">
          <strong>${escapeHtml(author.name)}</strong>
          <span>${escapeHtml(author.handle)} · ${formatDate(post.createdAt)}</span>
        </div>
      </div>
      <div class="post__body">${formatText(post.body)}</div>
      <div class="post__actions">
        <button class="action-button ${liked ? "active" : ""}" data-action="like-post" data-id="${post.id}">
          ${liked ? "Нравится" : "Лайк"} · ${post.likes.length}
        </button>
        <button class="action-button ${reposted ? "active" : ""}" data-action="repost-post" data-id="${post.id}">
          Репост · ${post.reposts.length}
        </button>
      </div>
    </article>
  `;
}

function filteredStories() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const fandom = elements.fandomFilter.value;
  const rating = elements.ratingFilter.value;

  return state.stories
    .filter((story) => {
      const author = findUser(story.authorId);
      const haystack = [
        story.title,
        story.fandom,
        story.rating,
        story.status,
        story.summary,
        author.name,
        author.handle,
        ...story.tags,
      ]
        .join(" ")
        .toLowerCase();

      return (!query || haystack.includes(query)) && (!fandom || story.fandom === fandom) && (!rating || story.rating === rating);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function renderStories() {
  const stories = filteredStories();

  if (!stories.length) {
    elements.storyList.innerHTML = '<div class="empty-state">Ничего не найдено. Попробуйте другой запрос.</div>';
    return;
  }

  elements.storyList.innerHTML = stories.map(renderStoryCard).join("");
}

function renderStoryCard(story) {
  const author = findUser(story.authorId);
  const liked = story.likes.includes(currentUserId);
  const bookmarked = story.bookmarks.includes(currentUserId);
  const chapterWord = pluralizeRu(story.chapters.length, "глава", "главы", "глав");
  const reviewWord = pluralizeRu(story.reviews.length, "отзыв", "отзыва", "отзывов");

  return `
    <article class="story-card">
      <div class="story-card__top">
        <span class="avatar">${escapeHtml(author.avatar)}</span>
        <div class="author-meta">
          <strong>${escapeHtml(author.name)}</strong>
          <span>${escapeHtml(author.handle)} · ${formatDate(story.createdAt)}</span>
        </div>
      </div>
      <div>
        <span class="eyebrow">${escapeHtml(story.fandom)}</span>
        <h3>${escapeHtml(story.title)}</h3>
      </div>
      <p class="story-card__summary">${escapeHtml(story.summary)}</p>
      <div class="tag-list">
        <span class="tag">${escapeHtml(story.rating)}</span>
        <span class="tag">${escapeHtml(story.status)}</span>
        ${story.tags.map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="meta-row">
        <span>${story.chapters.length} ${chapterWord}</span>
        <span>${story.reads.toLocaleString("ru-RU")} прочтений</span>
        <span>${story.reviews.length} ${reviewWord}</span>
      </div>
      <div class="story-card__actions">
        <button class="button button--primary" data-action="open-story" data-id="${story.id}">Читать</button>
        <button class="action-button ${liked ? "active" : ""}" data-action="like-story" data-id="${story.id}">
          Лайк · ${story.likes.length}
        </button>
        <button class="action-button ${bookmarked ? "active" : ""}" data-action="bookmark-story" data-id="${story.id}">
          ${bookmarked ? "В избранном" : "В избранное"}
        </button>
      </div>
    </article>
  `;
}

function renderTrending() {
  const trending = [...state.stories]
    .sort((a, b) => b.reads + b.likes.length * 40 - (a.reads + a.likes.length * 40))
    .slice(0, 3);

  elements.trendingList.innerHTML = trending
    .map((story, index) => {
      const author = findUser(story.authorId);
      return `
        <button class="trend-card" type="button" data-action="open-story" data-id="${story.id}">
          <span class="eyebrow">#${index + 1} · ${escapeHtml(story.fandom)}</span>
          <strong>${escapeHtml(story.title)}</strong>
          <span class="muted">${escapeHtml(author.name)} · ${story.reads.toLocaleString("ru-RU")} прочтений</span>
        </button>
      `;
    })
    .join("");
}

function renderProfile() {
  const user = currentUser();
  const userStories = state.stories.filter((story) => story.authorId === user.id);
  const userPosts = state.posts.filter((post) => post.userId === user.id);
  const bookmarks = state.stories.filter((story) => story.bookmarks.includes(user.id));
  const totalReads = userStories.reduce((sum, story) => sum + story.reads, 0);

  elements.profileCard.innerHTML = `
    <div class="profile-card__header">
      <span class="avatar">${escapeHtml(user.avatar)}</span>
      <div>
        <h2>${escapeHtml(user.name)}</h2>
        <p class="muted">${escapeHtml(user.handle)}</p>
      </div>
      <p>${escapeHtml(user.bio)}</p>
      <div class="profile-stats">
        <article><strong>${user.followers.toLocaleString("ru-RU")}</strong><span class="muted">читателей</span></article>
        <article><strong>${user.following.toLocaleString("ru-RU")}</strong><span class="muted">подписок</span></article>
        <article><strong>${totalReads.toLocaleString("ru-RU")}</strong><span class="muted">прочтений</span></article>
      </div>
    </div>
  `;

  elements.profileActivity.innerHTML = `
    <section class="activity-section">
      <h3>Работы автора</h3>
      ${
        userStories.length
          ? userStories.map(renderCompactStory).join("")
          : '<div class="empty-state">У этого профиля пока нет опубликованных работ.</div>'
      }
    </section>
    <section class="activity-section">
      <h3>Посты</h3>
      ${userPosts.length ? userPosts.map(renderPost).join("") : '<div class="empty-state">Постов пока нет.</div>'}
    </section>
    <section class="activity-section">
      <h3>Избранное</h3>
      ${
        bookmarks.length
          ? bookmarks.map(renderCompactStory).join("")
          : '<div class="empty-state">В избранном пока ничего нет.</div>'
      }
    </section>
  `;
}

function renderCompactStory(story) {
  return `
    <article class="trend-card">
      <span class="eyebrow">${escapeHtml(story.fandom)} · ${escapeHtml(story.rating)}</span>
      <strong>${escapeHtml(story.title)}</strong>
      <span class="muted">${escapeHtml(story.summary)}</span>
      <button class="button button--ghost" type="button" data-action="open-story" data-id="${story.id}">Открыть</button>
    </article>
  `;
}

function renderStoryDetail(story) {
  const author = findUser(story.authorId);
  const liked = story.likes.includes(currentUserId);
  const bookmarked = story.bookmarks.includes(currentUserId);

  elements.storyDetail.innerHTML = `
    <header>
      <span class="eyebrow">${escapeHtml(story.fandom)}</span>
      <h2>${escapeHtml(story.title)}</h2>
      <div class="story-card__top">
        <span class="avatar">${escapeHtml(author.avatar)}</span>
        <div class="author-meta">
          <strong>${escapeHtml(author.name)}</strong>
          <span>${escapeHtml(author.handle)} · ${escapeHtml(story.rating)} · ${escapeHtml(story.status)}</span>
        </div>
      </div>
      <p class="story-card__summary">${escapeHtml(story.summary)}</p>
      <div class="tag-list">${story.tags.map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="story-card__actions">
        <button class="action-button ${liked ? "active" : ""}" data-action="like-story" data-id="${story.id}">
          Лайк · ${story.likes.length}
        </button>
        <button class="action-button ${bookmarked ? "active" : ""}" data-action="bookmark-story" data-id="${story.id}">
          ${bookmarked ? "В избранном" : "В избранное"}
        </button>
      </div>
    </header>
    <section>
      ${story.chapters
        .map(
          (chapter) => `
          <article class="chapter">
            <h3>${escapeHtml(chapter.title)}</h3>
            ${formatText(chapter.body)}
          </article>
        `,
        )
        .join("")}
    </section>
    <section class="activity-section">
      <h3>Отзывы</h3>
      <form class="review-form" id="review-form">
        <label>
          Новый отзыв
          <textarea name="review" rows="3" placeholder="Что понравилось? Что хочется увидеть дальше?" required></textarea>
        </label>
        <button class="button button--primary" type="submit">Оставить отзыв</button>
      </form>
      <div class="feed">
        ${
          story.reviews.length
            ? story.reviews
                .map((review) => {
                  const reviewer = findUser(review.userId);
                  return `
                    <article class="review">
                      <div class="review__top">
                        <span class="avatar">${escapeHtml(reviewer.avatar)}</span>
                        <div class="author-meta">
                          <strong>${escapeHtml(reviewer.name)}</strong>
                          <span>${escapeHtml(reviewer.handle)} · ${formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                      ${formatText(review.body)}
                    </article>
                  `;
                })
                .join("")
            : '<div class="empty-state">Отзывов пока нет. Станьте первым читателем.</div>'
        }
      </div>
    </section>
  `;
}

function renderAll() {
  renderUserSwitcher();
  renderStats();
  renderFilters();
  renderFeed();
  renderStories();
  renderTrending();
  renderProfile();
}

function setRoute(routeName) {
  const safeRoute = ["home", "catalog", "write", "profile"].includes(routeName) ? routeName : "home";

  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("active", view.dataset.view === safeRoute);
  });

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === safeRoute);
  });
}

function syncRouteFromHash() {
  setRoute(window.location.hash.replace("#", "") || "home");
}

function openStory(storyId) {
  const story = state.stories.find((item) => item.id === storyId);
  if (!story) return;

  activeStoryId = storyId;
  story.reads += 1;
  saveState();
  renderStoryDetail(story);
  renderStats();
  renderStories();
  renderTrending();
  elements.storyDialog.showModal();
}

function handleStoryAction(action, storyId) {
  const story = state.stories.find((item) => item.id === storyId);
  if (!story) return;

  if (action === "like-story") {
    const liked = toggleInArray(story.likes, currentUserId);
    showToast(liked ? "Лайк добавлен" : "Лайк убран");
  }

  if (action === "bookmark-story") {
    const bookmarked = toggleInArray(story.bookmarks, currentUserId);
    showToast(bookmarked ? "Добавлено в избранное" : "Убрано из избранного");
  }

  saveState();
  renderAll();
  if (activeStoryId === storyId && elements.storyDialog.open) {
    renderStoryDetail(story);
  }
}

function handleDelegatedClick(event) {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;

  const { action, id } = actionElement.dataset;

  if (action === "open-story") {
    openStory(id);
    return;
  }

  if (action === "like-story" || action === "bookmark-story") {
    handleStoryAction(action, id);
    return;
  }

  if (action === "like-post" || action === "repost-post") {
    const post = state.posts.find((item) => item.id === id);
    if (!post) return;

    if (action === "like-post") {
      const liked = toggleInArray(post.likes, currentUserId);
      showToast(liked ? "Пост понравился" : "Лайк поста убран");
    } else {
      const reposted = toggleInArray(post.reposts, currentUserId);
      showToast(reposted ? "Репост добавлен" : "Репост убран");
    }

    saveState();
    renderAll();
  }
}

function bindEvents() {
  window.addEventListener("hashchange", syncRouteFromHash);
  document.addEventListener("click", handleDelegatedClick);

  elements.userSwitcher.addEventListener("change", (event) => {
    currentUserId = event.target.value;
    saveCurrentUserId();
    renderAll();
    showToast(`Аккаунт переключен: ${currentUser().name}`);
  });

  elements.searchInput.addEventListener("input", renderStories);
  elements.fandomFilter.addEventListener("change", renderStories);
  elements.ratingFilter.addEventListener("change", renderStories);

  elements.postBody.addEventListener("input", () => {
    elements.postCounter.textContent = elements.postBody.value.length;
  });

  elements.postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = elements.postBody.value.trim();
    if (!body) return;

    state.posts.unshift({
      id: createId("p"),
      userId: currentUserId,
      body,
      likes: [],
      reposts: [],
      createdAt: new Date().toISOString(),
    });

    elements.postBody.value = "";
    elements.postCounter.textContent = "0";
    saveState();
    renderAll();
    showToast("Пост опубликован");
  });

  elements.storyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.storyForm);
    const title = formData.get("title").trim();
    const fandom = formData.get("fandom").trim();
    const rating = formData.get("rating");
    const status = formData.get("status");
    const tags = formData
      .get("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const summary = formData.get("summary").trim();
    const chapter = formData.get("chapter").trim();

    if (!title || !fandom || !summary || !chapter) return;

    const story = {
      id: createId("s"),
      authorId: currentUserId,
      title,
      fandom,
      rating,
      status,
      tags,
      summary,
      chapters: [{ title: "Глава 1", body: chapter }],
      likes: [],
      bookmarks: [],
      reviews: [],
      reads: 0,
      createdAt: new Date().toISOString(),
    };

    state.stories.unshift(story);
    state.posts.unshift({
      id: createId("p"),
      userId: currentUserId,
      body: `Я опубликовал(а) новую работу: «${title}». Заходите читать и оставлять отзывы!`,
      likes: [],
      reposts: [],
      createdAt: new Date().toISOString(),
    });

    elements.storyForm.reset();
    saveState();
    renderAll();
    window.location.hash = "catalog";
    showToast("Фанфик опубликован");
  });

  elements.storyDetail.addEventListener("submit", (event) => {
    if (event.target.id !== "review-form") return;
    event.preventDefault();

    const story = state.stories.find((item) => item.id === activeStoryId);
    const reviewField = event.target.elements.review;
    const body = reviewField.value.trim();
    if (!story || !body) return;

    story.reviews.unshift({
      id: createId("r"),
      userId: currentUserId,
      body,
      createdAt: new Date().toISOString(),
    });

    reviewField.value = "";
    saveState();
    renderAll();
    renderStoryDetail(story);
    showToast("Отзыв добавлен");
  });

  elements.dialogClose.addEventListener("click", () => {
    elements.storyDialog.close();
    activeStoryId = null;
  });

  elements.storyDialog.addEventListener("click", (event) => {
    if (event.target === elements.storyDialog) {
      elements.storyDialog.close();
      activeStoryId = null;
    }
  });

  elements.resetData.addEventListener("click", () => {
    state = createDefaultState();
    currentUserId = state.users[0].id;
    saveState();
    saveCurrentUserId();
    renderAll();
    showToast("Демо-данные восстановлены");
  });
}

bindEvents();
syncRouteFromHash();
renderAll();

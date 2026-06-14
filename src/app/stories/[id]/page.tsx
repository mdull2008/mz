import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseTags, formatDate } from "@/lib/utils";
import {
  toggleStoryLikeAction,
  toggleBookmarkAction,
  addChapterAction,
} from "@/lib/actions";
import CommentForm from "@/components/CommentForm";

type Params = Promise<{ id: string }>;

export default async function StoryPage({ params }: { params: Params }) {
  const { id } = await params;
  const session = await getSession();

  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      user: { select: { username: true, displayName: true, bio: true } },
      chapters: { orderBy: { number: "asc" } },
      likes: { select: { userId: true } },
      bookmarks: session ? { where: { userId: session.id } } : false,
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { username: true, displayName: true } },
        },
      },
    },
  });

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Фанфик не найден</h1>
        <Link href="/stories" className="text-primary mt-4 inline-block hover:underline">
          ← К каталогу
        </Link>
      </div>
    );
  }

  const isAuthor = session?.id === story.userId;
  const isLiked = session
    ? story.likes.some((l) => l.userId === session.id)
    : false;
  const isBookmarked =
    session && story.bookmarks
      ? (story.bookmarks as { id: string }[]).length > 0
      : false;
  const tags = parseTags(story.tags);
  const totalWords = story.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/stories" className="text-sm text-muted hover:text-foreground">
        ← Все фанфики
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold">{story.title}</h1>
        <p className="text-muted mt-2">
          Автор:{" "}
          <Link href={`/profile/${story.user.username}`} className="text-primary hover:underline">
            {story.user.displayName}
          </Link>
          {" · "}Обновлено {formatDate(story.updatedAt)}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="tag">{story.fandom}</span>
          <span className="tag">{story.rating}</span>
          <span className="tag">
            {story.status === "complete" ? "Завершён" : "В процессе"}
          </span>
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 text-foreground/80 leading-relaxed">{story.summary}</p>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted">
          <span>{story.chapters.length} глав</span>
          <span>{totalWords.toLocaleString("ru-RU")} слов</span>
          <span>♥ {story.likes.length}</span>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          {story.chapters.length > 0 && (
            <Link
              href={`/stories/${story.id}/chapter/${story.chapters[0].id}`}
              className="btn-primary"
            >
              Читать с начала
            </Link>
          )}
          {session && (
            <>
              <form action={toggleStoryLikeAction.bind(null, story.id)}>
                <button type="submit" className={isLiked ? "btn-primary" : "btn-secondary"}>
                  {isLiked ? "♥ Нравится" : "♡ Нравится"}
                </button>
              </form>
              <form action={toggleBookmarkAction.bind(null, story.id)}>
                <button type="submit" className="btn-secondary">
                  {isBookmarked ? "🔖 В закладках" : "🔖 Закладка"}
                </button>
              </form>
            </>
          )}
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Оглавление</h2>
        <div className="card divide-y divide-border">
          {story.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/stories/${story.id}/chapter/${chapter.id}`}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:text-primary transition-colors"
            >
              <span>
                Глава {chapter.number}: {chapter.title}
              </span>
              <span className="text-sm text-muted">
                {chapter.wordCount.toLocaleString("ru-RU")} слов
              </span>
            </Link>
          ))}
        </div>
      </section>

      {isAuthor && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Добавить главу</h2>
          <form action={addChapterAction.bind(null, story.id)} className="card space-y-4">
            <input
              name="title"
              placeholder="Название главы"
              className="input-field"
              required
            />
            <textarea
              name="content"
              placeholder="Текст главы..."
              className="input-field min-h-[300px]"
              required
            />
            <button type="submit" className="btn-primary">
              Опубликовать главу
            </button>
          </form>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Комментарии ({story.comments.length})
        </h2>
        {session && (
          <div className="mb-4">
            <CommentForm storyId={story.id} />
          </div>
        )}
        <div className="space-y-3">
          {story.comments.map((comment) => (
            <div key={comment.id} className="card text-sm">
              <Link
                href={`/profile/${comment.user.username}`}
                className="font-semibold hover:text-primary"
              >
                {comment.user.displayName}
              </Link>
              <p className="mt-1 text-foreground/80">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

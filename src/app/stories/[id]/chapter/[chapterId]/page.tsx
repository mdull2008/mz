import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import CommentForm from "@/components/CommentForm";

type Params = Promise<{ id: string; chapterId: string }>;

export default async function ChapterPage({ params }: { params: Params }) {
  const { id, chapterId } = await params;
  const session = await getSession();

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      story: {
        include: {
          user: { select: { username: true, displayName: true } },
          chapters: { orderBy: { number: "asc" }, select: { id: true, number: true, title: true } },
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { username: true, displayName: true } },
        },
      },
    },
  });

  if (!chapter || chapter.storyId !== id) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Глава не найдена</h1>
      </div>
    );
  }

  const { story } = chapter;
  const currentIndex = story.chapters.findIndex((ch) => ch.id === chapterId);
  const prevChapter = currentIndex > 0 ? story.chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < story.chapters.length - 1 ? story.chapters[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-muted mb-6">
        <Link href="/stories" className="hover:text-foreground">
          Фанфики
        </Link>
        {" / "}
        <Link href={`/stories/${story.id}`} className="hover:text-foreground">
          {story.title}
        </Link>
        {" / "}
        <span className="text-foreground">Глава {chapter.number}</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold">
          Глава {chapter.number}: {chapter.title}
        </h1>
        <p className="text-sm text-muted mt-2">
          <Link href={`/profile/${story.user.username}`} className="hover:text-primary">
            {story.user.displayName}
          </Link>
          {" · "}
          {chapter.wordCount.toLocaleString("ru-RU")} слов
        </p>
      </header>

      <article className="prose-story mb-12">{chapter.content}</article>

      <div className="flex justify-between gap-4 py-6 border-t border-b border-border">
        {prevChapter ? (
          <Link
            href={`/stories/${story.id}/chapter/${prevChapter.id}`}
            className="btn-secondary text-sm"
          >
            ← Глава {prevChapter.number}
          </Link>
        ) : (
          <div />
        )}
        <Link href={`/stories/${story.id}`} className="btn-secondary text-sm">
          Оглавление
        </Link>
        {nextChapter ? (
          <Link
            href={`/stories/${story.id}/chapter/${nextChapter.id}`}
            className="btn-primary text-sm"
          >
            Глава {nextChapter.number} →
          </Link>
        ) : (
          <div />
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">
          Комментарии к главе ({chapter.comments.length})
        </h2>
        {session && (
          <div className="mb-4">
            <CommentForm chapterId={chapter.id} storyId={story.id} />
          </div>
        )}
        <div className="space-y-3">
          {chapter.comments.map((comment) => (
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

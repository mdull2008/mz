import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StoryCard from "@/components/StoryCard";

export default async function HomePage() {
  const session = await getSession();

  const recentStories = await prisma.story.findMany({
    take: 6,
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { username: true, displayName: true } },
      chapters: { select: { id: true } },
      likes: { select: { id: true } },
    },
  });

  const stats = await Promise.all([
    prisma.user.count(),
    prisma.story.count(),
    prisma.post.count(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              Фанфики и{" "}
              <span className="gradient-text">соцсеть</span> в одном месте
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              FicPulse объединяет лучшее из Фикбука и Twitter: пишите многостраничные
              фанфики с главами, ведите блог, подписывайтесь на авторов и общайтесь
              с читателями в ленте.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {session ? (
                <>
                  <Link href="/feed" className="btn-primary px-6 py-3">
                    Открыть ленту
                  </Link>
                  <Link href="/write" className="btn-secondary px-6 py-3">
                    Написать фанфик
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="btn-primary px-6 py-3">
                    Начать бесплатно
                  </Link>
                  <Link href="/stories" className="btn-secondary px-6 py-3">
                    Читать фанфики
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg">
            <div className="card text-center">
              <div className="text-3xl font-bold gradient-text">{stats[0]}</div>
              <div className="text-sm text-muted mt-1">авторов</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold gradient-text">{stats[1]}</div>
              <div className="text-sm text-muted mt-1">фанфиков</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold gradient-text">{stats[2]}</div>
              <div className="text-sm text-muted mt-1">постов</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Возможности платформы</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "📖",
              title: "Фанфики как на Фикбуке",
              desc: "Многостраничные истории, главы, фандомы, рейтинги, теги и закладки.",
            },
            {
              icon: "🐦",
              title: "Лента как в Twitter",
              desc: "Короткие посты, лайки, подписки на авторов и обновления в реальном времени.",
            },
            {
              icon: "✍️",
              title: "Профили авторов",
              desc: "Блог, био, список работ и подписчики — всё в одном профиле.",
            },
            {
              icon: "💬",
              title: "Комментарии",
              desc: "Обсуждайте посты, истории и отдельные главы с сообществом.",
            },
            {
              icon: "🔖",
              title: "Закладки",
              desc: "Сохраняйте любимые фанфики и возвращайтесь к ним позже.",
            },
            {
              icon: "🔍",
              title: "Поиск и фильтры",
              desc: "Ищите по фандому, рейтингу и статусу — находите то, что нравится.",
            },
          ].map((feature) => (
            <div key={feature.title} className="card">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {recentStories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Новые фанфики</h2>
            <Link href="/stories" className="text-primary hover:underline text-sm">
              Все фанфики →
            </Link>
          </div>
          <div className="grid gap-4">
            {recentStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

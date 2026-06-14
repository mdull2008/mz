import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StoryCard from "@/components/StoryCard";
import { FANDOMS } from "@/lib/utils";

type SearchParams = Promise<{ fandom?: string; status?: string; q?: string }>;

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const fandom = params.fandom || "";
  const status = params.status || "";
  const q = params.q || "";

  const stories = await prisma.story.findMany({
    where: {
      ...(fandom ? { fandom } : {}),
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { summary: { contains: q } },
              { tags: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { username: true, displayName: true } },
      chapters: { select: { id: true } },
      likes: { select: { id: true } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Фанфики</h1>
        <Link href="/write" className="btn-primary text-sm">
          + Написать
        </Link>
      </div>

      <form method="get" className="card mb-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск по названию, описанию, тегам..."
          className="input-field flex-1 min-w-[200px]"
        />
        <select name="fandom" defaultValue={fandom} className="input-field w-auto">
          <option value="">Все фандомы</option>
          {FANDOMS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="input-field w-auto">
          <option value="">Все статусы</option>
          <option value="ongoing">В процессе</option>
          <option value="complete">Завершённые</option>
        </select>
        <button type="submit" className="btn-primary text-sm">
          Найти
        </button>
      </form>

      <div className="space-y-4">
        {stories.length === 0 ? (
          <div className="card text-center text-muted py-12">
            Фанфики не найдены.{" "}
            <Link href="/write" className="text-primary hover:underline">
              Напишите первый!
            </Link>
          </div>
        ) : (
          stories.map((story) => <StoryCard key={story.id} story={story} />)
        )}
      </div>
    </div>
  );
}

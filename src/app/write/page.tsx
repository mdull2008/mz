import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createStoryAction } from "@/lib/actions";
import { FANDOMS, RATINGS } from "@/lib/utils";

export default async function WritePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Написать фанфик</h1>
      <p className="text-muted text-sm mb-8">
        Создайте новую историю. Первая глава публикуется вместе с описанием.
      </p>

      <form action={createStoryAction} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">О произведении</h2>

          <div>
            <label className="block text-sm text-muted mb-1.5">Название *</label>
            <input name="title" className="input-field" required placeholder="Название фанфика" />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Описание (summary) *</label>
            <textarea
              name="summary"
              className="input-field min-h-[100px]"
              required
              placeholder="О чём ваша история? Без спойлеров..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">Фандом *</label>
              <select name="fandom" className="input-field" required>
                <option value="">Выберите фандом</option>
                {FANDOMS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Рейтинг</label>
              <select name="rating" className="input-field" defaultValue="T">
                {RATINGS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">Статус</label>
              <select name="status" className="input-field" defaultValue="ongoing">
                <option value="ongoing">В процессе</option>
                <option value="complete">Завершён</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Теги</label>
              <input
                name="tags"
                className="input-field"
                placeholder="романтика, AU, драма (через запятую)"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Первая глава</h2>

          <div>
            <label className="block text-sm text-muted mb-1.5">Название главы</label>
            <input
              name="chapterTitle"
              className="input-field"
              defaultValue="Глава 1"
              placeholder="Глава 1"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Текст главы *</label>
            <textarea
              name="chapterContent"
              className="input-field min-h-[400px] font-mono text-sm"
              required
              placeholder="Начните писать вашу историю..."
            />
          </div>
        </div>

        <button type="submit" className="btn-primary px-8 py-3">
          Опубликовать фанфик
        </button>
      </form>
    </div>
  );
}

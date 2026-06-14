"use client";

import { useState } from "react";
import { createStoryAction } from "@/lib/actions";
import { FANDOMS, RATINGS } from "@/lib/utils";

export default function WriteStoryForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await createStoryAction(formData);
    } catch {
      setError("Не удалось опубликовать. Проверьте поля.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">О произведении</h2>

        <div>
          <label className="block text-sm text-muted mb-1.5">Название *</label>
          <input name="title" className="input-field" required placeholder="Название фанфика" />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Обложка</label>
          <input
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleCoverChange}
            className="input-field file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-sm"
          />
          <p className="text-xs text-muted mt-1">JPG, PNG, WebP или GIF, до 5 МБ</p>
          {preview && (
            <img
              src={preview}
              alt="Превью обложки"
              className="mt-3 w-40 h-56 object-cover rounded-xl border border-border"
            />
          )}
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

      {error && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary px-8 py-3 disabled:opacity-50">
        {loading ? "Публикация..." : "Опубликовать фанфик"}
      </button>
    </form>
  );
}

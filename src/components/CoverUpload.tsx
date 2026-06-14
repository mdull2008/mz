"use client";

import { useState } from "react";
import { uploadStoryCoverAction } from "@/lib/actions";

type CoverUploadProps = {
  storyId: string;
  currentCover?: string;
};

export default function CoverUpload({ storyId, currentCover }: CoverUploadProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await uploadStoryCoverAction(storyId, formData);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="card space-y-3">
      <h3 className="font-semibold text-sm">Обложка фанфика</h3>
      {currentCover && (
        <img
          src={currentCover}
          alt="Обложка"
          className="w-32 h-44 object-cover rounded-xl border border-border"
        />
      )}
      <input
        name="cover"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        required
        className="input-field text-sm file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-xs"
      />
      <button type="submit" disabled={loading} className="btn-secondary text-sm disabled:opacity-50">
        {loading ? "Загрузка..." : currentCover ? "Заменить обложку" : "Загрузить обложку"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { createPostAction } from "@/lib/actions";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("content", content);
    const result = await createPostAction(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setContent("");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="О чём думаете? Поделитесь с читателями..."
        className="input-field border-0 bg-transparent p-0 min-h-[80px] focus:border-0"
        maxLength={500}
      />
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted">{content.length}/500</span>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-accent">{error}</span>}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {loading ? "..." : "Опубликовать"}
          </button>
        </div>
      </div>
    </form>
  );
}

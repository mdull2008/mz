"use client";

import { useState } from "react";
import { addCommentAction } from "@/lib/actions";

type CommentFormProps = {
  postId?: string;
  storyId?: string;
  chapterId?: string;
};

export default function CommentForm({ postId, storyId, chapterId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("content", content);
    if (postId) formData.set("postId", postId);
    if (storyId) formData.set("storyId", storyId);
    if (chapterId) formData.set("chapterId", chapterId);

    await addCommentAction(formData);
    setContent("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Написать комментарий..."
        className="input-field flex-1 text-sm"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="btn-primary text-sm disabled:opacity-50"
      >
        {loading ? "..." : "Отправить"}
      </button>
    </form>
  );
}

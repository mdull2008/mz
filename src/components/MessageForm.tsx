"use client";

import { useState } from "react";
import { sendMessageAction } from "@/lib/actions";

type MessageFormProps = {
  receiverUsername: string;
};

export default function MessageForm({ receiverUsername }: MessageFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("receiver", receiverUsername);
    formData.set("content", content);

    await sendMessageAction(formData);
    setContent("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Написать сообщение..."
        className="input-field flex-1 text-sm"
        maxLength={2000}
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);
    if (result?.error) setError(result.error);
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-center">Регистрация</h1>
        <p className="text-center text-muted text-sm mt-2">
          Создайте аккаунт писателя или читателя
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Email</label>
            <input name="email" type="email" className="input-field" required />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Имя пользователя</label>
            <input
              name="username"
              className="input-field"
              required
              pattern="[a-z0-9_]{3,20}"
              title="3–20 символов: буквы, цифры, _"
              placeholder="author_name"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Отображаемое имя</label>
            <input name="displayName" className="input-field" required placeholder="Ваше имя" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Пароль</label>
            <input
              name="password"
              type="password"
              className="input-field"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? "Создание..." : "Создать аккаунт"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

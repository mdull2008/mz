"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result?.error) setError(result.error);
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-center">Вход в FicPulse</h1>
        <p className="text-center text-muted text-sm mt-2">
          Войдите, чтобы писать и читать
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Email или имя пользователя</label>
            <input name="login" className="input-field" required />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Пароль</label>
            <input name="password" type="password" className="input-field" required />
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ensureCsrf } from "../lib/csrf";

const token = await ensureCsrf();

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@stoix.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': token, // <— nome precisa bater com o back
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `Login failed (${res.status})`);
      }

      router.replace("/painel");
    } catch (err: any) {
      setError(err.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gray-400">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-200 rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl text-center font-bold">Faça seu Login</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <label className="block">
          <span className="text-sm">Seu email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm">Senha</span>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg py-2.5"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

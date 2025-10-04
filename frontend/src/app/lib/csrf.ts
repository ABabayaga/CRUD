// src/app/lib/csrf.ts
let cached: string | null = null;
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function ensureCsrf(): Promise<string> {
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/csrf-token`, {
    method: "GET",
    credentials: "include", // garante cookie do CSRF
    // cache curto ajuda a evitar chamadas repetidas
    headers: { "Cache-Control": "no-cache" },
  });

  if (!res.ok) {
    throw new Error(`Falha ao obter CSRF: HTTP ${res.status}`);
  }

  const data = (await res.json()) as { csrfToken?: string };
  if (!data?.csrfToken) {
    throw new Error("CSRF token ausente na resposta.");
  }

  cached = data.csrfToken;
  return cached;
}

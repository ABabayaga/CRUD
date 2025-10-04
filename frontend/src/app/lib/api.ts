// src/app/lib/api.ts
import { ensureCsrf } from "./csrf";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

type ApiInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  // timeout opcional pra abortar fetch
  timeoutMs?: number;
};

export async function apiFetch<T = unknown>(path: string, init: ApiInit = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  const headers: Record<string, string> = { ...(init.headers ?? {}) };

  // Monta body e content-type (evita setar para FormData)
  let body = init.body as BodyInit | undefined;
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (isMutation) {
    // CSRF para mutações
    headers["X-XSRF-TOKEN"] = await ensureCsrf();

    // Se o body é um objeto comum, serializa
    if (body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob)) {
      headers["Content-Type"] ||= "application/json";
      body = JSON.stringify(body);
    }
  }

  const controller = new AbortController();
  const timeout = init.timeoutMs
    ? setTimeout(() => controller.abort(), init.timeoutMs)
    : undefined;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      method,
      body,
      headers,
      credentials: "include", // importante para cookies (CSRF / sessão)
      signal: controller.signal,
    });

    if (!res.ok) {
      // Tenta extrair mensagem do backend (string ou JSON)
      let message = `HTTP ${res.status}`;
      try {
        const text = await res.text();
        message = text || message;
      } catch {}
      throw new Error(message);
    }

    if (res.status === 204) return undefined as T;
    // Se não for JSON válido, pode lançar — mantenha como está se seu backend sempre retorna JSON
    return (await res.json()) as T;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

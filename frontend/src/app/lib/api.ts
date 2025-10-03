// src/app/lib/api.ts
import { ensureCsrf } from './csrf';

export async function apiFetch<T = any>(path: string, opts: RequestInit = {}) {
  const method = (opts.method || 'GET').toUpperCase();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as any),
  };

  const fetchOpts: RequestInit = { ...opts, headers, credentials: 'include' };

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    headers['X-XSRF-TOKEN'] = await ensureCsrf();
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, fetchOpts);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as any) : ((await res.json()) as T);
}

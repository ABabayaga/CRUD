// src/app/lib/csrf.ts
let csrfToken: string | null = null;

export async function ensureCsrf(): Promise<string> {
  if (csrfToken) return csrfToken;

  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, {
    credentials: 'include',
  });
  if (!r.ok) throw new Error('Falha ao obter CSRF token');

  const data = await r.json();
  const token = data?.csrfToken;
  if (!token || typeof token !== 'string') {
    throw new Error('CSRF token ausente ou inválido');
  }

  csrfToken = token;
  return csrfToken; 
}

import { getToken } from './auth-storage';

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  if (init?.auth !== false) {
    const token = getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const { auth: _auth, ...rest } = init ?? {};
  const res = await fetch(`${BASE}${path}`, { ...rest, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Record<string, unknown>;
    throw new ApiError(
      res.status,
      (body.error as string | undefined) ?? 'Error',
      (body.message as string | undefined) ?? res.statusText,
    );
  }

  return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>);
}

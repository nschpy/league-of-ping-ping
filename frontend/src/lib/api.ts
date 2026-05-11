import { useAuthStore } from '@/stores/auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  }
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw Object.assign(new Error('Ошибка сети — проверьте соединение'), { statusCode: 0 })
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Request failed' }))
    throw Object.assign(new Error(body.message ?? 'Request failed'), { statusCode: res.status })
  }
  return res.json() as Promise<T>
}

export const api = {
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
}

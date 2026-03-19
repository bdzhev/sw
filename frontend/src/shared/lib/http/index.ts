import { clearToken, getToken, setToken } from '@shared/lib/auth/token';

const BASE_URL = import.meta.env.VITE_API_URL as string;

async function tryRefresh(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
  if (!res.ok) return false;
  const { accessToken } = await res.json();
  setToken(accessToken);
  return true;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers, credentials: 'include' });

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (!refreshed) {
      clearToken();
      throw new Error('Unauthorized');
    }
    headers['Authorization'] = `Bearer ${getToken()}`;
    const retried = await fetch(`${BASE_URL}${path}`, { ...init, headers, credentials: 'include' });
    if (!retried.ok) throw new Error(await retried.text());
    return retried.json() as Promise<T>;
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

const BASE_URL = import.meta.env.VITE_API_URL as string;

async function tryRefresh(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  return res.ok;
}

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (res.status === 401) {
    const refreshed = await tryRefresh();

    if (!refreshed) {
      throw new Error('Unauthorized');
    }

    const retried = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });

    if (!retried.ok) {
      throw new Error(await retried.text());
    }

    return retried.json() as Promise<T>;
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json() as Promise<T>;
};

export const http = {
  get: <T>(path: string) => {
    return request<T>(path);
  },
  post: <T>(path: string, body?: unknown) => {
    return request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  put: <T>(path: string, body?: unknown) => {
    return request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  patch: <T>(path: string, body?: unknown) => {
    return request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  delete: <T>(path: string) => {
    return request<T>(path, { method: 'DELETE' });
  },
};

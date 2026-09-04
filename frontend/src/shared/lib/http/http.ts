import { ApiError } from './ApiError';

const API_PORT = 3000;

/**
 * The API is assumed to answer on the same host as the page. It must be derived
 * rather than hardcoded: a phone that joined over the LAN would send every
 * request to its own loopback instead.
 */
const sameHostApiUrl = (): string => {
  const { protocol, hostname } = window.location;

  return `${protocol}//${hostname}:${API_PORT}`;
};

/**
 * `__API_URL__` comes from `/config.js`, which the prod image renders from the
 * `API_URL` env var. A loopback value there is treated as "not configured":
 * it ships as `http://localhost:3000` in every checkout, and honouring that
 * would break every device except the one running the server. Point `API_URL`
 * at a real hostname only when the API lives somewhere else entirely.
 */
const configuredApiUrl = (): string | null => {
  const injected = (window as Window & { __API_URL__?: string }).__API_URL__;

  if (!injected || /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(injected)) {
    return null;
  }

  return injected;
};

export const BASE_URL = configuredApiUrl() ?? sameHostApiUrl();

/**
 * A 401 from these means "wrong credentials", not "session expired", so they must
 * not go through the refresh-and-retry path — that swallowed the real message.
 */
const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

/** The backend answers errors with `{ error: string }`. */
const toApiError = async (res: Response): Promise<ApiError> => {
  const body = await res.text();

  try {
    const parsed = JSON.parse(body) as { error?: string };

    return new ApiError(res.status, parsed.error || res.statusText);
  } catch {
    return new ApiError(res.status, body || res.statusText);
  }
};

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

  if (res.status === 401 && !NO_REFRESH_PATHS.includes(path)) {
    const refreshed = await tryRefresh();

    if (!refreshed) {
      throw new ApiError(401, 'Unauthorized');
    }

    const retried = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });

    if (!retried.ok) {
      throw await toApiError(retried);
    }

    return retried.json() as Promise<T>;
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  return res.json() as Promise<T>;
};

/**
 * `init` on `post`/`patch` exists for one flag: `keepalive`, which is what lets a
 * request outlive the document during page teardown. Spread first, so a caller
 * cannot reach in and change the method or the body.
 */
export const http = {
  get: <T>(path: string) => {
    return request<T>(path);
  },
  post: <T>(path: string, body?: unknown, init?: RequestInit) => {
    return request<T>(path, {
      ...init,
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
  patch: <T>(path: string, body?: unknown, init?: RequestInit) => {
    return request<T>(path, {
      ...init,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  delete: <T>(path: string) => {
    return request<T>(path, { method: 'DELETE' });
  },
};

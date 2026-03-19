import { clearToken, setToken } from '@shared/lib/auth/token';
import { http } from '@shared/lib/http';

import type { User } from './types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const signInWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const refreshToken = async (): Promise<string> => {
  const res = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('Refresh failed');
  const { accessToken } = await res.json();
  setToken(accessToken);
  return accessToken;
};

export const signOut = async () => {
  await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
  clearToken();
};

export const getMe = (): Promise<User> => http.get<User>('/users/me');

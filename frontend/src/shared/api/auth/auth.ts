import { http } from '@shared/lib/http';

import type { User } from './types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const signIn = (username: string, password: string): Promise<User> => {
  return http.post<User>('/auth/login', { username, password });
};

export const signUp = (username: string, password: string): Promise<User> => {
  return http.post<User>('/auth/register', { username, password });
};

export const refreshToken = async (): Promise<void> => {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }
};

export const signOut = async () => {
  await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
};

export const getMe = (): Promise<User> => {
  return http.get<User>('/users/me');
};

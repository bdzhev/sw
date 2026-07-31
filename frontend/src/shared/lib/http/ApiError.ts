/** Carries the status and the backend's `{ error }` text, which a plain Error loses. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Backend messages are written for users, so they are shown as-is. Anything else
 * (a network failure, a thrown string) gets the caller's fallback.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError && error.message) {
    return error.message;
  }

  return fallback;
};

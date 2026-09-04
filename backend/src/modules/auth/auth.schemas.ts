import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;
const MAX_USERNAME_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 200;

/**
 * Register enforces a minimum password length; login deliberately does not.
 * Applying the rule at login would reject an existing account whose password
 * predates the rule with a *validation* error, which reads as "the form is
 * broken" rather than "wrong password" — and it would leak which passwords are
 * too short to be real.
 */
export const registerSchema = z.object({
  username: z.string().trim().min(1).max(MAX_USERNAME_LENGTH),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(MAX_USERNAME_LENGTH),
  password: z.string().min(1).max(MAX_PASSWORD_LENGTH),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

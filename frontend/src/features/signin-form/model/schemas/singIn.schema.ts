import z4 from 'zod/v4';

export const signInSchema = z4.object({
  email: z4
    .email('Please enter a valid email.')
    .max(100, 'Email must be at most 100 characters'),
  password: z4.string().nonempty('Please enter a password'),
});

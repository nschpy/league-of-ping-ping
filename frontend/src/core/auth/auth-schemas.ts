import { z } from 'zod';

export const signInSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  displayName: z.string().min(1, 'Name is required').max(60, 'Max 60 characters'),
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(30, 'Max 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Letters, numbers, _ or - only'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'At least 6 characters'),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

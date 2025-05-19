import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[@$!%*?&#]/,
      'Password must contain at least one special character',
    ),
});

export type SignupInput = z.infer<typeof SignupSchema>;

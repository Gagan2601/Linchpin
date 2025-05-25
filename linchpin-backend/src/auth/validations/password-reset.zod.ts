import { z } from 'zod';

export const InitiateResetSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type InitiateResetInput = z.infer<typeof InitiateResetSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

import { z } from 'zod';

export const authFormSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Email field is required' }),
    // .email({ message: 'Invalid email address' }),

  password: z
    .string()
    .nonempty({ message: 'Password field is required' })
    .min(2, { message: 'Password must be at least 6 characters.' }),

  rememberMe: z.boolean().optional(), // Optional checkbox
});

// Type for use in form
export type AuthFormData = z.infer<typeof authFormSchema>;

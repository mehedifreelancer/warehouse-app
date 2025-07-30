import { z } from 'zod';

export const userFormSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Username is required' })
    .max(100, { message: 'Username must be at most 100 characters' }),
  first_name: z
    .string()
    .max(100, { message: 'First name must be at most 100 characters' })
    .optional(),
  last_name: z
    .string()
    .max(100, { message: 'Last name must be at most 100 characters' })
    .optional(),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  is_staff: z.boolean().optional(),
    password: z
        .string()
        .min(3, { message: 'Password must be at least 8 characters' })
        .max(128, { message: 'Password must be at most 128 characters' })
    
});

export type UserFormData = z.infer<typeof userFormSchema>;



export const userUpdateFormSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Username is required' })
    .max(100, { message: 'Username must be at most 100 characters' }),
  first_name: z
    .string()
    .max(100, { message: 'First name must be at most 100 characters' })
    .optional(),
  last_name: z
    .string()
    .max(100, { message: 'Last name must be at most 100 characters' })
    .optional(),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  is_staff: z.boolean().optional(),
    
});

export type UserUpdateFormData = z.infer<typeof userUpdateFormSchema>;
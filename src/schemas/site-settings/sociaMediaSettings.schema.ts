import { z } from 'zod';

export const socialMediaIconFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Platform name is required' })
    .max(50, { message: 'Platform name must be at most 50 characters' }),
  url: z
    .string()
    .nonempty({ message: 'URL is required' })
    .url({ message: 'Please enter a valid URL' })
    .max(255, { message: 'URL must be at most 255 characters' }),
});

export type SocialMediaIconFormData = z.infer<typeof socialMediaIconFormSchema>;

export const socialMediaIconUpdateFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Platform name is required' })
    .max(50, { message: 'Platform name must be at most 50 characters' })
    .optional(),
  url: z
    .string()
    .nonempty({ message: 'URL is required' })
    .url({ message: 'Please enter a valid URL' })
    .max(255, { message: 'URL must be at most 255 characters' })
    .optional(),
});

export type SocialMediaIconUpdateFormData = z.infer<typeof socialMediaIconUpdateFormSchema>;
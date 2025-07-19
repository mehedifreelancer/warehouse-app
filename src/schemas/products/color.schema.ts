import { z } from 'zod';

export const colorFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Color name is required' })
    .max(100, { message: 'Color name must be at most 100 characters' }),
  note: z
    .string()
    .max(500, { message: 'Note must be at most 500 characters' })
    .optional(),
  image: z.instanceof(File, { message: 'Image is required' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
      message: 'Image must be JPEG, PNG, or WEBP format'
    }),
});

export type ColorFormData = z.infer<typeof colorFormSchema>;
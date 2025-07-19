import { z } from 'zod';

export const productItemFormSchema = z.object({
  SKU: z
    .string()
    .nonempty({ message: 'SKU is required' })
    .max(50, { message: 'SKU must be at most 50 characters' }),
  quantity_allocated: z
    .number()
    .min(0, { message: 'Quantity must be 0 or greater' }),
  price_override: z
    .number()
    .min(0, { message: 'Price must be 0 or greater' }),
  color: z
    .number()
    .optional(),
  item_image: z
    .instanceof(File, { message: 'Image is required' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 
           'Only JPEG, PNG, and WEBP formats are allowed')
    .optional()
});

export type ProductItemFormData = z.infer<typeof productItemFormSchema>;
import { z } from 'zod';
// Base schema without image
const baseBrandItemSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  subtitle: z.string().min(1, { message: 'Subtitle is required' }),
  campaign_text: z.string().min(1, { message: 'Campaign text is required' }),
  category: z.number().min(1, { message: 'Category is required' })
});

// For CREATE (image required)
export const createBrandItemSchema = baseBrandItemSchema.extend({
  image: z.instanceof(File, { message: 'Image is required' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'Image must be <5MB')
    .refine(file => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Only JPEG/PNG images allowed'
    })
});

// For UPDATE (image optional)
export const updateBrandItemSchema = baseBrandItemSchema.extend({
  image: z.any().optional() // Accepts File, string, or undefined
    .refine(val => !val || (typeof val === 'string') || 
      (val instanceof File && val.size <= 5 * 1024 * 1024), {
        message: 'Image must be <5MB'
      })
    .refine(val => !val || (typeof val === 'string') || 
      (val instanceof File && ['image/jpeg', 'image/png'].includes(val.type)), {
        message: 'Only JPEG/PNG images allowed'
      })
});
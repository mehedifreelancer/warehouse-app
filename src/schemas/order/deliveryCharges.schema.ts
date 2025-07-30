import { z } from 'zod';

export const deliveryChargeFormSchema = z.object({
  location: z
    .string()
    .nonempty({ message: 'Location is required' })
    .max(100, { message: 'Location must be at most 100 characters' }),
  price: z
    .string()
    .nonempty({ message: 'Price is required' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Price must be a valid number' }),
});

export type DeliveryChargeFormData = z.infer<typeof deliveryChargeFormSchema>;

export const deliveryChargeUpdateFormSchema = z.object({
  location: z
    .string()
    .nonempty({ message: 'Location is required' })
    .max(100, { message: 'Location must be at most 100 characters' }),
  price: z
    .string()
    .nonempty({ message: 'Price is required' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Price must be a valid number' }),
});

export type DeliveryChargeUpdateFormData = z.infer<typeof deliveryChargeUpdateFormSchema>;
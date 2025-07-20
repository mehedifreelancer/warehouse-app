import { z } from 'zod';

export const stockFormSchema = z.object({
  product_item: z.number().min(1, { message: 'Product item is required' }),
  warehouse: z.number().min(1, { message: 'Warehouse is required' }),
  quantity: z.number().min(0, { message: 'Quantity must be positive' }),
});

export type StockFormData = z.infer<typeof stockFormSchema>;
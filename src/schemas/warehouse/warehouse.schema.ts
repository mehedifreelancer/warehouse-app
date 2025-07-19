import { z } from 'zod';

export const warehouseFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Warehouse name is required' }),
  address: z
    .string()
    .nonempty({ message: 'Address is required' })
    .max(500, { message: 'Address must be at most 500 characters' }),

  
});

export type WarehouseFormData = z.infer<typeof warehouseFormSchema>;
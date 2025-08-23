import { z } from 'zod';

const orderItemSchema = z.object({
  product_item: z.number().positive({ message: 'Product item is required' }),
  quantity: z.number().positive({ message: 'Quantity must be at least 1' }),
});

export const orderFormSchema = z.object({
  delivery_charge: z
    .string()
    .nonempty({ message: 'Delivery charge is required' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Delivery charge must be a valid decimal number' }),
  shipping_address: z
    .number()
    .positive({ message: 'Shipping address is required' }),
  payment_method: z
    .string()
    .nonempty({ message: 'Payment method is required' }),
  status: z
    .string()
    .nonempty({ message: 'Status is required' }),
  additional_note: z
    .string()
    .optional(),
  order_items: z
    .array(orderItemSchema)
    .nonempty({ message: 'At least one order item is required' }),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

export const orderUpdateFormSchema = z.object({
  delivery_charge: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Delivery charge must be a valid decimal number' })
    .optional(),
  shipping_address: z
    .number()
    .positive({ message: 'Shipping address is required' })
    .optional(),
  payment_method: z
    .string()
    .nonempty({ message: 'Payment method is required' })
    .optional(),
  status: z
    .string()
    .nonempty({ message: 'Status is required' })
    .optional(),
  additional_note: z
    .string()
    .optional(),
  order_items: z
    .array(orderItemSchema)
    .nonempty({ message: 'At least one order item is required' })
    .optional(),
});

export type OrderUpdateFormData = z.infer<typeof orderUpdateFormSchema>;
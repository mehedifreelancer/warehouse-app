import { z } from 'zod';

export const customerFormSchema = z.object({
  // Customer fields
  phone_number: z
    .string()
    .nonempty({ message: 'Phone number is required' })
    .regex(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' }),
  first_name: z
    .string()
    .nonempty({ message: 'First name is required' })
    .max(50, { message: 'First name must be at most 50 characters' }),
  last_name: z
    .string()
    .nonempty({ message: 'Last name is required' })
    .max(50, { message: 'Last name must be at most 50 characters' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  
  // Address fields
  address_type: z
    .string()
    .nonempty({ message: 'Address type is required' }),
  street_address: z
    .string()
    .nonempty({ message: 'Street address is required' })
    .max(255, { message: 'Street address must be at most 255 characters' }),
  address_line2: z
    .string()
    .max(255, { message: 'Address line 2 must be at most 255 characters' })
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .nonempty({ message: 'City is required' })
    .max(100, { message: 'City must be at most 100 characters' }),
  division: z
    .string()
    .nonempty({ message: 'Division is required' })
    .max(100, { message: 'Division must be at most 100 characters' }),
  postal_code: z
    .string()
    .max(20, { message: 'Postal code must be at most 20 characters' })
    .optional()
    .or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;

export const customerUpdateFormSchema = z.object({
  // Customer fields
  phone_number: z
    .string()
    .nonempty({ message: 'Phone number is required' })
    .regex(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .optional(),
  first_name: z
    .string()
    .nonempty({ message: 'First name is required' })
    .max(50, { message: 'First name must be at most 50 characters' })
    .optional(),
  last_name: z
    .string()
    .nonempty({ message: 'Last name is required' })
    .max(50, { message: 'Last name must be at most 50 characters' })
    .optional(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .optional(),
  
  // Address fields
  address_type: z
    .string()
    .nonempty({ message: 'Address type is required' })
    .optional(),
  street_address: z
    .string()
    .nonempty({ message: 'Street address is required' })
    .max(255, { message: 'Street address must be at most 255 characters' })
    .optional(),
  address_line2: z
    .string()
    .max(255, { message: 'Address line 2 must be at most 255 characters' })
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .nonempty({ message: 'City is required' })
    .max(100, { message: 'City must be at most 100 characters' })
    .optional(),
  division: z
    .string()
    .nonempty({ message: 'Division is required' })
    .max(100, { message: 'Division must be at most 100 characters' })
    .optional(),
  postal_code: z
    .string()
    .max(20, { message: 'Postal code must be at most 20 characters' })
    .optional()
    .or(z.literal('')),
});

export type CustomerUpdateFormData = z.infer<typeof customerUpdateFormSchema>;
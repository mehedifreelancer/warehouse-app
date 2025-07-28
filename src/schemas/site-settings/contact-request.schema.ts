import { z } from 'zod';

export const contactRequestFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(6, { message: 'Phone number too short' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().min(10, { message: 'Message too short' }),
});

export type ContactRequestFormData = z.infer<typeof contactRequestFormSchema>;
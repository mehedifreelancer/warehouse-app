import { z } from 'zod';

export const workProcessFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: `Name field is required` }) 
    .max(50, { message: 'Name must be at most 50 characters.' }),
});

// Type for use in form
export type WorkProcessFormData = z.infer<typeof workProcessFormSchema>;

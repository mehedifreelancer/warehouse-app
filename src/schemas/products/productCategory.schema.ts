import { z } from 'zod';

export const productCategoryFormSchema = z.object({
  category_name: z
    .string()
    .nonempty({ message: 'Category name is required' })
    .max(100, { message: 'Category name must be at most 100 characters' }),
  use_as_menu: z.boolean(),
});

export type ProductCategoryFormData = z.infer<typeof productCategoryFormSchema>;

export const productCategoryUpdateFormSchema = z.object({
  category_name: z
    .string()
    .nonempty({ message: 'Category name is required' })
    .max(100, { message: 'Category name must be at most 100 characters' }),
  use_as_menu: z.boolean(),
});

export type ProductCategoryUpdateFormData = z.infer<typeof productCategoryUpdateFormSchema>;
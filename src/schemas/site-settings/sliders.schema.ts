import { z } from 'zod';

export const sliderFormSchema = z.object({
  image: z.instanceof(File),
  sub_title: z.string().min(1, { message: 'Sub title is required' }),
  intro_one: z.string().min(1, { message: 'Intro one is required' }),
  intro_two: z.string().min(1, { message: 'Intro two is required' }),
  offer_text: z.string().min(1, { message: 'Offer text is required' }),
  category: z.number().min(1, { message: 'Category is required' }),
});

export const sliderUpdateFormSchema = z.object({
  sub_title: z.string().optional(),
  intro_one: z.string().optional(),
  intro_two: z.string().optional(),
  offer_text: z.string().optional(),
  category: z.number().optional(),
});

export type SliderFormData = z.infer<typeof sliderFormSchema>;
export type SliderUpdateFormData = z.infer<typeof sliderUpdateFormSchema>;
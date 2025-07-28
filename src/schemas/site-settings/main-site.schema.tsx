import { z } from 'zod';

export const mainSiteSchema = z.object({
  name: z.string().min(1, { message: 'Site name is required' }),
  site_url: z.string().url({ message: 'Invalid URL format' }),
  description: z.string().min(1, { message: 'Description is required' }),
  keyword: z.string().min(1, { message: 'Keywords are required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  address: z.string(),
  short_description: z.string(),
  header_logo: z.string().url({ message: 'Invalid URL format' }),
  footer_logo: z.string().url({ message: 'Invalid URL format' }),
  favicon: z.string().url({ message: 'Invalid URL format' }),
  icon_16: z.string().url({ message: 'Invalid URL format' }),
  icon_32: z.string().url({ message: 'Invalid URL format' }),
  apple_touch_icon: z.string().url({ message: 'Invalid URL format' }),
  safari_pinned: z.string().url({ message: 'Invalid URL format' }),
  helpline_number: z.string().min(1, { message: 'Helpline number is required' }),
  maintenance_mode: z.boolean()
});

export type MainSiteFormSchema = z.infer<typeof mainSiteSchema>;
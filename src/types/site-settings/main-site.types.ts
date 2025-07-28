export interface MainSite {
  id: number;
  name: string;
  site_url: string;
  description: string;
  keyword: string;
  author: string;
  email: string;
  address: string;
  short_description: string;
  header_logo: string;
  footer_logo: string;
  favicon: string;
  icon_16: string;
  icon_32: string;
  apple_touch_icon: string;
  safari_pinned: string;
  helpline_number: string;
  maintenance_mode: boolean;
}

export type MainSiteFormData = Omit<MainSite, 'id'>;
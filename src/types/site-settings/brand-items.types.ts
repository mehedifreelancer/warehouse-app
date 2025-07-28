export interface BrandItem {
  id: number;
  image: string | null;
  title: string;
  subtitle: string;
  campaign_text: string;
  category: number;
}

export type BrandItemsResponse = BrandItem[];

export interface CreateBrandItemPayload {
  image?: File;
  title: string;
  subtitle: string;
  campaign_text: string;
  category: number;
}

export interface UpdateBrandItemPayload {
  image?: File;
  title?: string;
  subtitle?: string;
  campaign_text?: string;
  category?: number;
}
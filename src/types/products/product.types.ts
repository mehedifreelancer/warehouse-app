export interface Product {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  short_description: string | null;
  description: string;
  additional_information: string;
  price: string;
  discounted_price: string | null;
  is_featured: boolean;
  is_top_sale: boolean;
  is_top_rated: boolean;
  status: string;
  feature_image: string;
  size_guide: string | null;
  spu: string;
  rating_count: number;
  category: number;
}

export type ProductResponse = Product[];


export interface UpdateProductPayload {
  name?: string;
  short_description?: string | null;
  description?: string;
  additional_information?: string;
  price?: number;
  discounted_price?: number | null;
  is_featured?: boolean;
  is_top_sale?: boolean;
  is_top_rated?: boolean;
  status?: string; // Adjust to match backend enums
  feature_image?: string;
  size_guide?: string | null;
  spu?: string;
  category?: number;
}

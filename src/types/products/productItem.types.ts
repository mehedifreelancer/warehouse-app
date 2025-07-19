export interface ProductItem {
  id: number;
  item_image: string;
  created_at: string;
  updated_at: string;
  SKU: string;
  quantity_allocated: number;
  price_override: string;
  barcode: string;
  product: number;
  color: number | null;
  size: number | null;
}

export interface Color {
  id: number;
  name: string;
}

export type ProductItemResponse = ProductItem[];

export interface CreateProductItemPayload {
  SKU: string;
  quantity_allocated: number;
  price_override: number;
  barcode: string;
  product: number;
  color?: number;
  size?: number;
  item_image?: File;
}

export interface UpdateProductItemPayload {
  SKU?: string;
  quantity_allocated?: number;
  price_override?: number;
  color?: number;
  item_image?: File;
}
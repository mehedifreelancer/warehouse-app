export interface ProductCategory {
  id: number;
  created_at: string;
  updated_at: string;
  category_name: string;
  slug: string;
  use_as_menu: boolean;
  parent_category: number | null;
}

export type ProductCategoriesResponse = ProductCategory[];

export interface CreateProductCategoryPayload {
  category_name: string;
  use_as_menu: boolean;
}

export interface UpdateProductCategoryPayload {
  category_name?: string;
  use_as_menu?: boolean;
}
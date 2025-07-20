export interface Stock {
  id: number;
  product_item: number;
  warehouse: number;
  quantity: number;
  extra_data: {
    last_allocated_stock: number;
  };
  color: string;
  product_name: string;
  barcode: string;
  product_image: string;
}

export type StockResponse = Stock[];

export interface UpdateStockPayload {
  id: number;
  product_item: number;
  warehouse: number;
  quantity: number;
}
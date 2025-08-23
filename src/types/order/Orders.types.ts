export interface OrderItem {
  id: number;
  product_item: number;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  order_id: string;
  customer: number;
  total_price: string;
  delivery_charge: string;
  is_paid: boolean;
  shipping_address: number | null;
  billing_address: number | null;
  payment_method: string;
  status: string;
  additional_note: string;
  cancel_reason: string;
  extra_data: {
    item_processed: boolean;
    procurement_item_ids: number[];
  };
  date_placed: string;
  order_items: OrderItem[];
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface CreateOrderPayload {
  delivery_charge: string;
  shipping_address: number;
  payment_method: string;
  status: string;
  additional_note: string;
  order_items: {
    product_item: number;
    quantity: number;
  }[];
}

export interface UpdateOrderPayload {
  delivery_charge?: string;
  shipping_address?: number;
  payment_method?: string;
  status?: string;
  additional_note?: string;
  order_items?: {
    product_item: number;
    quantity: number;
  }[];
}
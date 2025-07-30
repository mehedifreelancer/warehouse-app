export interface DeliveryCharge {
  id: number;
  location: string;
  price: string;
}

export type DeliveryChargesResponse = DeliveryCharge[];

export interface CreateDeliveryChargePayload {
  location: string;
  price: string;
}

export interface UpdateDeliveryChargePayload {
  location?: string;
  price?: string;
}
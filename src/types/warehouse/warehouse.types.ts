export interface Warehouse {
  id: number;
  name: string;
  address: string;
}

export type WarehouseResponse = Warehouse[];

export interface CreateWarehousePayload {
  name: string;
  address: string;
  parent_warehouse?: number; // Add parent warehouse ID
}
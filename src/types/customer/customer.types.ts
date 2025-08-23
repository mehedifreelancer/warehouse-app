export interface CustomerUser {
  phone_number: string;
  first_name: string;
  last_name: string;
}

export interface Customer {
  id: number;
  user: CustomerUser;
  registered: boolean;
}

export interface CustomersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}
export interface Customer {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  registered: boolean;
}
export interface CustomersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}

export interface Address {
  id: number;
  full_address: string;
  phone_no: string;
  address_type: string;
  street_address: string;
  address_line2: string | null;
  city: string;
  division: string;
  postal_code: string;
  customer: number;
}

export interface CustomerWithAddress {
  customer: Customer;
  address: Address;
}

export type AddressesResponse = Address[];

export interface CreateCustomerPayload {
  phone_number: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface UpdateCustomerPayload {
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

export interface CreateAddressPayload {
  customer: number;
  phone_no: string;
  address_type: string;
  street_address: string;
  address_line2?: string;
  city: string;
  division: string;
  postal_code?: string;
}

export interface UpdateAddressPayload {
  phone_no?: string;
  address_type?: string;
  street_address?: string;
  address_line2?: string;
  city?: string;
  division?: string;
  postal_code?: string;
}
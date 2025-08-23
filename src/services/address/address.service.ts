import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";

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
export interface AddressesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Address[];
}

export const getAllAddresses = async (): Promise<AddressesResponse> => {
  try {
    const response = await api.get<AddressesResponse>('/addresses/');
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to fetch addresses.';
    
    toastCustom({
      title: "Fetch Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

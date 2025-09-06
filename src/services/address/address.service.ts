
import { toastCustom } from '../../components/ui/CustomToast';
import api from '../../config/api/api-config';
import type {
  Address,
  AddressesResponse,
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CreateAddressPayload,
  UpdateAddressPayload,
} from '../../types/customer/customer.types';

// Customer services
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

export const createCustomer = async (payload: CreateCustomerPayload): Promise<Customer> => {
  try {
    const response = await api.post<Customer>('/customers/', payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to create customer.';
    
    toastCustom({
      title: "Creation Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: number, payload: UpdateCustomerPayload): Promise<Customer> => {
  try {
    const response = await api.put<Customer>(`/customers/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to update customer with ID ${id}.`;
    
    toastCustom({
      title: "Update Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/customers/${id}/`);
    
    toastCustom({
      title: "Customer Deleted",
      message: "Customer was successfully deleted.",
      type: "success",
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to delete customer with ID ${id}.`;
    
    toastCustom({
      title: "Deletion Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Address services
export const createAddress = async (payload: CreateAddressPayload): Promise<Address> => {
  try {
    const response = await api.post<Address>('/addresses/', payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to create address.';
    
    toastCustom({
      title: "Creation Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error creating address:', error);
    throw error;
  }
};

export const updateAddress = async (id: number, payload: UpdateAddressPayload): Promise<Address> => {
  try {
    const response = await api.put<Address>(`/addresses/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to update address with ID ${id}.`;
    
    toastCustom({
      title: "Update Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error updating address:', error);
    throw error;
  }
};

export const deleteAddress = async (id: number): Promise<void> => {
  try {
    await api.delete(`/addresses/${id}/`);
    
    toastCustom({
      title: "Address Deleted",
      message: "Address was successfully deleted.",
      type: "success",
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to delete address with ID ${id}.`;
    
    toastCustom({
      title: "Deletion Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error deleting address:', error);
    throw error;
  }
};


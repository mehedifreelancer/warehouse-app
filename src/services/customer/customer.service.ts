
import { toastCustom } from '../../components/ui/CustomToast';
import api from '../../config/api/api-config';
import type { Customer, CreateCustomerPayload, UpdateCustomerPayload, CustomersResponse } from '../../types/customer/customer.types';

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

export const getAllCustomers = async (page?: number): Promise<CustomersResponse> => {
  try {
    const url = page ? `/customers/?page=${page}` : '/customers/';
    const response = await api.get<CustomersResponse>(url);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to fetch customers.';
    
    toastCustom({
      title: "Fetch Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await api.get<Customer>(`/customers/${id}/`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to fetch customer with ID ${id}.`;
    
    toastCustom({
      title: "Fetch Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error fetching customer:', error);
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

export const searchCustomers = async (query: string): Promise<CustomersResponse> => {
  try {
    const response = await api.get<CustomersResponse>(`/customers/?search=${query}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to search customers with query: ${query}.`;
    
    toastCustom({
      title: "Search Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error searching customers:', error);
    throw error;
  }
};
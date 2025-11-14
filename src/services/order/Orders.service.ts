import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { CreateOrderPayload, Order, OrdersResponse, UpdateOrderPayload } from "../../types/order/Orders.types";


// In your Orders.service.ts

export const getOrders = async (page?: number, status?: string): Promise<OrdersResponse> => {
  try {
    let url = '/order/orders/';
    const params = new URLSearchParams();
    
    if (page) params.append('page', page.toString());
    if (status) params.append('status', status);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get<OrdersResponse>(url);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to fetch orders.';
    
    toastCustom({
      title: "Fetch Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getSingleOrder = async (id: number): Promise<Order> => {
  try {
    const response = await api.get<Order>(`/order/orders/${id}/`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to fetch order with ID ${id}.`;
    
    toastCustom({
      title: "Fetch Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  try {
    const response = await api.post<Order>('/order/orders/', payload);
    
    toastCustom({
      title: "Order Created",
      message: `Order was successfully created.`,
      type: "success",
    });
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to create order.';
    
    toastCustom({
      title: "Creation Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (
  id: number,
  payload: UpdateOrderPayload
): Promise<Order> => {
  try {
    const response = await api.put<Order>(`/order/orders/${id}/`, payload);
    
    toastCustom({
      title: "Order Updated",
      message: `Order was successfully updated.`,
      type: "success",
    });
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || `Failed to update order with ID ${id}.`;
    
    toastCustom({
      title: "Update Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error updating order:', error);
    throw error;
  }
};
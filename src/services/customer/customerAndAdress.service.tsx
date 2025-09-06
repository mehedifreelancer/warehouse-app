
import { toastCustom } from '../../components/ui/CustomToast';
import type {
  Address,
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CreateAddressPayload,
  UpdateAddressPayload,
} from '../../types/customer/customer.types';
import { createAddress, deleteAddress, updateAddress } from '../address/address.service';
import { createCustomer, deleteCustomer, updateCustomer } from './customer.service';

export const createCustomerWithAddress = async (
  customerData: CreateCustomerPayload, 
  addressData: Omit<CreateAddressPayload, 'customer' | 'phone_no'>
): Promise<{customer: Customer, address: Address}> => {
  try {
    // First create customer
    const customer = await createCustomer(customerData);
    
    // Then create address with the customer ID and same phone number
    const address = await createAddress({
      ...addressData,
      customer: customer.id,
      phone_no: customerData.phone_number // Use the same phone number
    });
    
    toastCustom({
      title: "Customer Created",
      message: "Customer and address were successfully created.",
      type: "success",
    });
    
    return { customer, address };
  } catch (error) {
    console.error('Error creating customer with address:', error);
    throw error;
  }
};

export const updateCustomerWithAddress = async (
  customerId: number, 
  addressId: number, 
  customerData: UpdateCustomerPayload, 
  addressData: Omit<UpdateAddressPayload, 'phone_no'>
): Promise<{customer: Customer, address: Address}> => {
  try {
    // Update customer and address in parallel
    const [customer, address] = await Promise.all([
      updateCustomer(customerId, customerData),
      updateAddress(addressId, {
        ...addressData,
        phone_no: customerData.phone_number // Use the updated phone number
      })
    ]);
    
    toastCustom({
      title: "Customer Updated",
      message: "Customer and address were successfully updated.",
      type: "success",
    });
    
    return { customer, address };
  } catch (error) {
    console.error('Error updating customer with address:', error);
    throw error;
  }
};

export const deleteCustomerWithAddress = async (customerId: number, addressId: number): Promise<void> => {
    console.log('Deleting customer with ID:', customerId, 'and address with ID:', addressId);
    return
    
  try {
    // Delete address and customer in parallel
    await Promise.all([
      deleteAddress(addressId),
      deleteCustomer(customerId)
    ]);

  } catch (error) {
    console.error('Error deleting customer with address:', error);
    throw error;
  }
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../../components/ui/input/InputText";
import Button from "../../components/ui/Button";
import { toastCustom } from "../../components/ui/CustomToast";
import { orderFormSchema } from "../../schemas/order/Orders.schema";
import { createOrder } from "../../services/order/Orders.service";
import { getProducts } from "../../services/products/product.service";
import { getAllAddresses } from "../../services/address/address.service";
import { getAllCustomers } from "../../services/customer/customer.service";
import type { Product } from "../../types/products/product.types";
import type { Address } from "../../services/address/address.service";
import type { Customer } from "../../types/customer/customer.types";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import { Eye, Plus, Save, Search, X } from "lucide-react";

const statusOptions = [
  { id: 1, label: "Pending", value: "pending" },
  { id: 2, label: "In Procurement", value: "in_procurement" },
  { id: 3, label: "Processing", value: "processing" },
  { id: 4, label: "Shipped", value: "shipped" },
  { id: 5, label: "Delivered", value: "delivered" },
  { id: 6, label: "Cancelled", value: "cancelled" },
];

const paymentMethodOptions = [
  { id: 1, label: "Cash on Delivery", value: "COD" },
  { id: 2, label: "Online Payment", value: "online" },
  { id: 3, label: "Bank Transfer", value: "bank_transfer" },
];

const AddOrder = () => {
  const navigate = useNavigate();
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [productList, setProductList] = useState<Product[] | null>(null);
  const [addressList, setAddressList] = useState<Address[] | null>(null);
  const [customerList, setCustomerList] = useState<Customer[] | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<
    number | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [selectedProductItems, setSelectedProductItems] = useState<
    { product_item: number; quantity: number; product_name: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Format customer for display
  const formatCustomerLabel = (customer: Customer) => {
    return `${customer.user.first_name} ${customer.user.last_name} (${customer.user.phone_number})`;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [productsRes, addressesRes, customersRes] = await Promise.all([
          getProducts(1, 100),
          getAllAddresses(),
          getAllCustomers(1, 100),
        ]);

        setProductList(productsRes.results);
        setAddressList(addressesRes);
        setCustomerList(customersRes.results);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toastCustom({
          title: "Error",
          message: "Failed to fetch required data",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleCreateOrder = async (formData: FormData) => {
    const formFields = {
      customer: selectedCustomerId,
      delivery_charge: formData.get("delivery_charge") as string,
      shipping_address: selectedShippingAddressId,
      payment_method: selectedPaymentMethod,
      status: selectedStatus,
      additional_note: formData.get("additional_note") as string,
      is_paid: isPaid,
      order_items: selectedProductItems.map((item) => ({
        product_item: item.product_item,
        quantity: item.quantity,
      })),
    };

    const validation = orderFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const confirmation = await createOrder(validation.data);
      if (confirmation) {
        toastCustom({
          title: "Success",
          message: "Order created successfully",
          type: "success",
        });
        navigate("/orders"); // Redirect back to orders list
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toastCustom({
        title: "Error",
        message: "Failed to create order",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProductItem = () => {
    if (selectedProductId) {
      // Check if product is already added
      const isProductAlreadyAdded = selectedProductItems.some(
        (item) => item.product_item === selectedProductId
      );

      if (isProductAlreadyAdded) {
        toastCustom({
          title: "Product Already Added",
          message:
            "This product has already been added to the order. You can update the quantity instead.",
          type: "warning",
        });
        return;
      }

      const product = productList?.find((p) => p.id === selectedProductId);
      const newItem = {
        product_item: selectedProductId,
        quantity: 1,
        product_name: product?.name || `Product #${selectedProductId}`,
      };

      setSelectedProductItems((prev) => [...prev, newItem]);
      setSelectedProductId(null);
    }
  };

  const removeProductItem = (index: number) => {
    setSelectedProductItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProductItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;

    setSelectedProductItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const resetForm = () => {
    setFormValidationErrors({});
    setSelectedProductItems([]);
    setSelectedProductId(null);
    setSelectedCustomerId(null);
    setSelectedShippingAddressId(null);
    setSelectedStatus(null);
    setSelectedPaymentMethod(null);
    setIsPaid(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Order
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add a new order to the system
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <form action={handleCreateOrder} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              name="customer"
              label="Customer"
              options={customerList ?? []}
              value={selectedCustomerId}
              onChange={(val) => setSelectedCustomerId(val)}
              formatOptionLabel={formatCustomerLabel}
              valueKey="id"
              placeholder="Select customer"
              checkErrorField={formValidationErrors.customer}
              required
            />

            <InputText
              placeholder="0.00"
              name="delivery_charge"
              label="Delivery Charge"
              type="number"
              step="0.01"
              checkErrorField={formValidationErrors.delivery_charge}
              required
            />

            <SearchableSelect
              name="shipping_address"
              label="Shipping Address"
              options={addressList ?? []}
              value={selectedShippingAddressId}
              onChange={(val) => setSelectedShippingAddressId(val)}
              labelKey="street_address"
              valueKey="id"
              placeholder="Select shipping address"
              checkErrorField={formValidationErrors.shipping_address}
              required
            />

            <SearchableSelect
              name="payment_method"
              label="Payment Method"
              options={paymentMethodOptions}
              value={selectedPaymentMethod}
              onChange={(val) => setSelectedPaymentMethod(val)}
              labelKey="label"
              valueKey="value"
              placeholder="Select payment method"
              checkErrorField={formValidationErrors.payment_method}
              required
            />

            <SearchableSelect
              name="status"
              label="Status"
              options={statusOptions}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              labelKey="label"
              valueKey="value"
              placeholder="Select status"
              checkErrorField={formValidationErrors.status}
              required
            />

            <InputText
              placeholder="Additional notes..."
              name="additional_note"
              label="Additional Note"
              checkErrorField={formValidationErrors.additional_note}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="is_paid"
              name="is_paid"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="is_paid"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Is Paid
            </label>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">
              Order Items
            </h3>

            <div className="flex gap-2 mb-4">
              <SearchableSelect
                className="flex-1"
                name="product_item"
                label="Select Product"
                options={productList ?? []}
                value={selectedProductId}
                onChange={(val) => setSelectedProductId(val)}
                labelKey="name"
                valueKey="id"
                placeholder="Select a product"
                checkErrorField={formValidationErrors.order_items}
              />
              <Button
                type="button"
                className="btn-primary self-end"
                onClick={addProductItem}
                disabled={!selectedProductId}
              >
                <Plus size={16} />
                Add Product
              </Button>
            </div>

            {selectedProductItems.length > 0 ? (
              <div className="space-y-2">
                {selectedProductItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <span className="flex-1 font-medium text-gray-900 dark:text-white">
                      {item.product_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity:
                      </label>
                      <InputText
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateProductItemQuantity(
                            index,
                            Number(e.target.value)
                          )
                        }
                        className="w-20"
                      />
                    </div>
                    <Button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeProductItem(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
                No products added yet. Select a product and click "Add Product"
                to get started.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              className="btn-gray"
              onClick={resetForm}
              disabled={loading}
            >
              <X size={20} />
              Reset
            </Button>
            <Button
              type="button"
              className="btn-gray"
              onClick={() => navigate("/orders")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              <Save size={20} className="mr-1" />
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;

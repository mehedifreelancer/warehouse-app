import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Modal from "../../components/common/Modal";
import { GlobalContext } from "../../layouts/RootLayout";
import editIcon from "../../assets/icons/Table/edit.svg";
import Button from "../../components/ui/Button";
import TableSkeleton from "../../components/shared/skeletons/TableSkeleton";
import InputText from "../../components/ui/input/InputText";
import {
  pageToShow,
  paginatorTemplate,
  rowsToShow,
} from "../../config/data-table/dataTableConfig";
import { Eye, Plus, Save, Search, X } from "lucide-react";
import type { Order, OrdersResponse } from "../../types/order/Orders.types";
import {
  createOrder,
  getOrder,
  getOrders,
  getSingleOrder,
  updateOrder,
} from "../../services/order/Orders.service";
import {
  orderFormSchema,
  orderUpdateFormSchema,
} from "../../schemas/order/Orders.schema";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import { getProducts } from "../../services/products/product.service";
import type { Product } from "../../types/products/product.types";
import { toastCustom } from "../../components/ui/CustomToast";
import { getAllAddresses, type Address } from "../../services/address/address.service";
import { getAllCustomers } from "../../services/customer/customer.service";
import type { Customer } from "../../types/customer/customer.types";

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

const Orders = () => {
  const [ordersList, setOrdersList] = useState<Order[] | null>(null);
  const [ordersResponse, setOrdersResponse] = useState<OrdersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productList, setProductList] = useState<Product[] | null>(null);
  const [addressList, setAddressList] = useState<Address[] | null>(null);
  const [customerList, setCustomerList] = useState<Customer[] | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [selectedProductItems, setSelectedProductItems] = useState<{product_item: number, quantity: number, product_name: string}[]>([]);
  const [updateProductItems, setUpdateProductItems] = useState<{product_item: number, quantity: number, product_name: string}[]>([]);

  // Format customer for display
  const formatCustomerLabel = (customer: Customer) => {
    return `${customer.user.first_name} ${customer.user.last_name} (${customer.user.phone_number})`;
  };

  const filterByOrderId = {
    order_id: { value: orderIdFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes, addressesRes, customersRes] = await Promise.all([
          getOrders(currentPage),
          getProducts(1, 100),
          getAllAddresses(),
          getAllCustomers(1, 100)
        ]);
        
        setProductList(productsRes.results);
        setAddressList(addressesRes);
        setCustomerList(customersRes.results);
        setOrdersResponse(ordersRes);
        setOrdersList(ordersRes.results);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData, currentPage]);

  useEffect(() => {
    if (modalFor === "update" && rowData) {
      setSelectedCustomerId(rowData.customer);
      setSelectedShippingAddressId(rowData.shipping_address);
      setSelectedStatus(rowData.status);
      setSelectedPaymentMethod(rowData.payment_method);
      setIsPaid(rowData.is_paid);
      
      // Initialize update product items
      const itemsWithNames = rowData.order_items.map(item => ({
        product_item: item.product_item,
        quantity: item.quantity,
        product_name: `Product #${item.product_item}`
      }));
      setUpdateProductItems(itemsWithNames);
    }
  }, [modalFor, rowData]);

  const handleCreateOrder = async (formData: FormData) => {
    const formFields = {
      customer: selectedCustomerId,
      delivery_charge: formData.get("delivery_charge") as string,
      shipping_address: selectedShippingAddressId,
      payment_method: selectedPaymentMethod,
      status: selectedStatus,
      additional_note: formData.get("additional_note") as string,
      is_paid: isPaid,
      order_items: selectedProductItems.map(item => ({
        product_item: item.product_item,
        quantity: item.quantity
      }))
    };

    const validation = orderFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await createOrder(validation.data);
      if (confirmation) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
        setSelectedProductItems([]);
        setSelectedProductId(null);
        setSelectedCustomerId(null);
        setSelectedShippingAddressId(null);
        setSelectedStatus(null);
        setSelectedPaymentMethod(null);
        setIsPaid(false);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleUpdateOrder = async (formData: FormData) => {
    const formFields = {
      customer: selectedCustomerId,
      delivery_charge: formData.get("delivery_charge") as string,
      shipping_address: selectedShippingAddressId,
      payment_method: selectedPaymentMethod,
      status: selectedStatus,
      additional_note: formData.get("additional_note") as string,
      is_paid: isPaid,
      order_items: updateProductItems.map(item => ({
        product_item: item.product_item,
        quantity: item.quantity
      }))
    };

    const validation = orderUpdateFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await updateOrder(rowData?.id!, validation.data);
      if (confirmation) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleViewOrder = async (id: number) => {
    try {
      const order = await getSingleOrder(id);
      setRowData(order);
      setModalFor("view");
      setModalVisibility(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
  };

  const addProductItem = (isUpdateModal = false) => {
    if (selectedProductId) {
      const itemsArray = isUpdateModal ? updateProductItems : selectedProductItems;
      
      // Check if product is already added
      const isProductAlreadyAdded = itemsArray.some(
        item => item.product_item === selectedProductId
      );
      
      if (isProductAlreadyAdded) {
        toastCustom({
          title: "Product Already Added",
          message: "This product has already been added to the order. You can update the quantity instead.",
          type: "warning",
        });
        return;
      }
      
      const product = productList?.find(p => p.id === selectedProductId);
      const newItem = { 
        product_item: selectedProductId, 
        quantity: 1,
        product_name: product?.name || `Product #${selectedProductId}`
      };
      
      if (isUpdateModal) {
        setUpdateProductItems(prev => [...prev, newItem]);
      } else {
        setSelectedProductItems(prev => [...prev, newItem]);
      }
      setSelectedProductId(null);
    }
  };

  const removeProductItem = (index: number, isUpdateModal = false) => {
    if (isUpdateModal) {
      setUpdateProductItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedProductItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateProductItemQuantity = (index: number, quantity: number, isUpdateModal = false) => {
    if (quantity < 1) return;
    
    if (isUpdateModal) {
      setUpdateProductItems(prev => 
        prev.map((item, i) => i === index ? { ...item, quantity } : item)
      );
    } else {
      setSelectedProductItems(prev => 
        prev.map((item, i) => i === index ? { ...item, quantity } : item)
      );
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const statusBodyTemplate = (rowData: Order) => {
    const statusClass =
      {
        pending: "bg-yellow-100 text-yellow-800",
        in_procurement: "bg-blue-100 text-blue-800",
        processing: "bg-purple-100 text-purple-800",
        shipped: "bg-indigo-100 text-indigo-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
      }[rowData.status] || "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {rowData.status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const paidStatusBodyTemplate = (rowData: Order) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${rowData.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {rowData.is_paid ? "PAID" : "UNPAID"}
      </span>
    );
  };

  const customerBodyTemplate = (rowData: Order) => {
    const customer = customerList?.find(c => c.id === rowData.customer);
    return customer ? formatCustomerLabel(customer) : `Customer #${rowData.customer}`;
  };

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Orders List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Order
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setOrderIdFilter(e.target.value)}
            value={orderIdFilter}
            className=""
            type="search"
            placeholder="Search by Order ID..."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          value={ordersList ?? []}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterByOrderId}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
          totalRecords={ordersResponse?.count || 0}
          lazy
          onPage={onPageChange}
        >
          <Column
            field="order_id"
            header="Order ID"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="customer"
            header="Customer"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={customerBodyTemplate}
          />
          <Column
            field="total_price"
            header="Total Price"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => `৳${rowData.total_price}`}
          />
          <Column
            field="payment_method"
            header="Payment Method"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="is_paid"
            header="Payment Status"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={paidStatusBodyTemplate}
          />
          <Column
            field="status"
            header="Status"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={statusBodyTemplate}
          />
          <Column
            field="date_placed"
            header="Date Placed"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            header="Action"
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (
              <div className="flex gap-4">
                <Eye
                  onClick={() => handleViewOrder(rowData.id)}
                  className="w-5 h-5 cursor-pointer text-blue-500"
                />
                <img
                  onClick={() => {
                    setModalVisibility(true);
                    setModalFor("update");
                    setRowData(rowData);
                  }}
                  className="w-4 h-4 cursor-pointer"
                  src={editIcon}
                  alt="Edit"
                />
              </div>
            )}
          />
        </DataTable>
      )}

      {modalFor === "create" && (
        <Modal
          modalCrossAction={() => {
            setFormValidationErrors({});
            setSelectedProductItems([]);
            setSelectedProductId(null);
            setSelectedCustomerId(null);
            setSelectedShippingAddressId(null);
            setSelectedStatus(null);
            setSelectedPaymentMethod(null);
            setIsPaid(false);
          }}
          modalTitle="Create Order"
          size="lg"
        >
          <form
            action={handleCreateOrder}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableSelect
                name="customer"
                label="Customer"
                options={customerList ?? []}
                value={selectedCustomerId}
                onChange={(val) => setSelectedCustomerId(val)}
                labelKey="hellow"
                valueKey="id"
                placeholder="Select customer"
                checkErrorField={formValidationErrors.customer}
              />
              
              <InputText
                placeholder="0.00"
                name="delivery_charge"
                label="Delivery Charge"
                checkErrorField={formValidationErrors.delivery_charge}
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
                className="h-4 w-4 rounded  focus:ring-indigo-500"
              />
              <label htmlFor="is_paid" className="text-sm text-gray-700">
                Is Paid
              </label>
            </div>

            <div className="pt-4 mt-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              
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
                  className="btn-primary self-end mb-1"
                  onClick={() => addProductItem(false)}
                  disabled={!selectedProductId}
                >
                  <Plus size={16} />
                </Button>
              </div>

              {selectedProductItems.length > 0 && (
                <div className="space-y-2">
                  {selectedProductItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="flex-1 font-medium">{item.product_name}</span>
                      <div className="flex items-center gap-1">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <InputText
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateProductItemQuantity(index, Number(e.target.value), false)}
                          className="w-16"
                        />
                      </div>
                      <Button 
                        type="button" 
                        className="btn-danger"
                        onClick={() => removeProductItem(index, false)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-4 form-footer">
              <Button
                className="btn-gray"
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                  setSelectedProductItems([]);
                  setSelectedProductId(null);
                  setSelectedCustomerId(null);
                  setSelectedShippingAddressId(null);
                  setSelectedStatus(null);
                  setSelectedPaymentMethod(null);
                  setIsPaid(false);
                }}
              >
                <X size={20} />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-primary"
              >
                <Save size={20} className="mr-1" />
                Create
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modalFor === "update" && rowData && (
        <Modal
          modalCrossAction={() => {
            setFormValidationErrors({});
          }}
          modalTitle="Update Order"
          size="lg"
        >
          <form action={handleUpdateOrder}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableSelect
                label="Customer"
                options={customerList ?? []}
                value={selectedCustomerId}
                onChange={(val) => setSelectedCustomerId(val)}
                formatOptionLabel={formatCustomerLabel}
                valueKey="id"
                placeholder="Select customer"
                checkErrorField={formValidationErrors.customer}
              />
              
              <InputText
                placeholder="0.00"
                label="Delivery Charge"
                name="delivery_charge"
                defaultValue={rowData.delivery_charge}
                checkErrorField={formValidationErrors.delivery_charge}
              />
              
              <SearchableSelect
                label="Shipping Address"
                options={addressList ?? []}
                value={selectedShippingAddressId}
                onChange={(val) => setSelectedShippingAddressId(val)}
                labelKey="street_address"
                valueKey="id"
                placeholder="Select shipping address"
                checkErrorField={formValidationErrors.shipping_address}
              />
              
              <SearchableSelect
                label="Payment Method"
                options={paymentMethodOptions}
                value={selectedPaymentMethod}
                onChange={(val) => setSelectedPaymentMethod(val)}
                labelKey="label"
                valueKey="value"
                placeholder="Select payment method"
                checkErrorField={formValidationErrors.payment_method}
              />
              
              <SearchableSelect
                label="Status"
                options={statusOptions}
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
                labelKey="label"
                valueKey="value"
                placeholder="Select status"
                checkErrorField={formValidationErrors.status}
              />
              <InputText
                placeholder="Additional notes..."
                label="Additional Note"
                name="additional_note"
                defaultValue={rowData.additional_note}
                checkErrorField={formValidationErrors.additional_note}
              />
            </div>
            

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="is_paid_update"
                name="is_paid"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-4 w-4 rounded focus:ring-indigo-500"
              />
              <label htmlFor="is_paid_update" className="text-sm text-gray-700">
                Is Paid
              </label>
            </div>

            <div className="pt-4 mt-4 ">
              <h3 className="font-medium mb-2">Order Items</h3>
              
              <div className="flex gap-2 mb-4">
                <SearchableSelect
                  className="flex-1"
                  label="Select Product"
                  options={productList ?? []}
                  value={selectedProductId}
                  onChange={(val) => setSelectedProductId(val)}
                  labelKey="name"
                  valueKey="id"
                  placeholder="Select a product"
                />
                <Button 
                  type="button" 
                  className="btn-primary self-end mb-1"
                  onClick={() => addProductItem(true)}
                  disabled={!selectedProductId}
                >
                  <Plus size={16} />
                </Button>
              </div>

              {updateProductItems.length > 0 && (
                <div className="space-y-2">
                  {updateProductItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="flex-1 font-medium">{item.product_name}</span>
                      <div className="flex items-center gap-1">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <InputText
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateProductItemQuantity(index, Number(e.target.value), true)}
                          className="w-16"
                        />
                      </div>
                      <Button 
                        type="button" 
                        className="btn-danger"
                        onClick={() => removeProductItem(index, true)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                }}
                className="btn-gray"
              >
                <X size={20} />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-success"
                disabled={updateProductItems.length === 0 || !selectedCustomerId || !selectedShippingAddressId || !selectedStatus || !selectedPaymentMethod}
              >
                <Save size={20} className="mr-1" />
                Update
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modalFor === "view" && rowData && (
        <Modal
          modalCrossAction={() => {}}
          modalTitle={`Order Details - ${rowData.order_id}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Order ID</h3>
                <p className="text-gray-900">{rowData.order_id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Customer ID</h3>
                <p className="text-gray-900">{rowData.customer}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Total Price</h3>
                <p className="text-gray-900">৳{rowData.total_price}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Delivery Charge</h3>
                <p className="text-gray-900">৳{rowData.delivery_charge}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Payment Method</h3>
                <p className="text-gray-900">{rowData.payment_method}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Payment Status</h3>
                <p className="text-gray-900">{rowData.is_paid ? "Paid" : "Unpaid"}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Status</h3>
                <p className="text-gray-900">
                  {rowData.status.replace("_", " ").toUpperCase()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Date Placed</h3>
                <p className="text-gray-900">
                  {new Date(rowData.date_placed).toLocaleString()}
                </p>
              </div>
            </div>

            {rowData.additional_note && (
              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-medium text-gray-700">Additional Note</h3>
                <p className="text-gray-900">{rowData.additional_note}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
              <div className="border rounded divide-y">
                {rowData.order_items.map((item) => (
                  <div key={item.id} className="p-3 grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-700">Product ID:</span>{" "}
                      {item.product_item}
                    </div>
                    <div>
                      <span className="text-gray-700">Quantity:</span>{" "}
                      {item.quantity}
                    </div>
                    <div>
                      <span className="text-gray-700">Price:</span> ৳
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => setModalVisibility(false)}
              className="btn-gray"
            >
              <X size={20} />
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
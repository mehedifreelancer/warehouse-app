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
import { Plus, Save, Search, X, Trash2, Eye } from "lucide-react";
import type { Address } from "../../types/customer/customer.types";
import {
  createCustomerWithAddress,
  updateCustomerWithAddress,
  deleteCustomerWithAddress,
} from "../../services/customer/customerAndAdress.service";
import {
  customerFormSchema,
  customerUpdateFormSchema,
} from "../../schemas/customer/customer.schema";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import { getAllAddresses } from "../../services/address/address.service";

const addressTypeOptions = [
  { id: 1, label: "Shipping", value: "shipping" },
  { id: 2, label: "Billing", value: "billing" },
];

const Customers = () => {
  const [addressesList, setAddressesList] = useState<Address[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneFilter, setPhoneFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<Record<string, string[]>>({});
  const [selectedAddressType, setSelectedAddressType] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const filterByPhone = {
    phone_no: { value: phoneFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const addressesRes = await getAllAddresses();
        setAddressesList(addressesRes);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        setError("Failed to fetch addresses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateCustomer = async (formData: FormData) => {
    const formFields = {
      // Customer fields (phone_number will be used for both customer and address)
      phone_number: formData.get("phone_number") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      password: formData.get("password") as string,
      
      // Address fields
      address_type: selectedAddressType as string,
      street_address: formData.get("street_address") as string,
      address_line2: formData.get("address_line2") as string,
      city: formData.get("city") as string,
      division: formData.get("division") as string,
      postal_code: formData.get("postal_code") as string,
    };

    const validation = customerFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const { phone_number, first_name, last_name, password, ...addressData } = validation.data;
      
      const response = await createCustomerWithAddress(
        { phone_number, first_name, last_name, password },
        addressData
      );

      
      
      setModalVisibility(false);
      setReload(!reloadData);
      setFormValidationErrors({});
      setSelectedAddressType(null);
      setShowPassword(false);
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleUpdateCustomer = async (formData: FormData) => {
    if (!rowData) return;

    const formFields = {
      // Customer fields (phone_number will be used for both customer and address)
      phone_number: formData.get("phone_number") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      password: formData.get("password") as string,
      
      // Address fields
      address_type: selectedAddressType as string,
      street_address: formData.get("street_address") as string,
      address_line2: formData.get("address_line2") as string,
      city: formData.get("city") as string,
      division: formData.get("division") as string,
      postal_code: formData.get("postal_code") as string,
    };

    const validation = customerUpdateFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const { phone_number, first_name, last_name, password, ...addressData } = validation.data;
      
      await updateCustomerWithAddress(
        rowData.customer,
        rowData.id,
        { phone_number, first_name, last_name, password },
        addressData
      );
      
      setModalVisibility(false);
      setReload(!reloadData);
      setFormValidationErrors({});
      setSelectedAddressType(null);
      setShowPassword(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!rowData) return;
    console.log(rowData);
    return;
    

    try {
      await deleteCustomerWithAddress(rowData.customer, rowData.id);
      setModalVisibility(false);
      setReload(!reloadData);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const addressTypeBodyTemplate = (rowData: Address) => {
    const typeClass = rowData.address_type === "shipping" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-purple-100 text-purple-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClass}`}>
        {rowData.address_type.toUpperCase()}
      </span>
    );
  };

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Customers List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Customer
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setPhoneFilter(e.target.value)}
            value={phoneFilter}
            className=""
            type="search"
            placeholder="Search by phone..."
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
          value={addressesList ?? []}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterByPhone}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="customer"
            header="Customer ID"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="phone_no"
            header="Phone"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="address_type"
            header="Address Type"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={addressTypeBodyTemplate}
          />
          <Column
            field="street_address"
            header="Street Address"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="city"
            header="City"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="division"
            header="Division"
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
                <img
                  onClick={() => {
                    setModalVisibility(true);
                    setModalFor("update");
                    setRowData(rowData);
                    setSelectedAddressType(rowData.address_type);
                  }}
                  className="w-4 h-4 cursor-pointer"
                  src={editIcon}
                  alt="Edit"
                />
                <Trash2
                  onClick={() => {
                    setModalVisibility(true);
                    setModalFor("delete");
                    setRowData(rowData);
                  }}
                  className="w-4 h-4 cursor-pointer text-red-500"
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
            setSelectedAddressType(null);
            setShowPassword(false);
          }}
          modalTitle="Create Customer"
          size="lg"
        >
          <form
            action={handleCreateCustomer}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="col-span-full font-medium text-lg mb-2">Customer Information</h3>
              
              <InputText
                placeholder="Phone Number"
                name="phone_number"
                label="Phone Number"
                checkErrorField={formValidationErrors.phone_number}
              />
              
              <InputText
                placeholder="First Name"
                name="first_name"
                label="First Name"
                checkErrorField={formValidationErrors.first_name}
              />
              
              <InputText
                placeholder="Last Name"
                name="last_name"
                label="Last Name"
                checkErrorField={formValidationErrors.last_name}
              />
              
              <div className="relative">
                <InputText
                  placeholder="Password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  checkErrorField={formValidationErrors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="col-span-full font-medium text-lg mb-2">Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  name="address_type"
                  label="Address Type"
                  options={addressTypeOptions}
                  value={selectedAddressType}
                  onChange={(val) => setSelectedAddressType(val)}
                  labelKey="label"
                  valueKey="value"
                  placeholder="Select address type"
                  checkErrorField={formValidationErrors.address_type}
                />
                
                <InputText
                  placeholder="Street Address"
                  name="street_address"
                  label="Street Address"
                  checkErrorField={formValidationErrors.street_address}
                />
                
                <InputText
                  placeholder="Address Line 2 (Optional)"
                  name="address_line2"
                  label="Address Line 2"
                  checkErrorField={formValidationErrors.address_line2}
                />
                
                <InputText
                  placeholder="City"
                  name="city"
                  label="City"
                  checkErrorField={formValidationErrors.city}
                />
                
                <InputText
                  placeholder="Division"
                  name="division"
                  label="Division"
                  checkErrorField={formValidationErrors.division}
                />
                
                <InputText
                  placeholder="Postal Code (Optional)"
                  name="postal_code"
                  label="Postal Code"
                  checkErrorField={formValidationErrors.postal_code}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4 form-footer">
              <Button
                className="btn-gray"
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                  setSelectedAddressType(null);
                  setShowPassword(false);
                }}
              >
                <X size={20} />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-primary"
                disabled={!selectedAddressType}
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
            setShowPassword(false);
          }}
          modalTitle="Update Customer"
          size="lg"
        >
          <form action={handleUpdateCustomer}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="col-span-full font-medium text-lg mb-2">Customer Information</h3>
              
              <InputText
                placeholder="Phone Number"
                label="Phone Number"
                name="phone_number"
                defaultValue={rowData.phone_no}
                checkErrorField={formValidationErrors.phone_number}
              />
              
              <InputText
                placeholder="First Name"
                label="First Name"
                name="first_name"
                defaultValue=""
                checkErrorField={formValidationErrors.first_name}
              />
              
              <InputText
                placeholder="Last Name"
                label="Last Name"
                name="last_name"
                defaultValue=""
                checkErrorField={formValidationErrors.last_name}
              />
              
              <div className="relative">
                <InputText
                  placeholder="Password (leave blank to keep current)"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  checkErrorField={formValidationErrors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="col-span-full font-medium text-lg mb-2">Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  label="Address Type"
                  options={addressTypeOptions}
                  value={selectedAddressType}
                  onChange={(val) => setSelectedAddressType(val)}
                  labelKey="label"
                  valueKey="value"
                  placeholder="Select address type"
                  checkErrorField={formValidationErrors.address_type}
                />
                
                <InputText
                  placeholder="Street Address"
                  label="Street Address"
                  name="street_address"
                  defaultValue={rowData.street_address}
                  checkErrorField={formValidationErrors.street_address}
                />
                
                <InputText
                  placeholder="Address Line 2 (Optional)"
                  label="Address Line 2"
                  name="address_line2"
                  defaultValue={rowData.address_line2 || ""}
                  checkErrorField={formValidationErrors.address_line2}
                />
                
                <InputText
                  placeholder="City"
                  label="City"
                  name="city"
                  defaultValue={rowData.city}
                  checkErrorField={formValidationErrors.city}
                />
                
                <InputText
                  placeholder="Division"
                  label="Division"
                  name="division"
                  defaultValue={rowData.division}
                  checkErrorField={formValidationErrors.division}
                />
                
                <InputText
                  placeholder="Postal Code (Optional)"
                  label="Postal Code"
                  name="postal_code"
                  defaultValue={rowData.postal_code || ""}
                  checkErrorField={formValidationErrors.postal_code}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                  setShowPassword(false);
                }}
                className="btn-gray"
              >
                <X size={20} />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-success"
                disabled={!selectedAddressType}
              >
                <Save size={20} className="mr-1" />
                Update
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modalFor === "delete" && rowData && (
        <Modal
          modalCrossAction={() => {}}
          modalTitle="Deleting Customer"
        >
          <form action={handleDeleteCustomer}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                Customer with phone "{rowData.phone_no}" will be deleted permanently!
              </h3>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setModalVisibility(false)}
                className="btn-gray"
              >
                <X size={20} />
                Cancel
              </Button>
              <Button type="submit" className="btn-danger">
                <Trash2 size={20} className="mr-1" />
                Delete
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Customers;
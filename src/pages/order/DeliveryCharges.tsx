  import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Modal from "../../components/common/Modal";
import { GlobalContext } from "../../layouts/RootLayout";
import editIcon from ".../../../../assets/icons/Table/edit.svg";
import Button from "../../components/ui/Button";
import TableSkeleton from "../../components/shared/skeletons/TableSkeleton";
import InputText from "../../components/ui/input/InputText";
import {
  pageToShow,
  paginatorTemplate,
  rowsToShow,
} from "../../config/data-table/dataTableConfig";
import { Delete, Plus, Save, Search, X } from "lucide-react";
import type { DeliveryCharge } from "../../types/order/deliveryCharges.types";
import {
  createDeliveryCharge,
  deleteDeliveryCharge,
  getDeliveryCharges,
  updateDeliveryCharge,
} from "../../services/order/deliveryCharges.service";
import { deliveryChargeFormSchema, deliveryChargeUpdateFormSchema } from "../../schemas/order/deliveryCharges.schema";

const DeliveryCharge = () => {
  const [deliveryChargesList, setDeliveryChargesList] = useState<DeliveryCharge[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<DeliveryCharge | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const filterByLocation = {
    location: { value: locationFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getDeliveryCharges();
        setDeliveryChargesList(res);
      } catch (error) {
        console.error("Failed to fetch delivery charges:", error);
        setError("Failed to fetch delivery charges.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateDeliveryCharge = async (formData: FormData) => {
    const formFields = {
      location: formData.get("location") as string,
      price: formData.get("price") as string,
    };

    const validation = deliveryChargeFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await createDeliveryCharge(validation.data);
      if (confirmation.status === 200 || confirmation.status === 201) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error creating delivery charge:", error);
    }
  };

  const handleUpdateDeliveryCharge = async (formData: FormData) => {
    const formFields = {
      location: formData.get("location") as string,
      price: formData.get("price") as string,
    };

    const validation = deliveryChargeUpdateFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      console.log("Validation errors:", validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await updateDeliveryCharge(rowData?.id!, validation.data);
      if (confirmation.status === 200) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating delivery charge:", error);
    }
  };

  const handleDeleteDeliveryCharge = async () => {
    try {
      const confirmation = await deleteDeliveryCharge(rowData?.id!);
      if (confirmation.status === 200 || confirmation.status === 204) {
        setModalVisibility(false);
        setReload(!reloadData);
      }
    } catch (error) {
      console.error("Error deleting delivery charge:", error);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Delivery Charges List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Delivery Charge
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setLocationFilter(e.target.value)}
            value={locationFilter}
            className=""
            type="search"
            placeholder="Search..."
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
          value={deliveryChargesList ?? []}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterByLocation}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="location"
            header="Location"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="price"
            header="Price"
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
                  }}
                  className="w-[15.59px] h-[15.59px] cursor-pointer"
                  src={editIcon}
                  alt="Edit"
                />
                <Delete
                  onClick={() => {
                    setModalVisibility(true);
                    setModalFor("delete");
                    setRowData(rowData);
                  }}
                  className="w-[15.59px] h-[15.59px] cursor-pointer text-red-500"
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
          }}
          modalTitle="Create Delivery Charge"
        >
          <form
            action={handleCreateDeliveryCharge}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="Location"
                name="location"
                label="Location"
                checkErrorField={formValidationErrors.location}
              />
              <InputText
                placeholder="Price"
                name="price"
                label="Price"
                checkErrorField={formValidationErrors.price}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4 form-footer">
              <Button
                className="btn-gray"
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                }}
              >
                <X size={20} />
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                <Save size={20} className="mr-1" />
                Create
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modalFor === "update" && (
        <Modal
          modalCrossAction={() => {
            setFormValidationErrors({});
          }}
          modalTitle="Update Delivery Charge"
        >
          <form action={handleUpdateDeliveryCharge}>
            <div className="space-y-4">
              <InputText
                placeholder="Location"
                label="Location"
                name="location"
                defaultValue={rowData?.location}
                checkErrorField={formValidationErrors.location}
              />
              <InputText
                placeholder="Price"
                label="Price"
                name="price"
                defaultValue={rowData?.price}
                checkErrorField={formValidationErrors.price}
              />
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
              <Button type="submit" className="btn-success">
                <Save size={20} className="mr-1" />
                Update
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modalFor === "delete" && (
        <Modal
          modalCrossAction={() => setFormValidationErrors({})}
          modalTitle="Deleting Delivery Charge"
        >
          <form action={handleDeleteDeliveryCharge}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                Delivery charge for "{rowData?.location}" will be deleted permanently!
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
                <Delete size={20} className="mr-1" />
                Delete
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DeliveryCharge;
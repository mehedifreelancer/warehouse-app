import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Modal from "../../components/common/Modal";
import { GlobalContext } from "../../layouts/RootLayout";
import Button from "../../components/ui/Button";

import TableSkeleton from "../../components/shared/skeletons/TableSkeleton";
import InputText from "../../components/ui/input/InputText";
import {
  pageToShow,
  paginatorTemplate,
  rowsToShow,
} from "../../config/data-table/dataTableConfig";
import { Delete, Plus, Save, Search, X } from "lucide-react";
import type { Warehouse } from "../../types/warehouse/warehouse.types";
import {
  getWarehouses,
  createWarehouse,
} from "../../services/warehouse/warehouse.service";
import { warehouseFormSchema } from "../../schemas/warehouse/warehouse.schema";
import SearchableSelect from "../../components/ui/select/SearchableSelect";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [selectedParentWarehouse, setSelectedParentWarehouse] = useState<
    string | null
  >(null);

  const filterByName = {
    name: { value: nameFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getWarehouses();
        setWarehouses(res);
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
        setError("Failed to fetch warehouses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateWarehouse = async (formData: FormData) => {
    const formFields = {
      address: formData.get("address") as string,
      name: selectedParentWarehouse,
    };


    const validation = warehouseFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await createWarehouse(validation.data);
      if (confirmation.status === 200 || confirmation.status === 201) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
        setSelectedParentWarehouse(null);
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Warehouses</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Warehouse
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setNameFilter(e.target.value)}
            value={nameFilter}
            className=""
            type="search"
            placeholder="Search by name..."
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
          value={warehouses}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterByName}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="name"
            header="Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="address"
            header="Address"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          {/* <Column
            header="Action"
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (
              <div className="flex gap-4">
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
          /> */}
        </DataTable>
      )}

      {modalFor === "create" && (
        <Modal
          modalCrossAction={() => {
            setFormValidationErrors({});
            setSelectedParentWarehouse(null);
          }}
          modalTitle="Create Warehouse"
        >
          <form
            action={handleCreateWarehouse}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Warehouse
                </label>
                {/* <Dropdown
                    value={selectedParentWarehouse}
                    options={warehouses.map((warehouse) => ({
                        label: warehouse.name,
                        value: warehouse.name, // using name instead of id
                    }))}
                    onChange={(e) => setSelectedParentWarehouse(e.value)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Parent Warehouse"
                    className="w-full"
                    panelClassName="rounded-none"

                /> */}
                <SearchableSelect
                  className="pl-0"
                  name="name"
                  label=""
                  options={warehouses ?? []}
                  value={selectedParentWarehouse}
                  onChange={(val) => setSelectedParentWarehouse(val)}
                  labelKey="name"
                  valueKey="name"
                  placeholder="Select Country"
                  checkErrorField={formValidationErrors.name}
                />
              </div>

              <InputText
                placeholder="Address"
                name="address"
                label="Address"
                checkErrorField={formValidationErrors.address}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4 form-footer">
              <Button
                className="btn-gray"
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                  setSelectedParentWarehouse(null);
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
    </div>
  );
};

export default Warehouse;

import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Modal from "../../components/common/Modal";
import { GlobalContext } from "../../layouts/RootLayout";
import editIcon from ".../../../../assets/icons/Table/edit.svg";
import Button from "../../components/ui/Button";
import TableSkeleton from "../../components/shared/skeletons/TableSkeleton";
import SearchableSelect from "../../components/ui/select/SearchableSelect";
import {
  pageToShow,
  paginatorTemplate,
  rowsToShow,
} from "../../config/data-table/dataTableConfig";
import { Delete, Plus, Save, Search, X } from "lucide-react";
import type { Stock, UpdateStockPayload } from "../../types/warehouse/stock.types";
import { getStocks, updateStock, deleteStock } from "../../services/warehouse/stock.service";
import { getWarehouses } from "../../services/warehouse/warehouse.service";
import { stockFormSchema } from "../../schemas/warehouse/stock.schema";
import type { Warehouse } from "../../types/warehouse/warehouse.types";
import InputText from "../../components/ui/input/InputText";

const Stock = () => {
  const [stockList, setStockList] = useState<Stock[] | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<Stock | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);

  const filterByName = {
    product_name: { value: nameFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stocksRes, warehousesRes] = await Promise.all([
          getStocks(),
          getWarehouses()
        ]);
        setStockList(stocksRes);
        setWarehouses(warehousesRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleUpdateStock = async (formData: FormData) => {
    const formFields = {
      product_item: Number(formData.get("product_item")),
      warehouse: selectedWarehouseId || 0,
      quantity: Number(formData.get("quantity")),
    };

    const validation = stockFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    const payload: UpdateStockPayload = {
      id: rowData?.id!,
      ...validation.data,
    };

    try {
      const confirmation = await updateStock(rowData?.id!, payload);
      if (confirmation.status === 200) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
        setSelectedWarehouseId(null);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async () => {
    try {
      const confirmation = await deleteStock(rowData?.id!);
      if (confirmation.status === 200 || confirmation.status === 204) {
        setModalVisibility(false);
        setReload(!reloadData);
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const handleEditClick = (stock: Stock) => {
    setModalVisibility(true);
    setModalFor("update");
    setRowData(stock);
    setSelectedWarehouseId(stock.warehouse);
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Stock List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
          disabled
        >
          <Plus size={16} className="mr-1" />
          Add Stock
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
          value={stockList ?? []}
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
            field="product_name"
            header="Product Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="color"
            header="Color"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="barcode"
            header="Barcode"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="warehouse"
            header="Warehouse"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (rowData.warehouse === 1 ? "Bangladesh" : "China")}
          />
          <Column
            field="quantity"
            header="Quantity"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            header="Image"
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (
              <img
                className="h-[30px] w-[30px] object-cover"
                src={rowData.product_image}
                alt={rowData.product_name}
              />
            )}
          />
          <Column
            header="Action"
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (
              <div className="flex gap-4">
                <img
                  onClick={() => handleEditClick(rowData)}
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

      {modalFor === "update" && rowData && (
        <Modal
          modalCrossAction={() => {
            setFormValidationErrors({});
            setSelectedWarehouseId(null);
          }}
          modalTitle="Update Stock"
        >
          <form action={handleUpdateStock}>
            <div className="space-y-4">
              <InputText
                placeholder="Product Item ID"
                label="Product Item ID"
                name="product_item"
                type="number"
                defaultValue={rowData.product_item.toString()}
                checkErrorField={formValidationErrors.product_item}
              />
              
              <SearchableSelect
                className="pl-0"
                name="warehouse"
                label="Warehouse"
                options={warehouses}
                value={selectedWarehouseId}
                onChange={(val) => setSelectedWarehouseId(val as number)}
                labelKey="name"
                valueKey="id"
                placeholder="Select Warehouse"
                checkErrorField={formValidationErrors.warehouse}
              />
              
              <InputText
                type="number"
                placeholder="Quantity"
                label="Quantity"
                name="quantity"
                defaultValue={rowData.quantity.toString()}
                checkErrorField={formValidationErrors.quantity}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                  setSelectedWarehouseId(null);
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
          modalTitle="Deleting Stock"
        >
          <form action={handleDeleteStock}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                Stock for "{rowData?.product_name}" will be deleted permanently!
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

export default Stock;
import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import Modal from "../../components/common/Modal";
import { GlobalContext } from "../../layouts/RootLayout";
import Button from "../../components/ui/Button";
import TableSkeleton from "../../components/shared/skeletons/TableSkeleton";
import InputText from "../../components/ui/input/InputText";
import editIcon from ".../../../../assets/icons/Table/edit.svg";

import {
  pageToShow,
  paginatorTemplate,
  rowsToShow,
} from "../../config/data-table/dataTableConfig";
import { Delete, Plus, Save, Search, X } from "lucide-react";
import type {
  ProductItem,
  Color,
} from "../../types/products/productItem.types";
import {
  getProductItems,
  createProductItem,
  updateProductItem,
  deleteProductItem,
  getColors,
} from "../../services/products/productItem.service";
import { productItemFormSchema } from "../../schemas/products/productItem.schema";
import SearchableSelect from "../../components/ui/select/SearchableSelect";

const ProductItem = () => {
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [skuFilter, setSkuFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const filterBySku = {
    SKU: { value: skuFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [items, colorsData] = await Promise.all([
          getProductItems(),
          getColors(),
        ]);
        setProductItems(items);
        setColors(colorsData);
        console.log(colorsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch product items.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleDeleteProductItem = async () => {
    try {
      await deleteProductItem(rowData?.id!);
      setModalVisibility(false);
      setReload(!reloadData);
    } catch (error) {
      console.error("Error deleting product item:", error);
    }
  };

  const handleCreateProductItem = async (formData: FormData) => {
    const formFields = {
      SKU: formData.get("SKU") as string,
      quantity_allocated: Number(formData.get("quantity_allocated")),
      price_override: Number(formData.get("price_override")),
      color: formData.get("color") ? Number(formData.get("color")) : undefined,
      item_image: imageFile,
    };

    const validation = productItemFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      ...validation.data,
      barcode: `BC-${Math.random().toString(36).substring(2, 10)}`, // Auto-generated
      product: 1, // You'll need to get this from props or context
    };

    try {
      await createProductItem(payload);
      setModalVisibility(false);
      setReload(!reloadData);
      setImageFile(null);
      setFormValidationErrors({});
    } catch (error) {
      console.error("Error creating product item:", error);
    }
  };

  const handleUpdateProductItem = async (formData: FormData) => {
    const formFields = {
      SKU: formData.get("SKU") as string,
      quantity_allocated: Number(formData.get("quantity_allocated")),
      price_override: Number(formData.get("price_override")),
      color: formData.get("color") ? Number(formData.get("color")) : undefined,
      item_image: imageFile,
    };

    const validation = productItemFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      ...validation.data,
      item_image: imageFile || undefined,
    };

    try {
      const confirmation = await updateProductItem(rowData?.id!, payload);
      if (confirmation.status === 200) {
        setModalVisibility(false);
        setReload(!reloadData);
        setImageFile(null);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating product item:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Product Items</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Product Item
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setSkuFilter(e.target.value)}
            value={skuFilter}
            className=""
            type="search"
            placeholder="Search by SKU..."
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
          value={productItems}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterBySku}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="SKU"
            header="SKU"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="quantity_allocated"
            header="Qty Allocated"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="price_override"
            header="Price Override"
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
                src={rowData.item_image}
                alt={rowData.SKU}
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
            setImageFile(null);
          }}
          modalTitle="Create Product Item"
        >
          <form
            action={handleCreateProductItem}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="SKU"
                name="SKU"
                label="SKU"
                checkErrorField={formValidationErrors.SKU}
              />
              <InputText
                placeholder="Quantity Allocated"
                name="quantity_allocated"
                label="Quantity Allocated"
                type="number"
                defaultValue={0}
                checkErrorField={formValidationErrors.quantity_allocated}
              />
              <InputText
                placeholder="Price Override"
                name="price_override"
                label="Price Override"
                defaultValue={0}
                checkErrorField={formValidationErrors.price_override}
              />
              <div>
                {/* <Dropdown
                  name="color"
                  options={colors.map(color => ({
                    label: color.name,
                    value: color.id
                  }))}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Color"
                  className="w-full"
                /> */}
                <SearchableSelect
                className="pl-0"
                  name="status"
                  label="Color"
                  options={colors ?? []}
                  value={selectedColor}
                  onChange={(val) => setSelectedColor(val)}
                  labelKey="name"
                  valueKey="id"
                  placeholder="Select Color"
                  checkErrorField={formValidationErrors.department}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept="image/jpeg, image/png, image/webp"
                />
                {formValidationErrors.item_image && (
                  <p className="mt-1 text-sm text-red-600">
                    {formValidationErrors.item_image[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 form-footer">
              <Button
                className="btn-gray"
                onClick={() => {
                  setModalVisibility(false);
                  setFormValidationErrors({});
                  setImageFile(null);
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
            setImageFile(null);
          }}
          modalTitle="Update Product Item"
        >
          <form action={handleUpdateProductItem}>
            <div className="space-y-4">
              <InputText
                placeholder="SKU"
                label="SKU"
                name="SKU"
                defaultValue={rowData?.SKU}
                checkErrorField={formValidationErrors.SKU}
              />
              <InputText
                placeholder="Quantity Allocated"
                label="Quantity Allocated"
                name="quantity_allocated"
                defaultValue={rowData?.quantity_allocated}
                checkErrorField={formValidationErrors.quantity_allocated}
              />
              <InputText
                placeholder="Price Override"
                label="Price Override"
                name="price_override"
                defaultValue={Number(rowData?.price_override)}
                checkErrorField={formValidationErrors.price_override}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <Dropdown
                  name="color"
                  options={colors.map((color) => ({
                    label: color.name,
                    value: color.id,
                  }))}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Color"
                  className="w-full"
                  defaultValue={rowData?.color || undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image
                </label>
                <div className="flex items-center gap-4 mb-2">
                  {rowData?.item_image && !imageFile && (
                    <img
                      src={rowData.item_image}
                      alt={rowData.SKU}
                      className="h-10 w-10 object-cover"
                    />
                  )}
                  {imageFile && (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="h-10 w-10 object-cover"
                    />
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept="image/jpeg, image/png, image/webp"
                />
                {formValidationErrors.item_image && (
                  <p className="mt-1 text-sm text-red-600">
                    {formValidationErrors.item_image[0]}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {!imageFile &&
                    "Current image will be kept if no new image is selected"}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => {
                  setModalVisibility(false);
                  setImageFile(null);
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
          modalTitle="Deleting Product Item"
        >
          <form action={handleDeleteProductItem}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                Product Item "{rowData?.SKU}" will be deleted permanently!
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

export default ProductItem;

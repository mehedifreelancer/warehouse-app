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
import type { ProductCategory } from "../../types/products/productCategory.types";
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategories,
  updateProductCategory,
} from "../../services/products/productCategory.service";
import { productCategoryFormSchema, productCategoryUpdateFormSchema } from "../../schemas/products/productCategory.schema";

const ProductCategory = () => {
  const [productCategoriesList, setProductCategoriesList] = useState<ProductCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryNameFilter, setCategoryNameFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const filterByCategoryName = {
    category_name: { value: categoryNameFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProductCategories();
        setProductCategoriesList(res);
      } catch (error) {
        console.error("Failed to fetch product categories:", error);
        setError("Failed to fetch product categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateProductCategory = async (formData: FormData) => {
    const formFields = {
      category_name: formData.get("category_name") as string,
      use_as_menu: formData.get("use_as_menu") === "on",
    };

    const validation = productCategoryFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await createProductCategory(validation.data);
      if (confirmation.status === 200 || confirmation.status === 201) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error creating product category:", error);
    }
  };

  const handleUpdateProductCategory = async (formData: FormData) => {
    const formFields = {
      category_name: formData.get("category_name") as string,
      use_as_menu: formData.get("use_as_menu") === "on",
    };

    const validation = productCategoryUpdateFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      console.log("Validation errors:", validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await updateProductCategory(rowData?.id!, validation.data);
      if (confirmation.status === 200) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating product category:", error);
    }
  };

  const handleDeleteProductCategory = async () => {
    try {
      const confirmation = await deleteProductCategory(rowData?.id!);
      if (confirmation.status === 200 || confirmation.status === 204) {
        setModalVisibility(false);
        setReload(!reloadData);
      }
    } catch (error) {
      console.error("Error deleting product category:", error);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Product Categories List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Category
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setCategoryNameFilter(e.target.value)}
            value={categoryNameFilter}
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
          value={productCategoriesList ?? []}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterByCategoryName}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="category_name"
            header="Category Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="slug"
            header="Slug"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="use_as_menu"
            header="Use as Menu"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (rowData.use_as_menu ? "Yes" : "No")}
          />
          <Column
            field="created_at"
            header="Created At"
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
          modalTitle="Create Product Category"
        >
          <form
            action={handleCreateProductCategory}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="Category Name"
                name="category_name"
                label="Category Name"
                checkErrorField={formValidationErrors.category_name}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use_as_menu"
                  name="use_as_menu"
                  className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="use_as_menu"
                  className="text-sm text-[#444050] dark:text-[#cAcAcA]"
                >
                  Use as Menu
                </label>
              </div>
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
          modalTitle="Update Product Category"
        >
          <form action={handleUpdateProductCategory}>
            <div className="space-y-4">
              <InputText
                placeholder="Category Name"
                label="Category Name"
                name="category_name"
                defaultValue={rowData?.category_name}
                checkErrorField={formValidationErrors.category_name}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use_as_menu"
                  name="use_as_menu"
                  defaultChecked={rowData?.use_as_menu}
                  className="h-4 w-4 rounded border-gray-300  focus:ring-indigo-500 "
                />
                <label
                  htmlFor="use_as_menu"
                  className="text-sm text-[#444050] dark:text-[#cAcAcA]"
                >
                  Use as Menu
                </label>
              </div>
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
          modalTitle="Deleting Product Category"
        >
          <form action={handleDeleteProductCategory}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                Category "{rowData?.category_name}" will be deleted permanently!
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

export default ProductCategory;
import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import editIcon from ".../../../../assets/icons/Table/edit.svg";
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
import { Beer, Delete, Plus, Save, Search, X } from "lucide-react";
import type { Product } from "../../types/products/product.types";
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/products/product.service";

const Product = () => {
  const [productList, setProductList] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const filterByName = {
    name: { value: nameFilter, matchMode: "contains" as const },
  };

  //   const createWorkProcess = async (formData: FormData) => {
  //     const workProcessName = formData.get("work-process")?.toString();
  //     const result = workProcessFormSchema.safeParse({
  //       name: workProcessName,
  //     });
  //     if (!result.success) {
  //       setFormValidationErrors(result.error.flatten().fieldErrors);
  //       return;
  //     }
  //     const payload: WorkProcessPayload = {
  //       name: workProcessName,
  //     };
  //     const confirmation = await postWorkProcess(payload);
  //     if (confirmation.statusCode === 201) {
  //       setModalVisibility(false);
  //       setReload(!reloadData);
  //     }
  //   };

  //   const updateWorkProcess = async (formData: FormData) => {
  //     const workProcessName = formData.get("work-process")?.toString();
  //     const result = workProcessFormSchema.safeParse({
  //       name: workProcessName,
  //     });
  //     if (!result.success) {
  //       setFormValidationErrors(result.error.flatten().fieldErrors);
  //       return;
  //     }
  //     const payload: WorkProcessPayload = {
  //       name: workProcessName,
  //     };
  //     const confirmation = await editWorkProcess(rowData!.id, payload);
  //     if (confirmation.statusCode === 200) {
  //       setModalVisibility(false);
  //       setReload(!reloadData);
  //     }
  //   };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        setProductList(res);
      } catch (error) {
        console.error("Failed to fetch work processes:", error);
        setError("Failed to fetch work processes.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  //Deleting Product 

  const handleDeleteProduct = async () => {
    try {
      const confirmation = await deleteProduct(rowData?.id!);
      if (confirmation.status === 204) {
        setModalVisibility(false);
        setReload(!reloadData);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    console.log(formData.get("price"));
    
  const payload = {
    name: formData.get("name")?.toString(),
    price: formData.get("price"),
  };

  try {
    const response = await updateProduct(rowData?.id!, payload);
    if (response.status === 200) {
      setModalVisibility(false);
      setReload(!reloadData);
    }
  } catch (error) {
    console.error("Error updating product:", error);
  }
};


  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Product List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered "
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Product
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
          value={productList ?? []}
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
            header="P. Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="category"
            header="Product Category"
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
            field="feature_image"
            header="Product Image"
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (
              <img
                className="h-[30px] w-[30px] object-cover"
                src={rowData.feature_image}
                alt={rowData.name}
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
                <Beer
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
          modalCrossAction={() => setFormValidationErrors({})}
          modalTitle="Create Product"
        >
          <form
            className="dark:bg-[#1e2939] form-content"
            action={"createWorkProcess"}
          >
            <div className="formwork-body">
              <InputText
                placeholder="Product Name"
                name="product"
                label="Name"
                checkErrorField={formValidationErrors.name}
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
                <X size={20} className="" />
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
          modalCrossAction={() => setFormValidationErrors({})}
          modalTitle="Update Product"
        >
          <form action={handleUpdateProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputText
              placeholder="Product Name"
              label="Name"
              name="name"
              defaultValue={rowData?.name}
              checkErrorField={formValidationErrors.name}
            />
            <InputText
              placeholder="Product Price"
              label="price"
              name="price"
              defaultValue={rowData?.price}
              checkErrorField={formValidationErrors.price}
            />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setModalVisibility(false)}
                className="btn-gray"
              >
                <X size={20} className="" />
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
          modalTitle="Deleting Product"
        >
          <form action={handleDeleteProduct}>
            <div className="my-3 flex flex-col gap-4 ">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure !
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                " {rowData?.name} " will be deleted permanently !
              </h3>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setModalVisibility(false)}
                className="btn-gray"
              >
                <X size={20} className="" />
                Cancel
              </Button>

              <Button type="submit" className="btn-danger">
                <Beer size={20} className="mr-1 " />
                Delete
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Product;

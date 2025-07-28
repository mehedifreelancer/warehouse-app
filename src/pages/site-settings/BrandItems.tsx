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
import { Delete, Plus, Save, Search, X } from "lucide-react";
import {
  createBrandItem,
  deleteBrandItem,
  getBrandItems,
  updateBrandItem,
} from "../../services/authorization/brand-items.service";
import type { BrandItem } from "../../types/site-settings/brand-items.types";
import {
  createBrandItemSchema,
  updateBrandItemSchema,
} from "../../schemas/site-settings/brand-items.schema";

const BrandItems = () => {
  const [items, setItems] = useState<BrandItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [titleFilter, setTitleFilter] = useState("");
  const [modalFor, setModalFor] = useState("");
  const [rowData, setRowData] = useState<BrandItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReload] = useState(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const filterByTitle = {
    title: { value: titleFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getBrandItems();
        setItems(res);
      } catch (error) {
        setError("Failed to fetch brand items");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateItem = async (formData: FormData) => {
    const formFields = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      campaign_text: formData.get("campaign_text") as string,
      category: Number(formData.get("category")),
      image: imageFile, // Required for create
    };

    const validation = createBrandItemSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      await createBrandItem(validation.data);
      setModalVisibility(false);
      setReload(!reloadData);
      setImageFile(null);
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

const handleUpdateItem = async (formData: FormData) => {
  const formFields = {
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    campaign_text: formData.get("campaign_text") as string,
    category: Number(formData.get("category")),
    image: imageFile // This will be undefined if no new image selected
  };

  const validation = updateBrandItemSchema.safeParse(formFields);
  if (!validation.success) {
    setFormValidationErrors(validation.error.flatten().fieldErrors);
    return;
  }

  try {
    const apiPayload = new FormData();
    apiPayload.append("title", formFields.title);
    apiPayload.append("subtitle", formFields.subtitle);
    apiPayload.append("campaign_text", formFields.campaign_text);
    apiPayload.append("category", formFields.category.toString());
    
    // Only append image if a new one was selected
    if (imageFile) {
      apiPayload.append("image", imageFile);
    } else {
      // Explicitly tell backend to keep existing image
      apiPayload.append("keep_existing_image", "true");
    }

    await updateBrandItem(rowData?.id!, apiPayload);
    setModalVisibility(false);
    setReload(!reloadData);
    setImageFile(null);
  } catch (error) {
    console.error("Update failed:", error);
  }
};

  const handleDeleteItem = async () => {
    try {
      await deleteBrandItem(rowData?.id!);
      setModalVisibility(false);
      setReload(!reloadData);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Brand Items</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Brand Item
        </Button>
        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setTitleFilter(e.target.value)}
            value={titleFilter}
            className=""
            type="search"
            placeholder="Search by title..."
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
          value={items ?? []}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterByTitle}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="title"
            header="Title"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="subtitle"
            header="Subtitle"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="campaign_text"
            header="Campaign Text"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="category"
            header="Category"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            header="Image"
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) =>
              rowData.image ? (
                <img
                  src={rowData.image}
                  alt={rowData.title}
                  className="h-10 w-10 object-cover"
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )
            }
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
          modalTitle="Create Brand Item"
        >
          <form
            action={handleCreateItem}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="Enter title"
                name="title"
                label="Title"
                checkErrorField={formValidationErrors.title}
              />
              <InputText
                placeholder="Enter subtitle"
                name="subtitle"
                label="Subtitle"
                checkErrorField={formValidationErrors.subtitle}
              />
              <InputText
                placeholder="Enter campaign text"
                name="campaign_text"
                label="Campaign Text"
                checkErrorField={formValidationErrors.campaign_text}
              />
              <InputText
                placeholder="Enter category ID"
                name="category"
                label="Category ID"
                type="number"
                checkErrorField={formValidationErrors.category}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image *
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
                  accept="image/jpeg, image/png"
                />
                {formValidationErrors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {formValidationErrors.image[0]}
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
          modalTitle="Update Brand Item"
        >
          <form action={handleUpdateItem}>
            <div className="space-y-4">
              <InputText
                placeholder="Enter title"
                name="title"
                label="Title"
                defaultValue={rowData?.title}
                checkErrorField={formValidationErrors.title}
              />
              <InputText
                placeholder="Enter subtitle"
                name="subtitle"
                label="Subtitle"
                defaultValue={rowData?.subtitle}
                checkErrorField={formValidationErrors.subtitle}
              />
              <InputText
                placeholder="Enter campaign text"
                name="campaign_text"
                label="Campaign Text"
                defaultValue={rowData?.campaign_text}
                checkErrorField={formValidationErrors.campaign_text}
              />
              <InputText
                placeholder="Enter category ID"
                name="category"
                label="Category ID"
                type="number"
                defaultValue={rowData?.category.toString()}
                checkErrorField={formValidationErrors.category}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image
                </label>
                <div className="flex items-center gap-4 mb-2">
                  {rowData?.image && !imageFile && (
                    <img
                      src={rowData.image}
                      alt={rowData.title}
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
                  accept="image/jpeg, image/png"
                />
                {formValidationErrors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {formValidationErrors.image[0]}
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
          modalTitle="Deleting Brand Item"
        >
          <form action={handleDeleteItem}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                "{rowData?.title}" will be deleted permanently!
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

export default BrandItems;

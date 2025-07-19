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
import { Beer, Delete, Plus, Save, Search, X } from "lucide-react";
import type {
  Color,
  UpdateColorPayload,
} from "../../types/products/color.types";
import {
  createColor,
  deleteColor,
  getColors,
  updateColor,
} from "../../services/products/colors.service";
import { colorFormSchema } from "../../schemas/products/color.schema";

const Color = () => {
  const [colorList, setColorList] = useState<Color[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<Color | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const filterByName = {
    name: { value: nameFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getColors();
        setColorList(res);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
        setError("Failed to fetch colors.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateColor = async (formData: FormData) => {
    const formFields = {
      name: formData.get("name") as string,
      note: formData.get("note") as string,
      image: imageFile,
    };

    const validation = colorFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    const payload: CreateColorPayload = {
      ...validation.data,
      image: validation.data.image, // Already validated
    };

    try {
      const confirmation = await createColor(payload);
      if (confirmation.status === 200 || confirmation.status === 201) {
        setModalVisibility(false);
        setReload(!reloadData);
        setImageFile(null);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error creating color:", error);
    }
  };

  const handleUpdateColor = async (formData: FormData) => {
    const formFields = {
      name: formData.get("name") as string,
      note: formData.get("note") as string,
      image: imageFile,
    };

    const validation = colorFormSchema.safeParse({
      ...formFields,
      image: formFields.image || rowData?.image, // For update, allow existing image
    });

    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    const payload: UpdateColorPayload = {
      name: validation.data.name,
      note: validation.data.note,
      image: imageFile || undefined, // Your preferred structure
    };

    try {
      const confirmation = await updateColor(rowData?.id!, payload);
      if (confirmation.status === 200) {
        setModalVisibility(false);
        setReload(!reloadData);
        setImageFile(null);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating color:", error);
    }
  };
    const handleDeleteColor = async () => {
    try {
      const confirmation = await deleteColor(rowData?.id!);
      if (confirmation.status === 200 || confirmation.status === 204) {
        setModalVisibility(false);
        setReload(!reloadData);
      }
    } catch (error) {
      console.error("Error deleting color:", error);
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
      <div className="data-table-heading">Color List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Color
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
          value={colorList ?? []}
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
            header="Color Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="note"
            header="Note"
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
                src={rowData.image}
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
          modalCrossAction={() => {
            setFormValidationErrors({});
            setImageFile(null);
          }}
          modalTitle="Create Color"
        >
          <form
            action={handleCreateColor}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="Color Name"
                name="name"
                label="Name"
                checkErrorField={formValidationErrors.name}
                required
              />
              <InputText
                placeholder="Note"
                name="note"
                label="Note"
                checkErrorField={formValidationErrors.note}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image *
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  required
                  className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                  accept="image/jpeg, image/png, image/webp"
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
          modalTitle="Update Color"
        >
          <form action={handleUpdateColor}>
            <div className="space-y-4">
              <InputText
                placeholder="Color Name"
                label="Name"
                name="name"
                defaultValue={rowData?.name}
                checkErrorField={formValidationErrors.name}
              />
              <InputText
                placeholder="Note"
                label="Note"
                name="note"
                defaultValue={rowData?.note}
                checkErrorField={formValidationErrors.note}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image *
                </label>
                <div className="flex items-center gap-4 mb-2">
                  {rowData?.image && !imageFile && (
                    <img
                      src={rowData.image}
                      alt={rowData.name}
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
          modalTitle="Deleting Color"
        >
          <form action={handleDeleteColor}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                "{rowData?.name}" will be deleted permanently!
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

export default Color;

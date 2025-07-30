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
import type { Slider } from "../../types/site-settings/sliders.types";
import {
  createSlider,
  deleteSlider,
  getSliders,
  updateSlider,
} from "../../services/site-settings/sliders.service";
import {
  sliderFormSchema,
  sliderUpdateFormSchema,
} from "../../schemas/site-settings/sliders.schema";
import { getProductCategories } from "../../services/products/productCategory.service";
import type { ProductCategory } from "../../types/products/productCategory.types";
import SearchableSelect from "../../components/ui/select/SearchableSelect";

const Sliders = () => {
  const [slidersList, setSlidersList] = useState<Slider[] | null>(null);
  const [categoryList, setCategoryList] = useState<ProductCategory[] | null>(
    null
  );

  const [error, setError] = useState<string | null>(null);
  const [subTitleFilter, setSubTitleFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<Slider | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<ProductCategory | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const filterBySubTitle = {
    sub_title: { value: subTitleFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getSliders();
        const catList = await getProductCategories();
        setSlidersList(res);
        setCategoryList(catList);
        console.log(catList);
      } catch (error) {
        console.error("Failed to fetch sliders:", error);
        setError("Failed to fetch sliders.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateSlider = async (formData: FormData) => {
    const formFields = {
      image: imageFile,
      sub_title: formData.get("sub_title") as string,
      intro_one: formData.get("intro_one") as string,
      intro_two: formData.get("intro_two") as string,
      offer_text: formData.get("offer_text") as string,
      category: Number(selectedCategoryId),
    };

    const validation = sliderFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      console.error("Validation failed:", validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await createSlider(validation.data);
      if (confirmation.status === 200 || confirmation.status === 201) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error creating slider:", error);
    }
  };

  const handleUpdateSlider = async (formData: FormData) => {
    const formFields = {
      sub_title: formData.get("sub_title") as string,
      intro_one: formData.get("intro_one") as string,
      intro_two: formData.get("intro_two") as string,
      offer_text: formData.get("offer_text") as string,
      category: Number(selectedCategoryId),
      image: imageFile,
    };

    const validation = sliderUpdateFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
            console.error("Validation failed:", validation.error.flatten().fieldErrors);

      return;
    }

    try {
      const apiPayload = new FormData();
      apiPayload.append("sub_title", formFields.sub_title);
      apiPayload.append("intro_one", formFields.intro_one);
      apiPayload.append("intro_two", formFields.intro_two);
      apiPayload.append("offer_text", formFields.offer_text);
      apiPayload.append("category", formFields.category.toString());

      if (imageFile) {
        apiPayload.append("image", imageFile);
      } else {
        apiPayload.append("keep_existing_image", "true");
      }

      const confirmation = await updateSlider(rowData?.id!, apiPayload);
      if (confirmation.status === 200) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error updating slider:", error);
    }
  };

  const handleDeleteSlider = async () => {
    try {
      const confirmation = await deleteSlider(rowData?.id!);
      if (confirmation.status === 200 || confirmation.status === 204) {
        setModalVisibility(false);
        setReload(!reloadData);
      }
    } catch (error) {
      console.error("Error deleting slider:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  console.log(rowData);
  
  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Sliders List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Slider
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setSubTitleFilter(e.target.value)}
            value={subTitleFilter}
            className=""
            type="search"
            placeholder="Search by sub title..."
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
          value={slidersList ?? []}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterBySubTitle}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="sub_title"
            header="Sub Title"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="intro_one"
            header="Intro One"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="intro_two"
            header="Intro Two"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="offer_text"
            header="Offer Text"
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
                  alt="Slider"
                  className="w-16 h-16 object-cover"
                />
              ) : (
                <span>No Image</span>
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
          modalTitle="Create Slider"
        >
          <form
            action={handleCreateSlider}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="Sub Title"
                name="sub_title"
                label="Sub Title"
                checkErrorField={formValidationErrors.sub_title}
              />
              <InputText
                placeholder="Intro One"
                name="intro_one"
                label="Intro One"
                checkErrorField={formValidationErrors.intro_one}
              />
              <InputText
                placeholder="Intro Two"
                name="intro_two"
                label="Intro Two"
                checkErrorField={formValidationErrors.intro_two}
              />
              <InputText
                placeholder="Offer Text"
                name="offer_text"
                label="Offer Text"
                checkErrorField={formValidationErrors.offer_text}
              />
              <SearchableSelect
                name="cat"
                value={selectedCategoryId}
                onChange={setSelectedCategoryId}
                options={categoryList ?? []}
                label="Select Category"
                valueKey="id"
                labelKey="category_name"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image *
                </label>
                <div className="flex items-center gap-4 mb-2">
            
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
          modalTitle="Update Slider"
        >
          <form action={handleUpdateSlider}>
            <div className="space-y-4">
             
              <InputText
                placeholder="Sub Title"
                label="Sub Title"
                name="sub_title"
                defaultValue={rowData?.sub_title}
                checkErrorField={formValidationErrors.sub_title}
              />
              <InputText
                placeholder="Intro One"
                label="Intro One"
                name="intro_one"
                defaultValue={rowData?.intro_one}
                checkErrorField={formValidationErrors.intro_one}
              />
              <InputText
                placeholder="Intro Two"
                label="Intro Two"
                name="intro_two"
                defaultValue={rowData?.intro_two}
                checkErrorField={formValidationErrors.intro_two}
              />
              <InputText
                placeholder="Offer Text"
                label="Offer Text"
                name="offer_text"
                defaultValue={rowData?.offer_text}
                checkErrorField={formValidationErrors.offer_text}
              />
              <SearchableSelect
                name="cat"
                value={rowData?.category}
                onChange={setSelectedCategoryId}
                options={categoryList ?? []}
                label="Select Category"
                valueKey="id"
                labelKey="category_name"
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
                  setFormValidationErrors({});
                  setImageFile(null);
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
          modalTitle="Deleting Slider"
        >
          <form action={handleDeleteSlider}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                "{rowData?.sub_title}" will be deleted permanently!
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

export default Sliders;

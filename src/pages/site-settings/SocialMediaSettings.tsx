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
import { Plus, Save, Search, X } from "lucide-react";
import type { SocialMediaIcon } from "../../types/site-settings/sociaMediaSettings.types";
import { createSocialMediaIcon, getSocialMediaIcons, updateSocialMediaIcon } from "../../services/site-settings/sociaMediaSettings.service";
import { socialMediaIconFormSchema, socialMediaIconUpdateFormSchema } from "../../schemas/site-settings/sociaMediaSettings.schema";

const SocialMediaSettings = () => {
  const [socialMediaIconsList, setSocialMediaIconsList] = useState<SocialMediaIcon[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<SocialMediaIcon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const filterByName = {
    name: { value: nameFilter, matchMode: "contains" as const },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getSocialMediaIcons();
        setSocialMediaIconsList(res);
      } catch (error) {
        console.error("Failed to fetch social media icons:", error);
        setError("Failed to fetch social media icons.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateSocialMediaIcon = async (formData: FormData) => {
    const formFields = {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
    };

    const validation = socialMediaIconFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await createSocialMediaIcon(validation.data);
      if (confirmation) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error creating social media icon:", error);
    }
  };

  const handleUpdateSocialMediaIcon = async (formData: FormData) => {
    const formFields = {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
    };

    const validation = socialMediaIconUpdateFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      console.log("Validation errors:", validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await updateSocialMediaIcon(rowData?.id!, validation.data);
      if (confirmation) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating social media icon:", error);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Social Media Icons List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Social Media
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
          value={socialMediaIconsList ?? []}
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
            header="Platform Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="url"
            header="URL"
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
          modalTitle="Add Social Media Icon"
        >
          <form
            action={handleCreateSocialMediaIcon}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="Platform Name (e.g., Facebook)"
                name="name"
                label="Platform Name"
                checkErrorField={formValidationErrors.name}
              />
              <InputText
                placeholder="URL (e.g., https://www.facebook.com/yourpage)"
                name="url"
                label="URL"
                checkErrorField={formValidationErrors.url}
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
          modalTitle="Update Social Media Icon"
        >
          <form action={handleUpdateSocialMediaIcon}>
            <div className="space-y-4">
              <InputText
                placeholder="Platform Name"
                label="Platform Name"
                name="name"
                readOnly={true}
                defaultValue={rowData?.name}
                checkErrorField={formValidationErrors.name}
              />
              <InputText
                placeholder="URL"
                label="URL"
                name="url"
                defaultValue={rowData?.url}
                checkErrorField={formValidationErrors.url}
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
    </div>
  );
};

export default SocialMediaSettings;
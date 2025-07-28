import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Modal from "../../components/common/Modal";
import { GlobalContext } from "../../layouts/RootLayout";
import editIcon from "../../assets/icons/Table/edit.svg";
import Button from "../../components/ui/Button";
import TableSkeleton from "../../components/shared/skeletons/TableSkeleton";
import {
  pageToShow,
  paginatorTemplate,
  rowsToShow,
} from "../../config/data-table/dataTableConfig";
import { Delete, Plus, Save, Search, X } from "lucide-react";
import {
  createContactRequest,
  deleteContactRequest,
  getContactRequests,
  updateContactRequest,
} from "../../services/site-settings/contact-request.service";
import { contactRequestFormSchema } from "../../schemas/site-settings/contact-request.schema";
import type { ContactRequest } from "../../types/site-settings/contact-request.types";
import InputText from "../../components/ui/input/InputText";

const ContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [modalFor, setModalFor] = useState("");
  const [rowData, setRowData] = useState<ContactRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReload] = useState(false);
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
        const res = await getContactRequests();
        setRequests(res);
      } catch (error) {
        setError("Failed to fetch contact requests");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateRequest = async (formData: FormData) => {
    const formFields = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const validation = contactRequestFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      await createContactRequest(validation.data);
      setModalVisibility(false);
      setReload(!reloadData);
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  const handleUpdateRequest = async (formData: FormData) => {
    const formFields = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const validation = contactRequestFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      await updateContactRequest(rowData?.id!, validation.data);
      setModalVisibility(false);
      setReload(!reloadData);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteContactRequest(rowData?.id!);
      setModalVisibility(false);
      setReload(!reloadData);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Contact Requests</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={
            () => {
              setModalVisibility(true);
              setModalFor("create");
              setRowData(null);
              setFormValidationErrors({});
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Request
        </Button>
        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050]  dark:text-[#cAcAcA] "
          />
          <input
            onChange={(e) => setNameFilter(e.target.value)}
            value={nameFilter}
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
          value={requests ?? []}
          paginator
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
            field="email"
            header="Email"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="phone"
            header="Phone"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="subject"
            header="Subject"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="created_at"
            header="Date"
            body={(data) => new Date(data.created_at).toLocaleDateString()}
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            header="Actions"
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
                  className="w-[15px] cursor-pointer"
                  src={editIcon}
                  alt="Edit"
                />
                <Delete
                  onClick={() => {
                    setModalVisibility(true);
                    setModalFor("delete");
                    setRowData(rowData);
                  }}
                  className="w-[15px] cursor-pointer text-red-500"
                />
              </div>
            )}
          />
        </DataTable>
      )}

      {modalFor === "create" && (
        <Modal
          modalTitle="New Contact Request"
          modalCrossAction={() => {
            setModalVisibility(false);
            setFormValidationErrors({});
          }}
        >
          <form action={handleCreateRequest}>
            <div className="space-y-4">
              <InputText
                name="name"
                label="Name*"
                placeholder="Enter name"
                checkErrorField={formValidationErrors.name}
                
              />
              <InputText
                name="email"
                label="Email*"
                checkErrorField={formValidationErrors.email}
                placeholder="Enter email"
              />
              <InputText
                name="phone"
                label="Phone*"
                checkErrorField={formValidationErrors.phone}
                placeholder="Enter phone number"
              />
              <InputText
                name="subject"
                label="Subject*"
                checkErrorField={formValidationErrors.subject}
                placeholder="Enter subject"
              />
              <InputText
                name="message"
                label="Message*"
                checkErrorField={formValidationErrors.message}
                placeholder="Enter message"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setModalVisibility(false)}
                className="btn-gray"
              >
                <X size={20} /> Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                <Save size={20} className="mr-1" /> Create
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {/* Update Modal */}
      {modalFor === "update" && (
        <Modal modalTitle="Update Request">
          <form action={handleUpdateRequest}>
            <div className="space-y-4">
              <InputText
                name="name"
                label="Name"
                placeholder="Enter name"
                defaultValue={rowData?.name}
                checkErrorField={formValidationErrors.name}
              />
              <InputText
                name="email"
                label="Email"
                placeholder="Enter email"
                defaultValue={rowData?.email}
                checkErrorField={formValidationErrors.email}
              />
              <InputText
                name="phone"
                label="Phone"
                placeholder="Enter phone number"
                defaultValue={rowData?.phone}
                checkErrorField={formValidationErrors.phone}
              />
              <InputText
                name="subject"
                label="Subject"
                placeholder="Enter subject"
                defaultValue={rowData?.subject}
                checkErrorField={formValidationErrors.subject}
              />
              <InputText
                name="message"
                label="Message"
                placeholder="Enter message"
                type="textarea"
                defaultValue={rowData?.message}
                checkErrorField={formValidationErrors.message}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setModalVisibility(false)}
                className="btn-gray"
              >
                <X size={20} /> Cancel
              </Button>
              <Button type="submit" className="btn-success">
                <Save size={20} className="mr-1" /> Update
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {modalFor === "delete" && (
        <Modal modalTitle="Delete Request">
          <div className="my-3">
            <h3 className="text-[#444050]  dark:text-[#cAcAcA] ">
              Delete request from {rowData?.name}?
            </h3>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setModalVisibility(false)}
              className="btn-gray"
            >
              <X size={20} /> Cancel
            </Button>
            <Button onClick={handleDeleteRequest} className="btn-danger">
              <Delete size={20} className="mr-1" /> Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactRequests;

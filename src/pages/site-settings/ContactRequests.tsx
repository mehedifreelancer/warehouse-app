import { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Modal from "../../components/common/Modal";
import { GlobalContext } from "../../layouts/RootLayout";
import Button from "../../components/ui/Button";
import TableSkeleton from "../../components/shared/skeletons/TableSkeleton";
import {
  paginatorTemplate,
  rowsToShow,
} from "../../config/data-table/dataTableConfig";
import { Delete, Search, Trash2, X } from "lucide-react";
import {
  deleteContactRequest,
  getContactRequests,
} from "../../services/site-settings/contact-request.service";
import type { ContactRequest } from "../../types/site-settings/contact-request.types";

const ContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [modalFor, setModalFor] = useState("");
  const [rowData, setRowData] = useState<ContactRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReload] = useState(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);


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
                <Trash2
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
              <Trash2 size={20} className="mr-1" /> Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactRequests;

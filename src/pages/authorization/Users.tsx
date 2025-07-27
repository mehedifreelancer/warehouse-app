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
import type { User } from "../../types/authorization/users.types";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/authorization/users.service";
import { userFormSchema } from "../../schemas/authorization/users.schema";
import { log } from "console";

const Users = () => {
  const [usersList, setUsersList] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usernameFilter, setUsernameFilter] = useState<string>("");
  const [modalFor, setModalFor] = useState<string>("");
  const [rowData, setRowData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReload] = useState<boolean>(false);
  const { setModalVisibility } = useContext<any>(GlobalContext);
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const filterByUsername = {
    username: { value: usernameFilter, matchMode: "contains" as const },
  };

    const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUsers();
        setUsersList(res);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleCreateUser = async (formData: FormData) => {
    const formFields = {
      username: formData.get("username") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      is_superuser: formData.get("is_superuser") === "on",
      password: formData.get("password") as string,
    };

    const validation = userFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await createUser(validation.data);
      if (confirmation.status === 200 || confirmation.status === 201) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
 const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  
  if (name === "password") {
    setPassword(value);
  } else {
    setPasswordConfirmation(value);
  }
};

  const handleUpdateUser = async (formData: FormData) => {
    const formFields = {
      username: formData.get("username") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      is_active: formData.get("is_active") === "on",
      is_superuser: formData.get("is_superuser") === "on",
      is_staff: formData.get("is_staff") === "on",
    };

    const validation = userFormSchema.safeParse(formFields);
    if (!validation.success) {
      setFormValidationErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      const confirmation = await updateUser(rowData?.id!, validation.data);
      if (confirmation.status === 200) {
        setModalVisibility(false);
        setReload(!reloadData);
        setFormValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const confirmation = await deleteUser(rowData?.id!);
      if (confirmation.status === 200 || confirmation.status === 204) {
        setModalVisibility(false);
        setReload(!reloadData);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  if (error) return <p className="p-6">{error}</p>;

  const tableHeader = (
    <div className="data-table-header">
      <div className="data-table-heading">Users List</div>
      <div className="flex gap-2">
        <Button
          className="btn-bordered"
          onClick={() => {
            setModalVisibility(true);
            setModalFor("create");
          }}
        >
          <Plus size={16} className="mr-1" />
          Add User
        </Button>

        <div className="relative table-search">
          <Search
            size={18}
            className="absolute top-2.5 ml-2 text-[#444050] dark:text-[#cAcAcA]"
          />
          <input
            onChange={(e) => setUsernameFilter(e.target.value)}
            value={usernameFilter}
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
          value={usersList ?? []}
          paginator
          pageLinkSize={pageToShow}
          rows={rowsToShow}
          filters={filterByUsername}
          paginatorTemplate={paginatorTemplate}
          header={tableHeader}
          tableClassName="data-table"
          rowClassName={() => "data-table-row"}
        >
          <Column
            field="username"
            header="Username"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="first_name"
            header="First Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />
          <Column
            field="last_name"
            header="Last Name"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
          />

          <Column
            field="is_active"
            header="Active"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (rowData.is_active ? "Yes" : "No")}
          />
          <Column
            field="is_superuser"
            header="Superuser"
            sortable
            headerClassName="data-table-column-header"
            bodyClassName="data-table-column-body"
            body={(rowData) => (rowData.is_superuser ? "Yes" : "No")}
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
          modalTitle="Create User"
        >
          <form
            action={handleCreateUser}
            className="dark:bg-[#1e2939] form-content"
          >
            <div className="formwork-body space-y-4">
              <InputText
                placeholder="Username"
                name="username"
                label="Username"
                checkErrorField={formValidationErrors.username}
              />
              <InputText
                placeholder="First Name"
                name="first_name"
                label="First Name"
                checkErrorField={formValidationErrors.first_name}
              />
              <InputText
                placeholder="Last Name"
                name="last_name"
                label="Last Name"
                checkErrorField={formValidationErrors.last_name}
              />
              <InputText
                placeholder="Password"
                name="password"
                label="Password"
                type="password"
                onChange={handlePasswordChange}
                checkErrorField={formValidationErrors.first_name}
              />
              <InputText
                label="Re type Password" 
                placeholder="Password"
                name="password-confirmation"
                type="password"
                onChange={(e) => handlePasswordChange(e)}
              />
              {passwordConfirmation.length > 0 && password !== passwordConfirmation && (
  <p className="text-red-500 text-sm mt-1">
    Passwords do not match!
  </p>
)}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_superuser"
                  name="is_superuser"
                  className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="is_superuser"
                  className="text-sm text-[#444050] dark:text-[#cAcAcA]"
                >
                  Superuser
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
          modalTitle="Update User"
        >
          <form action={handleUpdateUser}>
            <div className="space-y-4">
              <InputText
                placeholder="Username"
                label="Username"
                name="username"
                defaultValue={rowData?.username}
                checkErrorField={formValidationErrors.username}
              />
              <InputText
                placeholder="First Name"
                label="First Name"
                name="first_name"
                defaultValue={rowData?.first_name}
                checkErrorField={formValidationErrors.first_name}
              />
              <InputText
                placeholder="Last Name"
                label="Last Name"
                name="last_name"
                defaultValue={rowData?.last_name}
                checkErrorField={formValidationErrors.last_name}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={rowData?.is_active}
                  className="h-4 w-4 rounded border-gray-300  focus:ring-indigo-500 "
                />
                <label
                  htmlFor="is_active"
                  className="text-sm text-[#444050] dark:text-[#cAcAcA]"
                >
                  Active
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_superuser"
                  name="is_superuser"
                  defaultChecked={rowData?.is_superuser}
                  className="h-4 w-4 rounded border-gray-300  focus:ring-indigo-500 "
                />
                <label
                  htmlFor="is_superuser"
                  className="text-sm text-[#444050] dark:text-[#cAcAcA]"
                >
                  Superuser
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_staff"
                  name="is_staff"
                  defaultChecked={rowData?.is_staff}
                  className="h-4 w-4 rounded border-gray-300  focus:ring-indigo-500 "
                />
                <label
                  htmlFor="is_staff"
                  className="text-sm text-[#444050] dark:text-[#cAcAcA]"
                >
                  Staff
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
          modalTitle="Deleting User"
        >
          <form action={handleDeleteUser}>
            <div className="my-3 flex flex-col gap-4">
              <h2 className="text-[#444050] dark:text-[#cAcAcA] font-bold">
                Are You Sure!
              </h2>
              <h3 className="text-[#444050] dark:text-[#cAcAcA]">
                "{rowData?.username}" will be deleted permanently!
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

export default Users;

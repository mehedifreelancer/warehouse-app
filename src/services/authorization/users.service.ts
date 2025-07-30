import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { User, UsersResponse, CreateUserPayload, UpdateUserPayload } from "../../types/users/users.types";

export const getUsers = (): Promise<User[]> =>
  api
    .get<UsersResponse>("/users/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch users:", err);
      throw err;
    });

export const createUser = (payload: CreateUserPayload): Promise<AxiosResponse<User>> => {
  return api
    .post<User>("/users/", payload)
    .then((res) => {
      toastCustom({
        title: "User Created",
        message: `User "${res.data.username}" was successfully created.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create user.";
      toastCustom({
        title: "Creation Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const updateUser = async (
  id: number,
  payload: UpdateUserPayload
): Promise<AxiosResponse<User>> => {
  try {
    const res = await api.patch<User>(`/users/${id}/`, payload);

    toastCustom({
      title: "User Updated",
      message: `User "${res.data.username}" was successfully updated.`,
      type: "success",
    }); 

    return res;
  } catch (err: any) {
    console.error("Failed to update user:", err.status);
                       
    const errorMessage =
       err?.respose?.data?.username[0] || "Failed to update user.";

    toastCustom({ 
      title: "Update Failed",
      message: errorMessage,
      type: "error",
    });

    throw err; // rethrow for the caller to handle if needed
  }
};

export const deleteUser = (id: number): Promise<AxiosResponse<void>> =>
  api
    .delete(`/users/${id}/`)
    .then((res) => {
      toastCustom({
        title: "User Deleted",
        message: "User was successfully deleted.",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete user.";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
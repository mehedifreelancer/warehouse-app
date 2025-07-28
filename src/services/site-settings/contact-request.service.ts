import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type {
  ContactRequest,
  ContactRequestsResponse,
  UpdateContactRequestPayload,
} from "../../types/site-settings/contact-request.types";
import type { ContactRequestFormData } from "../../schemas/site-settings/contact-request.schema";

export const getContactRequests = (): Promise<ContactRequest[]> =>
  api
    .get<ContactRequestsResponse>("/site/contact-requests/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch contact requests:", err);
      throw err;
    });

export const createContactRequest = (
  payload: ContactRequestFormData
): Promise<AxiosResponse<ContactRequest>> => {
  return api
    .post<ContactRequest>("/site/contact-requests/", payload)
    .then((res) => {
      toastCustom({
        title: "Created",
        message: `Request from ${res.data.name} was received`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to submit request";
      toastCustom({
        title: "Submission Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const updateContactRequest = (
  id: number,
  payload: UpdateContactRequestPayload
): Promise<AxiosResponse<ContactRequest>> => {
  return api
    .patch<ContactRequest>(`/site/dummyUpdate/${id}/`, payload)
    .then((res) => {
      toastCustom({
        title: "Updated",
        message: `Request from ${res.data.name} was updated`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update request";
      toastCustom({
        title: "Update Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const deleteContactRequest = (
  id: number
): Promise<AxiosResponse<void>> =>
  api
    .delete(`/site/contact-requests/${id}/`)
    .then((res) => {
      toastCustom({
        title: "Deleted",
        message: "Contact request was deleted",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete request";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });

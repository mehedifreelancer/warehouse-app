import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type {
  ContactRequest,
  ContactRequestsResponse,
} from "../../types/site-settings/contact-request.types";

export const getContactRequests = (): Promise<ContactRequest[]> =>
  api
    .get<ContactRequestsResponse>("/site/contact-requests/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch contact requests:", err);
      throw err;
    });



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

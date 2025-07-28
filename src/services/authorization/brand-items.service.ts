import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { 
  BrandItem, 
  BrandItemsResponse,
  CreateBrandItemPayload,
} from "../../types/site-settings/brand-items.types";

export const getBrandItems = (): Promise<BrandItem[]> =>
  api.get<BrandItemsResponse>("/site/brand-items/")
    .then(res => res.data)
    .catch(err => {
      console.error("Failed to fetch brand items:", err);
      throw err;
    });

export const createBrandItem = (payload: CreateBrandItemPayload): Promise<AxiosResponse<BrandItem>> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("subtitle", payload.subtitle);
  formData.append("campaign_text", payload.campaign_text);
  formData.append("category", payload.category.toString());
  if (payload.image) formData.append("image", payload.image);

  return api.post<BrandItem>("/site/brand-items/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
  .then(res => {
    toastCustom({
      title: "Created",
      message: `Brand Item "${res.data.title}" created`,
      type: "success",
    });
    return res;
  })
  .catch(err => {
    toastCustom({
      title: "Creation Failed",
      message: err.response?.data?.message || "Failed to create brand item",
      type: "error",
    });
    throw err;
  });       
};

export const updateBrandItem = (
  id: number,
  formData: FormData
): Promise<AxiosResponse<BrandItem>> => {
  return api.patch<BrandItem>(`/site/brand-items/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => {
    toastCustom({
      title: "Updated",
      message: `Brand Item "${res.data.title}" updated`,
      type: "success",
    });
    return res;
  })
  .catch((err) => {
    toastCustom({
      title: "Update Failed",
      message: err.response?.data?.message || "Failed to update brand item",
      type: "error",
    });
    throw err;
  });
};
export const deleteBrandItem = (id: number): Promise<AxiosResponse<void>> =>
  api.delete(`/site/dummy-brand-items/${id}/`)
    .then(res => {
      toastCustom({
        title: "Deleted",
        message: "Brand item deleted successfully",
        type: "success",
      });
      return res;
    })
    .catch(err => {
      toastCustom({
        title: "Deletion Failed",
        message: err.response?.data?.message || "Failed to delete brand item",
        type: "error",
      });
      throw err;
    });
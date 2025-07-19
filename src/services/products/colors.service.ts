import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { Color, ColorResponse, CreateColorPayload, UpdateColorPayload } from "../../types/products/color.types";

export const getColors = (): Promise<Color[]> =>
  api
    .get<ColorResponse>("/product/colors/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch colors:", err);
      throw err;
    });

export const createColor = (payload: CreateColorPayload): Promise<AxiosResponse<Color>> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.note) formData.append("note", payload.note);
  if (payload.image) formData.append("image", payload.image);

  return api
    .post<Color>("/product/colors/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      toastCustom({
        title: "Color Created",
        message: `Color "${res.data.name}" was successfully created.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create color.";
      toastCustom({
        title: "Creation Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const updateColor = (
  id: number,
  payload: UpdateColorPayload
): Promise<AxiosResponse<Color>> => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.note) formData.append("note", payload.note);
  if (payload.image) formData.append("image", payload.image);

  return api
    .patch<Color>(`/product/colors/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      toastCustom({
        title: "Color Updated",
        message: `Color "${res.data.name}" was successfully updated.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update color.";
      toastCustom({
        title: "Update Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const deleteColor = (id: number): Promise<AxiosResponse<void>> =>
  api
    .delete(`/product/colors/${id}/`)
    .then((res) => {
      toastCustom({
        title: "Color Deleted",
        message: "Color was successfully deleted.",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete color.";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });


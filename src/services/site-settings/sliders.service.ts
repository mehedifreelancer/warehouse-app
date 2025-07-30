import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { 
  Slider, 
  SlidersResponse, 
  CreateSliderPayload 
} from "../../types/site-settings/sliders.types";

export const getSliders = (): Promise<SlidersResponse> =>
  api
    .get<SlidersResponse>("/site/sliders/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch sliders:", err);
      throw err;
    });

export const createSlider = (payload: CreateSliderPayload): Promise<AxiosResponse<Slider>> => {
  const formData = new FormData();
  
  if (payload.image) formData.append('image', payload.image);
  formData.append('sub_title', payload.sub_title);
  formData.append('intro_one', payload.intro_one);
  formData.append('intro_two', payload.intro_two);
  formData.append('offer_text', payload.offer_text);
  formData.append('category', payload.category.toString());

  return api
    .post<Slider>("/site/sliders/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      toastCustom({
        title: "Slider Created",
        message: `Slider was successfully created.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create slider.";
      toastCustom({
        title: "Creation Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const updateSlider = (
  id: number,
  payload: FormData
): Promise<AxiosResponse<Slider>> => {
  return api.patch<Slider>(`/site/sliders/${id}/`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => {
    toastCustom({
      title: "Updated",
      message: `Slider "${res.data.sub_title}" updated`,
      type: "success",
    });
    return res;
  })
  .catch((err) => {
    toastCustom({
      title: "Update Failed",
      message: err.response?.data?.message || "Failed to update slider",
      type: "error",
    });
    throw err;
  });
};


export const deleteSlider = (id: number): Promise<AxiosResponse<void>> =>
  api
    .delete(`/site/sliders/${id}/`)
    .then((res) => {
      toastCustom({
        title: "Slider Deleted",
        message: "Slider was successfully deleted.",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete slider.";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
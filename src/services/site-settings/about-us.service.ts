import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { AboutUsData } from "../../types/site-settings/about-us.types";

export const getAboutUs = async (): Promise<AboutUsData> => {
  try {
    const response = await api.get('/site/about-us/');
    return response.data;
  } catch (error) {
    toastCustom({
      title: 'Error',
      message: 'Failed to fetch about us content',
      type: 'error'
    });
    throw error;
  }
};

export const updateAboutUs = async (formData: FormData): Promise<AboutUsData> => {
  try {
    const response = await api.patch('/site/about-us/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toastCustom({
      title: 'Success',
      message: 'About us content updated successfully',
      type: 'success'
    });
    return response.data;
  } catch (error) {
    toastCustom({
      title: 'Error',
      message: 'Failed to update about us content',
      type: 'error'
    });
    throw error;
  }
};
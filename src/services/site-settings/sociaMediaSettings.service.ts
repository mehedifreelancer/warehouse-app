import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { CreateSocialMediaIconPayload, SocialMediaIcon, SocialMediaIconsResponse, UpdateSocialMediaIconPayload } from "../../types/site-settings/sociaMediaSettings.types";


export const getSocialMediaIcons = async (): Promise<SocialMediaIconsResponse> => {
  try {
    const response = await api.get<SocialMediaIconsResponse>('/site/social-media/');
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to fetch social media icons.';
    
    toastCustom({
      title: "Fetch Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error fetching social media icons:', error);
    throw error;
  }
};

export const createSocialMediaIcon = async (
  payload: CreateSocialMediaIconPayload
): Promise<SocialMediaIcon> => {
  try {
    const response = await api.post<SocialMediaIcon>('/site/social-media/', payload);
    
    toastCustom({
      title: "Social Media Created",
      message: `Social media icon was successfully created.`,
      type: "success",
    });
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.name || 'Failed to create social media icon.';
    
    toastCustom({
      title: "Creation Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error creating social media icon:', error);
    throw error;
  }
};

export const updateSocialMediaIcon = async (
  id: number,
  payload: UpdateSocialMediaIconPayload
): Promise<SocialMediaIcon> => {
  try {
    const response = await api.put<SocialMediaIcon>(`/site/social-media/${id}/`, payload);
    
    toastCustom({
      title: "Social Media Updated",
      message: `Social media icon was successfully updated.`,
      type: "success",
    });
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to update social media icon.';
    
    toastCustom({
      title: "Update Failed",
      message: errorMessage,
      type: "error",
    });
    
    console.error('Error updating social media icon:', error);
    throw error;
  }
};
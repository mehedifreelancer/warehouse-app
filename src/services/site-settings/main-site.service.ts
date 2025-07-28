import api from '../../config/api/api-config';
import { toastCustom } from '../../components/ui/CustomToast';
import type { MainSite } from '../../types/site-settings/main-site.types';

export const getMainSite = async (): Promise<MainSite> => {
  try {
    const response = await api.get('/site/mainsite/');
    return response.data;
  } catch (error) {
    toastCustom({
      title: 'Error',
      message: 'Failed to fetch site settings',
      type: 'error'
    });
    throw error;
  }
};

export const updateMainSite = async (formData: FormData): Promise<MainSite> => {
  try {
    const response = await api.put('/site/mainsite/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    toastCustom({
      title: 'Success',
      message: 'Site settings updated successfully',
      type: 'success'
    });
    
    return response.data;
  } catch (error) {
    toastCustom({
      title: 'Error',
      message: 'Failed to update site settings',
      type: 'error'
    });
    throw error;
  }
};
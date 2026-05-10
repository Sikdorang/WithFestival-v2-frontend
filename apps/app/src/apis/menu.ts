import axios from 'axios';
import axiosInstance from '.';

export type PresignedResponse = {
  url: string;
};

export const menuAPI = {
  getMenus: async () => {
    const response = await axiosInstance.get('/menus');
    return response.data;
  },

  getMenusByStoreId: async (storeId: number) => {
    const response = await axiosInstance.get(`/stores/${storeId}/menus`);
    return response.data;
  },

  createMenu: async (formData: FormData) => {
    const response = await axiosInstance.post('/menus', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMenuImage: async (menuId: number) => {
    const response = await axiosInstance.delete(`/menu/${menuId}/image`);
    return response.data;
  },

  updateMenu: async (menuId: number, formData: FormData) => {
    const response = await axiosInstance.patch(`/menus/${menuId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMenu: async (menuId: number) => {
    const response = await axiosInstance.delete(`/menus/${menuId}`);
    return response.data;
  },

  getImageUploadUrl: async (menuId: number, body: { fileName: string }) => {
    return axiosInstance.patch(`/menu/${menuId}/image`, body);
  },

  uploadToS3: async (uploadUrl: string, file: File) => {
    return axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  setMenuSoldOut: async (menuId: number) => {
    const response = await axiosInstance.post(`/menus/${menuId}/sold-out`);
    return response.data;
  },

  setMenuAvailable: async (menuId: number) => {
    const response = await axiosInstance.post(`/menus/${menuId}/available`);
    return response.data;
  },
};

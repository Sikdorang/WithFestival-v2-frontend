import axios from 'axios';
import axiosInstance from '.';
import { CreateMenuDto } from '../types/payload/menu';

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

  createMenu: async (menu: CreateMenuDto) => {
    const response = await axiosInstance.post('/menus', menu);
    return response.data;
  },

  deleteMenuImage: async (menuId: number) => {
    const response = await axiosInstance.delete(`/menu/${menuId}/image`);
    return response.data;
  },

  updateMenu: async (menuId: number, menu: CreateMenuDto) => {
    const response = await axiosInstance.patch(`/menus/${menuId}`, menu);
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
};

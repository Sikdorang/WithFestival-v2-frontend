import axiosInstance from '.';
import { CreateMenuDto } from '../types/payload/menu';
import axios from 'axios';

export type PresignedResponse = {
  url: string;
};

export const menuAPI = {
  getMenu: async () => {
    const response = await axiosInstance.get('/menu/menus');
    return response.data;
  },

  getMenuByUserId: async (userId: number) => {
    const response = await axiosInstance.get(`/menu/user/${userId}`);
    return response.data;
  },

  createMenu: async (menu: CreateMenuDto) => {
    const response = await axiosInstance.post('/menu', menu);
    return response.data;
  },

  deleteMenuImage: async (menuId: number) => {
    const response = await axiosInstance.delete(`/menu/${menuId}/image`);
    return response.data;
  },

  updateMenu: async (menuId: number, menu: CreateMenuDto) => {
    const response = await axiosInstance.patch(`/menu/${menuId}`, menu);
    return response.data;
  },

  deleteMenu: async (menuId: number) => {
    const response = await axiosInstance.delete(`/menu/${menuId}`);
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

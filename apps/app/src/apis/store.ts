import axiosInstance from '.';

export const storeAPI = {
  getUserInfo: async () => {
    const response = await axiosInstance.get('/menu/user-info');
    return response.data;
  },

  getUserInfoByUserId: async (userId: number) => {
    const response = await axiosInstance.get(`/order/user/${userId}/info`);
    return response.data;
  },

  updateStoreInfo: async (account: string) => {
    const response = await axiosInstance.patch('/user/account', { account });
    return response.data;
  },

  updateStoreName: async (name: string) => {
    const response = await axiosInstance.patch('/user/name', { name });
    return response.data;
  },

  updateStoreNotice: async (notice: string) => {
    const response = await axiosInstance.patch('/user/notice', { notice });
    return response.data;
  },

  updateStoreEvent: async (event: string) => {
    const response = await axiosInstance.patch('/user/event', { event });
    return response.data;
  },
};

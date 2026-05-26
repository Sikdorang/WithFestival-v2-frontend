import axiosInstance from '.';

export const storeAPI = {
  getStorePublicInfo: async (storeId: number) => {
    const response = await axiosInstance.get(`/stores/${storeId}/info`);
    console.log('통신 직후 원본 데이터1:', response.data);
    return response.data;
  },

  getStoreMyInfo: async () => {
    const response = await axiosInstance.get('/stores/me/info');
    console.log('통신 직후 원본 데이터2:', response.data);
    return response.data;
  },

  updateStoreInfo: async (accountNumber: string) => {
    const response = await axiosInstance.patch('/stores/account-number', {
      accountNumber,
    });
    return response.data;
  },

  updateStoreName: async (name: string) => {
    const response = await axiosInstance.patch('/stores/name', { name });
    return response.data;
  },

  updateStoreNotice: async (notice: string) => {
    const response = await axiosInstance.patch('/stores/notice', { notice });
    return response.data;
  },

  updateStoreEvent: async (event: string) => {
    const response = await axiosInstance.patch('/stores/event', { event });
    return response.data;
  },

  updateStoreReservationEnabled: async (reservationEnabled: boolean) => {
    const response = await axiosInstance.patch('/stores/reservation-enabled', {
      reservationEnabled,
    });
    return response.data;
  },

  updateStoreMissionsEnabled: async (missionsEnabled: boolean) => {
    const response = await axiosInstance.patch('/stores/missions-enabled', {
      missionsEnabled,
    });
    return response.data;
  },

  updateStoreWaitingsEnabled: async (waitingsEnabled: boolean) => {
    const response = await axiosInstance.patch('/stores/waitings-enabled', {
      waitingsEnabled,
    });
    return response.data;
  },
};

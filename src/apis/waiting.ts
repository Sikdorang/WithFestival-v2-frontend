import axiosInstance from '.';
import { WaitingDTO } from '../types/payload/waiting';

export const waitingAPI = {
  getWaiting: async () => {
    const response = await axiosInstance.get('/waiting/unprocessed');
    return response.data;
  },

  getWaitingByUserId: async (userId: number) => {
    const response = await axiosInstance.get(`/waiting/user/${userId}`);
    return response.data;
  },

  createWaiting: async (waiting: WaitingDTO) => {
    const response = await axiosInstance.post('/waiting', waiting);
    return response.data;
  },

  setWaitingProcessed: async (waitingId: number) => {
    const response = await axiosInstance.patch(`/waiting/${waitingId}/process`);
    return response.data;
  },

  deleteWaiting: async (waitingId: string) => {
    const response = await axiosInstance.delete(`/waiting/${waitingId}`);
    return response.data;
  },
};

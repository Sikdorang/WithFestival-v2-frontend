import { CreateMessagePayload } from '@/types/payload/message';
import axiosInstance from '.';

export const messageAPI = {
  createMessage: async (payload: CreateMessagePayload) => {
    return axiosInstance.post('/message', payload);
  },

  getMessages: async () => {
    return axiosInstance.get('/message');
  },

  checkMessage: async (messageId: number) => {
    return axiosInstance.patch(`/message/${messageId}/check`);
  },
};

import { CreateOrderDto } from '@/types/payload/order';
import axiosInstance from '.';
interface CreateOrderPayload extends CreateOrderDto {
  userId: number;
}

export const orderAPI = {
  createOrder: async (payload: CreateOrderPayload) => {
    const response = await axiosInstance.post('/order', payload);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await axiosInstance.get('/order');
    return response.data;
  },

  deleteOrder: async (orderId: number) => {
    const response = await axiosInstance.delete(`/order/${orderId}`);
    return response.data;
  },

  getPendingOrders: async () => {
    const response = await axiosInstance.get('/order/pending');
    return response.data;
  },

  getSentOrders: async () => {
    const response = await axiosInstance.get('/order/sent');
    return response.data;
  },

  setOrderSent: async (orderId: number) => {
    const response = await axiosInstance.patch(`/order/${orderId}/send`);
    return response.data;
  },

  setOrderCooked: async (orderId: number) => {
    const response = await axiosInstance.patch(`/order/${orderId}/cooked`);
    return response.data;
  },
};

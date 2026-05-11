import { CreateOrderPayload } from '@/types/payload/order';
import axiosInstance from '.';

export const orderAPI = {
  // 주문 생성
  createOrder: async (payload: CreateOrderPayload) => {
    const response = await axiosInstance.post('/orders', payload);
    return response.data;
  },

  // 주문 내역 목록 조회
  getOrders: async (paid: boolean) => {
    const response = await axiosInstance.get('/orders', {
      params: { paid },
    });
    return response.data;
  },

  // 주문 내역 전체 목록 조회
  getAllOrders: async () => {
    const response = await axiosInstance.get('/orders/all');
    return response.data;
  },

  // 결제 상태 변경 -> PAID
  setPaymentPaid: async (orderId: number) => {
    const response = await axiosInstance.patch(
      `/orders/${orderId}/payment/paid`,
    );
    return response.data;
  },

  // 결제 상태 변경 -> FAILED
  setPaymentFailed: async (orderId: number) => {
    const response = await axiosInstance.patch(
      `/orders/${orderId}/payment/failed`,
    );
    return response.data;
  },

  // 주문 처리 상태 변경 -> CANCELED
  setOrderCancelled: async (orderId: number) => {
    const response = await axiosInstance.patch(
      `/orders/${orderId}/status/cancelled`,
    );
    return response.data;
  },

  // 주문 처리 상태 변경 -> COMPLETED
  setOrderCompleted: async (orderId: number) => {
    const response = await axiosInstance.patch(
      `/orders/${orderId}/status/completed`,
    );
    return response.data;
  },
};

import {
  CreateWaitingDTO,
  UpdateWaitingStatusDTO,
} from '@/types/payload/waiting';
import axiosInstance from '.';

export const waitingAPI = {
  // 대기 팀 수 조회 (고객·공개)
  getActiveWaitingCount: async (storeId: number) => {
    const response = await axiosInstance.get(
      `/stores/${storeId}/waitings/active-count`,
    );
    return response.data; // { count: number } 반환
  },

  // 대기 등록 (고객)
  createWaiting: async (storeId: number, payload: CreateWaitingDTO) => {
    const response = await axiosInstance.post(
      `/stores/${storeId}/waitings`,
      payload,
    );
    return response.data;
  },

  // 대기 목록 (부스)
  getWaitings: async () => {
    const response = await axiosInstance.get('/waitings');
    return response.data;
  },

  // 대기 상태 변경 (부스)
  updateWaitingStatus: async (id: number, payload: UpdateWaitingStatusDTO) => {
    const response = await axiosInstance.patch(`/waitings/${id}`, payload);
    return response.data;
  },
};

import axiosInstance from '.';

export interface BlindDateRequest {
  name: string;
  age: number;
  contact: string;
  mbti: string;
  appearanceStyle: number;
  gender: 'MALE' | 'FEMALE';
  deliveryPhone: string;
}

export interface BlindDateResponse {
  id: number;
  name: string;
  age: number;
  contact: string;
  mbti: string;
  appearanceStyle: number;
  gender: 'MALE' | 'FEMALE';
  numberDelivered: boolean;
  deliveryPhone: string;
  createdAt: string;
  updatedAt: string;
}

export const datingAPI = {
  // 소개팅 명단 응모
  createBlindDate: async (
    data: BlindDateRequest,
  ): Promise<BlindDateResponse> => {
    const response = await axiosInstance.post('/blind-dates', data);
    return response.data;
  },

  // 소개팅 명단 전체 조회
  getBlindDates: async (): Promise<BlindDateResponse[]> => {
    const response = await axiosInstance.get('/blind-dates');
    return response.data;
  },
};

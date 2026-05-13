import axiosInstance from '.';

export interface TableLikePayload {
  nickname: string;
  storeId: number;
  tableId: number;
  tokenUuid?: string;
}

export interface TableLikeResponse {
  id: number;
  storeId: number;
  tableId: number;
  nickname: string;
  likeCount: number;
  tokenUuid: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreTableLikeResponse {
  storeId: number;
  tableId: number;
  totalLikeCount: number;
  likes: {
    nickname: string;
    likeCount: number;
  }[];
}

export const loveAlarmAPI = {
  // 테이블 좋아요 수 증가
  incrementLike: async (
    payload: TableLikePayload,
  ): Promise<TableLikeResponse> => {
    const { data } = await axiosInstance.post('/table-likes', payload);
    return data;
  },

  // 테이블 좋아요 닉네임 설정
  setNickname: async (
    payload: TableLikePayload,
  ): Promise<TableLikeResponse> => {
    const { data } = await axiosInstance.post('/table-likes/nickname', payload);
    return data;
  },

  // 스토어 전체 테이블 좋아요 목록 조회
  getStoreLikes: async (storeId: number): Promise<StoreTableLikeResponse[]> => {
    const { data } = await axiosInstance.get(`/stores/${storeId}/table-likes`);
    return data;
  },

  // 내가 받은 좋아요 수 조회
  getMyLikes: async (
    params?: Record<string, any>,
  ): Promise<TableLikeResponse> => {
    const { data } = await axiosInstance.get('/table-likes/me', { params });
    return data;
  },
};

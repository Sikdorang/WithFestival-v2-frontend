import axiosInstance from '.';

export interface CreateCouponDto {
  code: string;
  discountPrice: number;
  holder?: string | null;
}

export const couponAPI = {
  // 쿠폰 번호 검증 (JWT 불필요)
  validateCoupon: async (storeId: number, code: string) => {
    const response = await axiosInstance.post(
      `/stores/${storeId}/coupons/validate`,
      { code },
    );
    return response.data;
  },

  // 쿠폰 생성
  createCoupon: async (data: CreateCouponDto) => {
    const response = await axiosInstance.post('/coupons', data);
    return response.data;
  },

  // 쿠폰 목록 조회
  getCoupons: async () => {
    const response = await axiosInstance.get('/coupons');
    return response.data;
  },

  // 쿠폰 사용 여부 수정
  updateCouponUsed: async (id: number, used: boolean) => {
    const response = await axiosInstance.patch(`/coupons/${id}/used`, {
      used,
    });
    return response.data;
  },

  // 쿠폰 소지자 수정
  updateCouponHolder: async (id: number, holder: string | null) => {
    const response = await axiosInstance.patch(`/coupons/${id}/holder`, {
      holder,
    });
    return response.data;
  },
};

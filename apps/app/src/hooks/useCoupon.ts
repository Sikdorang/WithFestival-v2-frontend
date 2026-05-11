import { couponAPI, CreateCouponDto } from '@/apis/coupon';
import { handelError } from '@/apis/errorhandler';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export interface Coupon {
  id: number;
  code: string;
  discountPrice: number;
  used: boolean;
  holder: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useCoupon = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateCoupon = async (storeId: number, code: string) => {
    setIsLoading(true);
    try {
      const response = await couponAPI.validateCoupon(storeId, code);
      return response;
    } catch (error) {
      handelError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await couponAPI.getCoupons();
      setCoupons(response.data || response);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCoupon = async (data: CreateCouponDto) => {
    setIsLoading(true);
    try {
      await couponAPI.createCoupon(data);
      toast.success('쿠폰이 성공적으로 생성되었습니다.');
      await fetchCoupons();
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCouponUsed = async (id: number, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      const targetStatus = !currentStatus;
      await couponAPI.updateCouponUsed(id, targetStatus);

      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === id ? { ...coupon, used: targetStatus } : coupon,
        ),
      );
      toast.success('쿠폰 사용 상태가 변경되었습니다.');
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHolder = async (id: number, holder: string | null) => {
    setIsLoading(true);
    try {
      await couponAPI.updateCouponHolder(id, holder);

      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === id ? { ...coupon, holder } : coupon,
        ),
      );
      toast.success('소지자 정보가 업데이트되었습니다.');
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    coupons,
    isLoading,
    validateCoupon,
    fetchCoupons,
    createCoupon,
    toggleCouponUsed,
    updateHolder,
  };
};

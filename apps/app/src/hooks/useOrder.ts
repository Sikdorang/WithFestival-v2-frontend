import { handelError } from '@/apis/errorhandler';
import { orderAPI } from '@/apis/order';
import { useOrderStore } from '@/stores/orderStore';
import { OrderListApiResponse } from '@/types/global';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export const useOrder = () => {
  const [allOrders, setAllOrders] = useState<OrderListApiResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const { orderItems, clearOrder } = useOrderStore();

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  // 주문 생성
  const createOrder = async (depositorName: string) => {
    setIsLoading(true);
    setOrderError(null);

    if (orderItems.length === 0) {
      toast.error('주문할 메뉴가 없습니다.');
      setIsLoading(false);
      return false;
    }

    try {
      const itemsForApi = orderItems.map((item: any) => ({
        menuId: item.id || item.menuId,
        price: item.price,
        quantity: item.quantity,
      }));

      const totalOrderPrice = itemsForApi.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const payload = {
        items: itemsForApi,
        totalPrice: totalOrderPrice,
        depositorName,
      };

      await orderAPI.createOrder(userData.storeId, userData.tableId, payload);
      clearOrder();
      toast.success('주문이 완료되었습니다.');
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '주문 중 오류가 발생했습니다.';
      setOrderError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 주문 내역 목록 조회
  const getOrders = useCallback(async (paid?: boolean) => {
    try {
      const response =
        typeof paid === 'boolean'
          ? await orderAPI.getOrders(paid)
          : await orderAPI.getAllOrders();
      setAllOrders(response);
    } catch (error) {
      handelError(error);
    }
  }, []);

  // 결제 상태 변경 -> PAID
  const setPaymentPaid = async (orderId: number, currentFilter?: boolean) => {
    try {
      await orderAPI.setPaymentPaid(orderId);
      await getOrders(currentFilter);
      toast.success('결제 완료 처리되었습니다.');
    } catch (error) {
      handelError(error);
    }
  };

  // 결제 상태 변경 -> FAILED
  const setPaymentFailed = async (orderId: number, currentFilter?: boolean) => {
    try {
      await orderAPI.setPaymentFailed(orderId);
      await getOrders(currentFilter);
      toast.success('결제 실패 처리되었습니다.');
    } catch (error) {
      handelError(error);
    }
  };

  // 주문 처리 상태 변경 -> CANCELED
  const setOrderCancelled = async (
    orderId: number,
    currentFilter?: boolean,
  ) => {
    try {
      await orderAPI.setOrderCancelled(orderId);
      await getOrders(currentFilter);
      toast.success('주문이 취소되었습니다.');
    } catch (error) {
      handelError(error);
    }
  };

  // 주문 처리 상태 변경 -> COMPLETED
  const setOrderCompleted = async (
    orderId: number,
    currentFilter?: boolean,
  ) => {
    try {
      await orderAPI.setOrderCompleted(orderId);
      await getOrders(currentFilter);
      toast.success('주문 처리가 완료되었습니다.');
    } catch (error) {
      handelError(error);
    }
  };

  return {
    allOrders,
    createOrder,
    getOrders,
    setPaymentPaid,
    setPaymentFailed,
    setOrderCancelled,
    setOrderCompleted,
    isLoading,
    error: orderError,
  };
};

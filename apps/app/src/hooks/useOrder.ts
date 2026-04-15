import { handelError } from '@/apis/errorhandler';
import { messageAPI } from '@/apis/message';
import { orderAPI } from '@/apis/order';
import { useOrderStore } from '@/stores/orderStore';
import { IMessage, OrderListApiResponse } from '@/types/global';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export const useOrder = () => {
  const [allOrders, setAllOrders] = useState<OrderListApiResponse>();
  const [pendingOrders, setPendingOrders] = useState<OrderListApiResponse>();
  const [sentOrders, setSentOrders] = useState<OrderListApiResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { orderItems, clearOrder } = useOrderStore();

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  const createOrder = async (depositorName: string) => {
    setIsLoading(true);
    setOrderError(null);

    if (orderItems.length === 0) {
      toast.error('주문할 메뉴가 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const itemsForApi = orderItems.map((item) => ({
        menu: item.name,
        price: item.price,
        count: item.quantity,
        totalprice: item.price * item.quantity,
      }));

      const totalOrderPrice = itemsForApi.reduce(
        (sum, item) => sum + item.totalprice,
        0,
      );

      const payload = {
        items: itemsForApi,
        name: depositorName,
        tableNumber: String(userData.tableId),
        totalPrice: totalOrderPrice,
        userId: userData.userId,
      };

      await orderAPI.createOrder(payload);
      clearOrder();
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '주문 중 오류가 발생했습니다.';
      setOrderError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createServiceRequestOrder = async (requestMessage: string) => {
    setIsLoading(true);
    setOrderError(null);

    try {
      const payload = {
        items: [
          {
            menu: requestMessage,
            price: 0,
            count: 0,
            totalprice: 0,
          },
        ],
        name: '직원 호출',
        tableNumber: String(userData.tableId),
        totalPrice: 0,
        userId: userData.userId,
      };

      await orderAPI.createOrder(payload);
      toast.success('직원에게 요청사항이 전달되었습니다.');
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '요청 중 오류가 발생했습니다.';
      setOrderError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllOrders = useCallback(async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setAllOrders(response);
    } catch (error) {
      handelError(error);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: number) => {
    try {
      await orderAPI.deleteOrder(orderId);
      await Promise.all([getPendingOrders()]);
    } catch (error) {
      handelError(error);
    }
  }, []);

  const getPendingOrders = useCallback(async () => {
    try {
      const response = await orderAPI.getPendingOrders();
      setPendingOrders(response);
    } catch (error) {
      handelError(error);
    }
  }, []);

  const getSentOrders = useCallback(async () => {
    try {
      const response = await orderAPI.getSentOrders();
      setSentOrders(response);
    } catch (error) {
      handelError(error);
    }
  }, []);

  const setOrderSent = async (orderId: number) => {
    try {
      await orderAPI.setOrderSent(orderId);
      await Promise.all([getPendingOrders(), getSentOrders()]);
    } catch (error) {
      handelError(error);
    }
  };

  const setOrderCooked = async (orderId: number) => {
    try {
      await orderAPI.setOrderCooked(orderId);
      await Promise.all([getPendingOrders(), getSentOrders()]);
    } catch (error) {
      handelError(error);
    }
  };

  const getMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await messageAPI.getMessages();
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      handelError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const payload = {
        userId: userData.userId,
        tableNumber: String(userData.tableId),
        message,
      };
      await messageAPI.createMessage(payload);
      toast.success('메시지가 성공적으로 전송되었습니다.');
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkMessage = async (messageId: number) => {
    const originalMessage = messages?.find((msg) => msg.id === messageId);

    if (!originalMessage) {
      return;
    }

    if (originalMessage.check) {
      return;
    }

    try {
      const response = await messageAPI.checkMessage(messageId);
      if (response.data.success) {
        const updatedMessage = response.data.data;

        toast.success('고객 메세지를 확인했습니다.');

        setMessages((prevMessages) =>
          (prevMessages || []).map((msg) =>
            msg.id === messageId ? updatedMessage : msg,
          ),
        );
      }
    } catch (error) {
      handelError(error);
    }
  };

  return {
    allOrders,
    pendingOrders,
    sentOrders,
    createOrder,
    getAllOrders,
    getPendingOrders,
    getSentOrders,
    setOrderSent,
    setOrderCooked,
    deleteOrder,
    isLoading,
    messages,
    createMessage,
    checkMessage,
    getMessages,
    createServiceRequestOrder,
    error: orderError,
  };
};

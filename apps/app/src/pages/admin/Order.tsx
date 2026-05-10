import {
  default as EmptyPendingIcon,
  default as EmptySentIcon,
} from '@/assets/icons/ic_empty_paper.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import { OrderCard } from '@/components/pages/order/OrderCard';
import OrderTopBar from '@/components/pages/order/OrderTopBar';
import ServiceOrderCard from '@/components/pages/order/ServiceOrderCard';
import { useSocket } from '@/contexts/useSocket';
import { useOrder } from '@/hooks/useOrder';
import { useEffect, useState } from 'react';

const isServiceOrder = (order: any): boolean => {
  const items = order.items || order.orderUsers;
  const singleItem = items?.[0];

  return (
    (order.name === '직원 호출' || order.totalPrice === 0) &&
    items?.length === 1 &&
    singleItem?.price === 0 &&
    (singleItem?.quantity === 0 || singleItem?.count === 0)
  );
};

export default function Order() {
  const socket = useSocket();
  const [orderType, setOrderType] = useState<'pending' | 'sent'>('pending');

  const {
    allOrders,
    getOrders,
    setPaymentPaid,
    setOrderCompleted,
    setOrderCancelled,
    isLoading,
  } = useOrder();

  useEffect(() => {
    getOrders(orderType === 'sent');
  }, [orderType, getOrders]);

  useEffect(() => {
    const handleRefresh = () => {
      getOrders(orderType === 'sent');
    };

    if (socket) {
      socket.on('orderSendUpdated', handleRefresh);
      socket.on('orderCookedUpdated', handleRefresh);
      socket.on('orderDeleted', handleRefresh);
      socket.on('orderCreated', handleRefresh);

      return () => {
        socket.off('orderSendUpdated', handleRefresh);
        socket.off('orderCookedUpdated', handleRefresh);
        socket.off('orderDeleted', handleRefresh);
        socket.off('orderCreated', handleRefresh);
      };
    }
  }, [socket, orderType, getOrders]);

  const orderList = Array.isArray(allOrders)
    ? allOrders
    : allOrders?.data || [];
  const orderCount = Array.isArray(allOrders)
    ? allOrders.length
    : allOrders?.count || 0;

  const renderOrderList = (orders: any[]) => {
    return orders.map((order) =>
      isServiceOrder(order) ? (
        <ServiceOrderCard
          key={order.id}
          order={order}
          deleteOrder={(id) => setOrderCancelled(id, orderType === 'sent')}
          setOrderSent={(id) => setPaymentPaid(id, orderType === 'sent')}
          setOrderCooked={(id) => setOrderCompleted(id, orderType === 'sent')}
        />
      ) : (
        <OrderCard
          key={order.id}
          order={order}
          setOrderSent={(id) => setPaymentPaid(id, orderType === 'sent')}
          setOrderCooked={(id) => setOrderCompleted(id, orderType === 'sent')}
          deleteOrder={(id) => setOrderCancelled(id, orderType === 'sent')}
        />
      ),
    );
  };

  return (
    <div className="bg-gray-500-5 min-h-screen pb-10">
      <OrderTopBar
        orderCount={orderCount}
        type={orderType}
        onTypeChange={setOrderType}
      />

      <div className="relative flex flex-col gap-4 p-4 pt-4">
        {isLoading ? (
          <div className="flex min-h-[90vh] items-center justify-center pb-20 text-sm font-medium text-gray-400">
            주문 내역을 불러오는 중입니다...
          </div>
        ) : orderCount > 0 ? (
          renderOrderList(orderList)
        ) : (
          <div className="flex min-h-[90vh] items-center justify-center pb-20">
            <EmptyPlaceHolder
              image={
                orderType === 'pending' ? (
                  <EmptyPendingIcon color="white" />
                ) : (
                  <EmptySentIcon color="#36383E80" />
                )
              }
              text={
                orderType === 'pending'
                  ? '입금 대기 중인 주문이 없습니다.'
                  : '송금 완료된 주문이 없습니다.'
              }
            />
          </div>
        )}
        <BottomSpace />
      </div>
    </div>
  );
}

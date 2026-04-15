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
import { OrderSummary } from '@/types/global';
import { useEffect, useState } from 'react';

const isServiceOrder = (order: OrderSummary): boolean => {
  const singleItem = order.orderUsers?.[0];
  return (
    order.name === '직원 호출' &&
    order.orderUsers?.length === 1 &&
    singleItem?.price === 0 &&
    singleItem?.count === 0
  );
};

export default function Order() {
  const socket = useSocket();
  const [orderType, setOrderType] = useState<'pending' | 'sent'>('pending');

  const {
    getPendingOrders,
    getSentOrders,
    pendingOrders,
    sentOrders,
    setOrderSent,
    setOrderCooked,
    deleteOrder,
  } = useOrder();

  useEffect(() => {
    getPendingOrders();
    getSentOrders();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      getPendingOrders();
      getSentOrders();
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
  }, [socket]);

  const renderOrderList = (orders: OrderSummary[]) => {
    return orders.map((order) =>
      isServiceOrder(order) ? (
        <ServiceOrderCard
          key={order.id}
          order={order}
          deleteOrder={deleteOrder}
          setOrderSent={setOrderSent}
          setOrderCooked={setOrderCooked}
        />
      ) : (
        <OrderCard
          key={order.id}
          order={order}
          setOrderSent={setOrderSent}
          setOrderCooked={setOrderCooked}
          deleteOrder={deleteOrder}
        />
      ),
    );
  };

  return (
    <div className="bg-gray-500-5 min-h-screen pb-10">
      <OrderTopBar
        orderCount={
          orderType === 'pending'
            ? pendingOrders?.count || 0
            : sentOrders?.count || 0
        }
        type={orderType}
        onTypeChange={setOrderType}
      />

      <div className="relative flex flex-col gap-4 p-4 pt-4">
        {orderType === 'pending' ? (
          pendingOrders?.count && pendingOrders.count > 0 ? (
            renderOrderList(pendingOrders.data)
          ) : (
            <div className="flex min-h-[90vh] items-center justify-center pb-20">
              <EmptyPlaceHolder
                image={<EmptyPendingIcon color="white" />}
                text="신규 주문이 없습니다."
              />
            </div>
          )
        ) : sentOrders?.count && sentOrders.count > 0 ? (
          renderOrderList(sentOrders.data)
        ) : (
          <div className="flex min-h-[90vh] items-center justify-center pb-20">
            <EmptyPlaceHolder
              image={<EmptySentIcon color="#36383E80" />}
              text="송금 완료된 주문이 없습니다."
            />
          </div>
        )}
        <BottomSpace />
      </div>
    </div>
  );
}

import EmptyImage from '@/assets/icons/ic_empty_paper.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import OrderDashBoard from '@/components/pages/history/OrderDashBoard';
import { OrderBill } from '@/components/pages/order/OrderBill';
import ServiceOrderHistory from '@/components/pages/order/ServiceOrderHistory';
import TopBar from '@/components/pages/waiting/TopBar';
import { useOrder } from '@/hooks/useOrder';
import { OrderSummary } from '@/types/global';
import { useEffect } from 'react';

const isServiceOrder = (order: OrderSummary): boolean => {
  const singleItem = order.orderUsers?.[0];
  return (
    order.name === '직원 호출' &&
    order.orderUsers?.length === 1 &&
    singleItem?.price === 0 &&
    singleItem?.count === 0
  );
};

export default function History() {
  const { getAllOrders, allOrders } = useOrder();

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  return (
    <div className="flex min-h-screen flex-1 flex-col gap-4 bg-gray-500-10">
      <TopBar title="전체 주문 내역" value={allOrders?.count || 0} />

      <div className="relative flex flex-1 flex-col gap-4 p-4">
        <OrderDashBoard allOrders={allOrders || null} />

        {allOrders?.count && allOrders.count > 0 ? (
          allOrders.data.map((order) =>
            isServiceOrder(order) ? (
              <ServiceOrderHistory key={order.id} order={order} />
            ) : (
              <OrderBill key={order.id} order={order} />
            ),
          )
        ) : (
          <EmptyPlaceHolder
            image={<EmptyImage color="white" />}
            text="주문 이력이 없습니다."
          />
        )}

        <BottomSpace />
      </div>
    </div>
  );
}

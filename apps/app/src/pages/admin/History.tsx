import EmptyImage from '@/assets/icons/ic_empty_paper.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import ExpertInsightBox from '@/components/pages/history/ExpertInsightBox';
import HistoryTopBar from '@/components/pages/history/HistoryTopBar';
import OrderDashBoard from '@/components/pages/history/OrderDashBoard';
import { OrderBill } from '@/components/pages/order/OrderBill';
import ServiceOrderHistory from '@/components/pages/order/ServiceOrderHistory';
import { useOrder } from '@/hooks/useOrder';
import { useEffect } from 'react';

const isServiceOrder = (order: any): boolean => {
  const items = order.items || order.orderUsers;
  const singleItem = items?.[0];

  return (
    order.name === '직원 호출' &&
    items?.length === 1 &&
    singleItem?.price === 0 &&
    (singleItem?.quantity === 0 || singleItem?.count === 0)
  );
};

export default function History() {
  const { getOrders, allOrders, isLoading } = useOrder();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const orderList = Array.isArray(allOrders)
    ? allOrders
    : allOrders?.data || [];
  const orderCount = Array.isArray(allOrders)
    ? allOrders.length
    : allOrders?.count || 0;

  return (
    <div className="bg-gray-500-10 flex min-h-screen flex-1 flex-col gap-4">
      <HistoryTopBar title="전체 주문 내역" value={orderCount} />

      <div className="relative flex flex-1 flex-col gap-4 p-4">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center pb-20 text-sm font-medium text-gray-400">
            주문 내역을 불러오는 중입니다...
          </div>
        ) : orderCount > 0 ? (
          <>
            <ExpertInsightBox />
            <OrderDashBoard allOrders={allOrders} />

            {orderList.map((order: any) =>
              isServiceOrder(order) ? (
                <ServiceOrderHistory key={order.id} order={order} />
              ) : (
                <OrderBill key={order.id} order={order} />
              ),
            )}

            <BottomSpace />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center pb-4">
            <EmptyPlaceHolder
              image={<EmptyImage color="white" />}
              text="주문 이력이 없습니다."
            />
          </div>
        )}
      </div>
    </div>
  );
}

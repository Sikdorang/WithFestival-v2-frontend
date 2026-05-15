import EmptyImage from '@/assets/icons/ic_empty_paper.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import HistoryTopBar from '@/components/pages/history/HistoryTopBar';
import OrderDashBoard from '@/components/pages/history/OrderDashBoard';
import { OrderBill } from '@/components/pages/order/OrderBill';
import ServiceOrderHistory from '@/components/pages/order/ServiceOrderHistory';
import { useOrder } from '@/hooks/useOrder';
import { useEffect, useMemo, useState } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');

  const [historyType, setHistoryType] = useState<'TODAY' | 'ALL'>('TODAY');

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const rawOrderList = Array.isArray(allOrders)
    ? allOrders
    : allOrders?.data || [];

  const dateFilteredOrders = useMemo(() => {
    if (historyType === 'ALL') return rawOrderList;

    const now = new Date();
    const businessDayStart = new Date(now);

    if (now.getHours() < 6) {
      businessDayStart.setDate(businessDayStart.getDate() - 1);
    }
    businessDayStart.setHours(6, 0, 0, 0);

    const businessDayEnd = new Date(businessDayStart);
    businessDayEnd.setDate(businessDayEnd.getDate() + 1);

    return rawOrderList.filter((order: any) => {
      if (!order.createdAt) return true;

      const orderDate = new Date(order.createdAt);
      return orderDate >= businessDayStart && orderDate < businessDayEnd;
    });
  }, [rawOrderList, historyType]);

  const orderCount = dateFilteredOrders.length;

  const finalFilteredOrders = useMemo(() => {
    return dateFilteredOrders.filter((order: any) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.replace(/\s+/g, '').toLowerCase();

      const tableStr = String(order.tableId || '').toLowerCase();
      const nameStr = String(order.customerName || order.name || '')
        .replace(/\s+/g, '')
        .toLowerCase();

      return tableStr.includes(query) || nameStr.includes(query);
    });
  }, [dateFilteredOrders, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="bg-gray-500-10 flex min-h-screen flex-1 flex-col gap-4">
      <HistoryTopBar
        title={historyType === 'TODAY' ? '금일 주문 내역' : '전체 주문 내역'}
        value={orderCount}
        type={historyType}
        onTypeChange={setHistoryType}
      />

      <div className="relative flex flex-1 flex-col gap-4 p-4">
        {orderCount > 0 && (
          <div className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="테이블 번호 또는 입금자명 검색"
              className="focus:border-primary-300 w-full rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-800 transition-colors outline-none"
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center pb-20 text-sm font-medium text-gray-400">
            주문 내역을 불러오는 중입니다...
          </div>
        ) : orderCount > 0 ? (
          <>
            {!isSearching && <OrderDashBoard orders={dateFilteredOrders} />}

            {finalFilteredOrders.map((order: any) =>
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
              text={
                historyType === 'TODAY'
                  ? '금일 주문 이력이 없습니다.'
                  : '전체 주문 이력이 없습니다.'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

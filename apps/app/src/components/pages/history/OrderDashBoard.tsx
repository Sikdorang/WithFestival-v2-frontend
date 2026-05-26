import { OrderSummary } from '@/types/global';
import { useMemo } from 'react';
import HourlySalesChart, { HourlySalesData } from './HourlySalesChart';
import TopMenuChart, { TopMenuData } from './TopMenuChart';

interface Props {
  orders: OrderSummary[];
}

const DEFAULT_HOURLY_SALES: HourlySalesData[] = [
  { time: '17시', 매출: 0 },
  { time: '18시', 매출: 0 },
  { time: '19시', 매출: 0 },
  { time: '20시', 매출: 0 },
  { time: '21시', 매출: 0 },
  { time: '22시', 매출: 0 },
  { time: '23시', 매출: 0 },
  { time: '00시', 매출: 0 },
  { time: '01시', 매출: 0 },
];

export default function OrderDashBoard({ orders }: Props) {
  const summary = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalSales: 0,
        netProfit: 0,
        totalOrders: 0,
        hourlySales: DEFAULT_HOURLY_SALES,
        topMenus: [],
      };
    }

    const filteredOrders = orders.filter(
      (order) => order.totalPrice > 0 && order.status !== 'CANCELED',
    );

    let totalSales = 0;
    let netProfit = 0;
    let totalOrders = 0;

    const hourlySalesMap = new Map<string, number>(
      DEFAULT_HOURLY_SALES.map((item) => [item.time, 0]),
    );

    const menuDataMap = new Map<string, { quantity: number; price: number }>();

    filteredOrders.forEach((order) => {
      let orderSales = 0;

      order.items.forEach((item) => {
        const itemSales = item.price * item.quantity;
        orderSales += itemSales;
        totalSales += itemSales;
        netProfit += itemSales * ((item.margin || 0) / 100);

        if (item.menu && item.menu.name) {
          const currentData = menuDataMap.get(item.menu.name) || {
            quantity: 0,
            price: item.price,
          };
          menuDataMap.set(item.menu.name, {
            ...currentData,
            quantity: currentData.quantity + item.quantity,
          });
        }
      });

      totalOrders++;

      const orderTime = new Date(order.createdAt);
      const hour = orderTime.getHours();

      let hourKey = '';
      if (hour >= 17 && hour <= 23) {
        hourKey = `${hour}시`;
      } else if (hour === 0) {
        hourKey = '00시';
      } else if (hour === 1) {
        hourKey = '01시';
      }

      if (hourKey && hourlySalesMap.has(hourKey)) {
        hourlySalesMap.set(
          hourKey,
          (hourlySalesMap.get(hourKey) || 0) + orderSales,
        );
      }
    });

    const hourlySales = Array.from(hourlySalesMap.entries()).map(
      ([time, 매출]) => ({ time, 매출 }),
    );

    const topMenus: TopMenuData[] = Array.from(menuDataMap.entries())
      .map(([name, data]) => ({
        name,
        value: data.quantity, // value에는 수량 할당
        price: data.price, // price 추가
      }))
      .sort((a, b) => b.value - a.value);

    return { totalSales, netProfit, totalOrders, hourlySales, topMenus };
  }, [orders]);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm md:p-6">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
        <div className="flex items-center justify-between rounded-xl p-1 md:flex-col md:items-start md:justify-center md:bg-gray-50 md:p-5">
          <div className="text-b-1 text-gray-400 md:mb-1">총 주문</div>
          <div className="text-st-2 text-gray-800 md:text-2xl">
            {summary.totalOrders.toLocaleString()}건
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl p-1 md:flex-col md:items-start md:justify-center md:bg-gray-50 md:p-5">
          <div className="text-b-1 text-gray-400 md:mb-1">총 판매액</div>
          <div className="text-st-2 text-gray-800 md:text-2xl">
            {summary.totalSales.toLocaleString()}원
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl p-1 md:flex-col md:items-start md:justify-center md:bg-gray-50 md:p-5">
          <div className="text-b-1 text-gray-400 md:mb-1">순수익</div>
          <div className="text-st-2 text-gray-800 md:text-2xl">
            {Math.round(summary.netProfit).toLocaleString()}원
          </div>
        </div>
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex w-full flex-col rounded-xl md:bg-gray-50 md:p-5">
          <HourlySalesChart data={summary.hourlySales} />
        </div>

        <div className="flex w-full flex-col rounded-xl md:bg-gray-50 md:p-5">
          <div className="mb-4 text-lg font-bold text-gray-800">
            메뉴별 판매량
          </div>
          <TopMenuChart data={summary.topMenus} />
        </div>
      </div>
    </div>
  );
}

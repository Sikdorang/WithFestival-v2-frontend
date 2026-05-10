import { OrderSummary } from '@/types/global';
import { useMemo } from 'react';
import HourlySalesChart, { HourlySalesData } from './HourlySalesChart';

interface Props {
  orders: OrderSummary[];
}

const DUMMY_HOURLY_SALES: HourlySalesData[] = [
  { time: '17시', 매출: 0 },
  { time: '18시', 매출: 45000 },
  { time: '19시', 매출: 150000 },
  { time: '20시', 매출: 320000 },
  { time: '21시', 매출: 280000 },
  { time: '22시', 매출: 190000 },
  { time: '23시', 매출: 85000 },
  { time: '00시', 매출: 20000 },
  { time: '01시', 매출: 0 },
];

export default function OrderDashBoard({ orders }: Props) {
  const summary = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { totalSales: 0, netProfit: 0, totalOrders: 0, hourlySales: [] };
    }

    const filteredOrders = orders.filter((order) => {
      if (order.totalPrice === 0) return false;
      return true;
    });

    let totalSales = 0;
    let netProfit = 0;
    let totalOrders = 0;

    const hourlySalesMap = new Map<string, number>([
      ['17시', 0],
      ['18시', 0],
      ['19시', 0],
      ['20시', 0],
      ['21시', 0],
      ['22시', 0],
      ['23시', 0],
      ['00시', 0],
      ['01시', 0],
    ]);

    filteredOrders.forEach((order) => {
      let orderSales = 0;

      order.items.forEach((item) => {
        const itemSales = item.price * item.quantity;
        orderSales += itemSales;
        totalSales += itemSales;
        netProfit += itemSales * ((item.margin || 0) / 100);
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

    return { totalSales, netProfit, totalOrders, hourlySales };
  }, [orders]);

  const hasActualData = summary.hourlySales.some((data) => data.매출 > 0);
  const chartData = hasActualData ? summary.hourlySales : DUMMY_HOURLY_SALES;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-1 rounded-xl p-1">
          <div className="text-b-1 text-gray-400">총 주문</div>
          <div className="text-st-2 text-gray-800">
            {summary.totalOrders.toLocaleString()}건
          </div>
        </div>
        <div className="flex items-center justify-between gap-1 rounded-xl p-1">
          <div className="text-b-1 text-gray-400">총 판매액</div>
          <div className="text-st-2 text-gray-800">
            {summary.totalSales.toLocaleString()}원
          </div>
        </div>
        <div className="flex items-center justify-between gap-1 rounded-xl p-1">
          <div className="text-b-1 text-gray-400">순수익</div>
          <div className="text-st-2 text-gray-800">
            {Math.round(summary.netProfit).toLocaleString()}원
          </div>
        </div>
      </div>

      <HourlySalesChart data={chartData} />
    </div>
  );
}

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { OrderListApiResponse } from '@/types/global';

interface Props {
  allOrders: OrderListApiResponse | null;
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088FE',
  '#00C49F',
];

export default function OrderDashBoard({ allOrders }: Props) {
  const summary = useMemo(() => {
    if (!allOrders || !allOrders.data || allOrders.count === 0) {
      return { totalSales: 0, netProfit: 0, menuSales: [], totalOrders: 0 };
    }

    const filteredOrders = allOrders.data.filter((order) => {
      if (order.name !== '직원 호출') {
        return true;
      }

      const singleItem = order.orderUsers?.[0];
      if (
        order.orderUsers?.length !== 1 ||
        singleItem?.price !== 0 ||
        singleItem?.count !== 0
      ) {
        return true;
      }

      return false;
    });

    let totalSales = 0;
    let netProfit = 0;
    const menuSalesMap = new Map<string, number>();
    let totalOrders = 0;

    filteredOrders.forEach((order) => {
      order.orderUsers.forEach((item) => {
        const itemSales = item.price * item.count;
        totalSales += itemSales;
        netProfit += itemSales * ((item.margin || 0) / 100);
        menuSalesMap.set(
          item.menu,
          (menuSalesMap.get(item.menu) || 0) + item.count,
        );
      });
      totalOrders++;
    });

    const menuSales = Array.from(menuSalesMap.entries())
      .map(([name, 판매량]) => ({ name, 판매량 }))
      .sort((a, b) => b.판매량 - a.판매량);

    return { totalSales, netProfit, menuSales, totalOrders };
  }, [allOrders]);

  const chartWidth = Math.max(300, summary.menuSales.length * 60);

  const CustomXAxisTick = (props: { x: number; y: number; index: number }) => {
    const { x, y, index } = props;

    const dataPoint = summary.menuSales[index];

    if (!dataPoint) return null;

    const { name, 판매량 } = dataPoint;
    const MAX_CHARS_PER_LINE = 8;

    const lines =
      name.match(new RegExp(`.{1,${MAX_CHARS_PER_LINE}}`, 'g')) || [];
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={10}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={10}
        >
          {lines.map((line, i) => (
            <tspan x={0} dy={i === 0 ? 0 : '1.2em'} key={i}>
              {line}
            </tspan>
          ))}
        </text>

        <text
          x={0}
          y={0}
          dy={16 + lines.length * 15}
          textAnchor="middle"
          fill="#999"
          fontSize={11}
        >
          {`${판매량}개`}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
      <style>{`
        .recharts-wrapper:focus-visible {
          outline: none !important;
        }
      `}</style>

      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-1 rounded-xl p-1">
          <div className="text-b-1 text-gray-400">총 주문</div>
          <div className="text-st-2 text-gray-800">
            {summary.totalOrders.toLocaleString()}건
          </div>
        </div>
        <div className="flex items-center justify-between gap-1 rounded-xl p-1">
          <div className="text-b-1 text-gray-400">총 직원 호출</div>
          <div className="text-st-2 text-gray-800">
            {(Array.isArray(allOrders?.data)
              ? allOrders.data.length - summary.totalOrders
              : 0) || 0}
            건
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

      {summary.menuSales.length > 0 && (
        <div>
          <div className="text-st-2 mb-2 text-gray-800">메뉴별 판매량</div>

          <div className="w-full overflow-x-auto focus:outline-none">
            <BarChart
              width={chartWidth}
              height={200}
              data={summary.menuSales}
              margin={{ top: 15, right: 0, left: 0, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={<CustomXAxisTick x={0} y={0} index={0} />}
                height={50}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                contentStyle={{ fontSize: '14px', borderRadius: '12px' }}
                formatter={(value: number) => [`${value}개`, '판매량']}
              />
              <Bar dataKey="판매량" radius={[4, 4, 0, 0]} barSize={20}>
                {summary.menuSales.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
}

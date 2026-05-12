import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface HourlySalesData {
  time: string;
  매출: number;
}

interface HourlySalesChartProps {
  data: HourlySalesData[];
}

export default function HourlySalesChart({ data }: HourlySalesChartProps) {
  const maxSales = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((d) => d.매출));
  }, [data]);

  const formatYAxis = (value: number) => {
    if (value === 0) return '0';

    if (maxSales >= 10000) {
      const manValue = value / 10000;
      return Number.isInteger(manValue)
        ? `${manValue}만`
        : `${manValue.toFixed(1)}만`;
    }

    return value.toLocaleString();
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="text-st-2 mb-4 text-gray-800">시간대별 매출</div>

      <div className="h-[250px] w-full focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F2F4F6"
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#8B95A1' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: '#8B95A1' }}
              axisLine={false}
              tickLine={false}
              width={maxSales >= 10000 ? 45 : 55}
            />

            <Tooltip
              cursor={{
                stroke: '#E5E8EB',
                strokeWidth: 2,
                strokeDasharray: '5 5',
              }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(
                value:
                  | number
                  | string
                  | readonly (number | string)[]
                  | undefined,
              ) => {
                const targetValue = Array.isArray(value) ? value[0] : value;
                const numericValue = Number(targetValue) || 0;
                return [`${numericValue.toLocaleString()}원`, '매출'];
              }}
              labelStyle={{ color: '#8B95A1', marginBottom: '4px' }}
            />

            <Line
              type="monotone"
              dataKey="매출"
              stroke="#FFC224"
              strokeWidth={3}
              dot={{ r: 4, fill: '#FFC224', strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

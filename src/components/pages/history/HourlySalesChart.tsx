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
              tickFormatter={(value) =>
                value === 0 ? '0' : `${value / 10000}만`
              }
              tick={{ fontSize: 12, fill: '#8B95A1' }}
              axisLine={false}
              tickLine={false}
              width={45}
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
              formatter={(value: number) => [
                `${value.toLocaleString()}원`,
                '매출',
              ]}
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
import { useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface TopMenuData {
  name: string;
  value: number;
  price: number;
}

interface Props {
  data: TopMenuData[];
}

const COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
];

export default function TopMenuChart({ data }: Props) {
  const { filteredData, totalSales } = useMemo(() => {
    if (!data) return { filteredData: [], totalSales: 0 };

    const validData = data.filter((item) => item.price > 0);
    const total = validData.reduce((sum, item) => sum + item.value, 0);

    return { filteredData: validData, totalSales: total };
  }, [data]);

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center text-sm text-gray-400">
        아직 판매된 메뉴가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative h-[250px] w-full">
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
        <span className="text-[12px] text-gray-500">총 판매</span>
        <span className="text-[20px] font-bold text-gray-700">
          {totalSales}개
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
          >
            {filteredData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: any) => [`${value}개`, '판매량']}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />

          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

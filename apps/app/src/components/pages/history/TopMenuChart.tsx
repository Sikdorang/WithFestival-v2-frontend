import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export interface TopMenuData {
  name: string;
  value: number;
  price: number;
}

interface Props {
  data: TopMenuData[];
}

const COLORS = [
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
];

function getChartLayout(itemCount: number) {
  const pieHeight = Math.min(220, Math.max(180, 160 + itemCount * 6));
  const innerRadius = Math.round(pieHeight * 0.38);
  const outerRadius = Math.round(pieHeight * 0.48);

  return { pieHeight, innerRadius, outerRadius };
}

export default function TopMenuChart({ data }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { filteredData, totalSales } = useMemo(() => {
    if (!data) return { filteredData: [], totalSales: 0 };
    const validData = data.filter((item) => item.price > 0);
    const total = validData.reduce((sum, item) => sum + item.value, 0);
    return { filteredData: validData, totalSales: total };
  }, [data]);

  useEffect(() => {
    setHoverIndex(null);
  }, [data]);

  const layout = useMemo(
    () => getChartLayout(filteredData.length),
    [filteredData.length],
  );

  const hoveredItem = hoverIndex !== null ? filteredData[hoverIndex] : null;

  const clearHover = () => setHoverIndex(null);

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="flex min-h-[120px] w-full items-center justify-center text-sm text-gray-400">
        아직 판매된 메뉴가 없습니다.
      </div>
    );
  }

  return (
    <div
      className="relative w-full touch-manipulation select-none"
      style={{ height: layout.pieHeight }}
      onMouseLeave={clearHover}
      onTouchEnd={clearHover}
      onTouchCancel={clearHover}
      onPointerUp={clearHover}
      onPointerCancel={clearHover}
    >
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-10">
        {hoveredItem ? (
          <>
            <span className="line-clamp-2 max-w-[160px] text-center text-[11px] leading-tight font-medium text-gray-600">
              {hoveredItem.name}
            </span>
            <span className="mt-1 text-[20px] font-bold text-gray-800">
              {hoveredItem.value}개
            </span>
          </>
        ) : (
          <>
            <span className="text-[12px] text-gray-500">총 판매</span>
            <span className="text-[20px] font-bold text-gray-800">
              {totalSales}개
            </span>
          </>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={layout.innerRadius}
            outerRadius={layout.outerRadius}
            paddingAngle={filteredData.length > 1 ? 4 : 0}
            dataKey="value"
            isAnimationActive={false}
            onMouseEnter={(_, index) => setHoverIndex(index)}
            onTouchStart={(_, index) => setHoverIndex(index)}
            style={{ outline: 'none' }}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
                stroke={hoverIndex === index ? '#fff' : 'transparent'}
                strokeWidth={hoverIndex === index ? 3 : 0}
                opacity={
                  hoverIndex === null || hoverIndex === index ? 1 : 0.45
                }
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

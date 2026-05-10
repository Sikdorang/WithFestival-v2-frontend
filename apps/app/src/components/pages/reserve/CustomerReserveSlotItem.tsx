import StatusCheckIcon from '@/components/common/icons/StatusCheckIcon';

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  availableTables: number;
  bookedTables?: number;
}

interface CustomerReserveSlotItemProps {
  slot: TimeSlot;
  isSelected: boolean;
  onClick: () => void;
}

export default function CustomerReserveSlotItem({
  slot,
  isSelected,
  onClick,
}: CustomerReserveSlotItemProps) {
  const bookedCount = slot.bookedTables || 0;
  const totalCount = slot.availableTables;

  const remaining = totalCount - bookedCount;
  const percentage = totalCount > 0 ? (bookedCount / totalCount) * 100 : 0;

  const isFull = remaining <= 0;
  const isAlmostFull = remaining === 1 && !isFull;

  // 1. 체크 아이콘 상태
  const checkVariant = isFull
    ? 'disabled'
    : isSelected
      ? 'selected'
      : 'default';

  // 2. 카드 전체(컨테이너) 스타일
  const containerStyle = isFull
    ? 'border-transparent bg-gray-500-3 opacity-50 cursor-not-allowed'
    : isSelected
      ? 'border-primary-300-80 bg-white '
      : 'border-transparent bg-gray-500-3 hover:bg-gray-100 active:scale-[0.98]';

  // 3. 텍스트 색상
  const timeTextColor = isFull ? 'text-gray-400' : 'text-[#11153F]';
  const statusTextColor = isFull
    ? 'text-gray-500-70'
    : isAlmostFull
      ? 'text-red-200'
      : 'text-gray-500-70';

  // 4. 프로그레스 바 색상
  const progressFillColor = isFull
    ? 'bg-[#D1D5DB]'
    : isAlmostFull
      ? 'bg-red-200'
      : isSelected
        ? 'bg-primary-300-80'
        : 'bg-gray-500-5';

  return (
    <button
      disabled={isFull}
      onClick={onClick}
      className={`flex w-full flex-col gap-3 rounded-xl border border-gray-100 p-4 text-left transition-all ${containerStyle}`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className={`text-lg font-bold ${timeTextColor}`}>
            {slot.startTime} ~ {slot.endTime}
          </span>
          <span className={`font-regular text-sm ${statusTextColor}`}>
            {isFull ? '예약 마감' : `예약 가능 테이블 ${remaining}개`}
          </span>
        </div>

        <StatusCheckIcon variant={checkVariant} />
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F4F6]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressFillColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-gray-500-40 self-end text-[11px] font-medium">
          테이블 {bookedCount} / {totalCount}
        </span>
      </div>
    </button>
  );
}

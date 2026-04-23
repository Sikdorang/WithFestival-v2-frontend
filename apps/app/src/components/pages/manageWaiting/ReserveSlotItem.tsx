import ModifyIcon from '@/assets/icons/ic_paper_pencil.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import { useNavigate } from 'react-router-dom';

export interface TimeSlot {
  id: string;
  timeRange: string;
  bookedTables: number;
  maxTables: number;
}

interface ReserveSlotItemProps {
  slot: TimeSlot;
  onOpenUserModal: (id: string) => void;
}

export default function ReserveSlotItem({
  slot,
  onOpenUserModal,
}: ReserveSlotItemProps) {
  const navigate = useNavigate();

  const percentage = (slot.bookedTables / slot.maxTables) * 100;
  const isFull = slot.bookedTables === slot.maxTables;

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 text-left transition-all">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold text-[#11153F]">
            {slot.timeRange}
          </span>
          <span
            className={`text-sm font-semibold${isFull ? 'text-[#FF4D4F]' : 'text-gray-500-70'}`}
          >
            {isFull
              ? '예약 마감'
              : `예약 가능 테이블 ${slot.maxTables - slot.bookedTables}개`}
          </span>
        </div>

        <ModifyIcon
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/manage-reserve/detail/${slot.id}`);
          }}
        />
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F4F6]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-200' : 'bg-gray-500-30'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-gray-500-40 self-end text-[11px] font-medium">
          테이블 {slot.bookedTables} / {slot.maxTables}
        </span>
      </div>

      <CtaButton
        size="small"
        color="gray"
        text="예약 내역 보기"
        className="text-[12px] active:scale-[0.98]"
        onClick={() => onOpenUserModal(slot.id)}
      />
    </div>
  );
}

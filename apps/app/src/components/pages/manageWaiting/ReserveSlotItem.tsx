import ModifyIcon from '@/assets/icons/ic_paper_pencil.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import { TimeSlot } from '@/types/payload/reservation';
import { useNavigate } from 'react-router-dom';

interface ReserveSlotItemProps {
  slot: TimeSlot;
  onOpenUserModal: (id: number) => void;
}

export default function ReserveSlotItem({
  slot,
  onOpenUserModal,
}: ReserveSlotItemProps) {
  const navigate = useNavigate();

  const bookedCount = slot.reservedTeamCount || 0;
  const totalCount = slot.availableTables;

  const percentage = totalCount > 0 ? (bookedCount / totalCount) * 100 : 0;
  const isFull = bookedCount >= totalCount;

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 text-left transition-all">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold text-[#11153F]">
            {slot.startTime} - {slot.endTime}
          </span>
          <span
            className={`text-sm font-semibold ${isFull ? 'text-[#FF4D4F]' : 'text-gray-500-70'}`}
          >
            {isFull
              ? '예약 마감'
              : `예약 가능 테이블 ${totalCount - bookedCount}개`}
          </span>
        </div>

        <ModifyIcon
          className="cursor-pointer"
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
          테이블 {bookedCount} / {totalCount}
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

import EmptyImage from '@/assets/icons/ic_empty_waiting.svg?react';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import { TimeSlot } from '@/types/payload/reservation';
import ReserveSlotItem from './ReserveSlotItem';

interface Props {
  slots?: TimeSlot[];
  onOpenUserModal: (id: number) => void;
}

export default function ReserveSlotList({
  slots = [],
  onOpenUserModal,
}: Props) {
  return (
    <div className="flex flex-col gap-3 pb-24">
      {slots.length === 0 ? (
        <div className="flex min-h-[90vh] items-center justify-center pb-20">
          <EmptyPlaceHolder
            image={<EmptyImage color="#D1D5DB" />}
            text="등록된 예약 가능한 시간대가 없습니다."
          />
        </div>
      ) : (
        slots.map((slot) => (
          <ReserveSlotItem
            key={slot.id}
            slot={
              {
                ...slot,
                timeRange: `${slot.startTime} - ${slot.endTime}`,
              } as any
            }
            onOpenUserModal={onOpenUserModal}
          />
        ))
      )}
    </div>
  );
}

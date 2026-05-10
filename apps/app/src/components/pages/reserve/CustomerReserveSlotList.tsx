import EmptyImage from '@/assets/icons/ic_empty_waiting.svg?react';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import CustomerReserveSlotItem from './CustomerReserveSlotItem';

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  availableTables: number;
  bookedTables?: number;
}

interface Props {
  slots?: TimeSlot[];
  selectedSlotId: number | null;
  onSelectSlot: (id: number | null) => void;
}

export default function CustomerReserveSlotList({
  slots = [],
  selectedSlotId,
  onSelectSlot,
}: Props) {
  return (
    <div className="flex flex-col gap-4 p-5 pb-32">
      {slots.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center pb-20">
          <EmptyPlaceHolder
            image={<EmptyImage color="#D1D5DB" />}
            text="예약 가능한 시간대가 없습니다."
          />
        </div>
      ) : (
        slots.map((slot) => (
          <CustomerReserveSlotItem
            key={slot.id}
            slot={slot}
            isSelected={selectedSlotId === slot.id}
            onClick={() =>
              onSelectSlot(selectedSlotId === slot.id ? null : slot.id)
            }
          />
        ))
      )}
    </div>
  );
}

import ReserveSlotItem, { TimeSlot } from './ReserveSlotItem';

const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: '1', timeRange: '17:00 - 18:00', bookedTables: 3, maxTables: 5 },
  { id: '2', timeRange: '18:00 - 19:00', bookedTables: 5, maxTables: 5 },
  { id: '3', timeRange: '19:00 - 20:00', bookedTables: 1, maxTables: 5 },
  { id: '4', timeRange: '20:00 - 21:00', bookedTables: 0, maxTables: 5 },
];

interface Props {
  onOpenUserModal: (id: string) => void;
}

export default function ReserveSlotList({ onOpenUserModal }: Props) {
  return (
    <div className="flex flex-col gap-3 pb-24">
      {MOCK_TIME_SLOTS.map((slot) => (
        <ReserveSlotItem
          key={slot.id}
          slot={slot}
          onOpenUserModal={onOpenUserModal}
        />
      ))}
    </div>
  );
}

import { Mission } from '@/types/global';
import CustomerMissionListItem from './CustomerMissionListItem';

interface Props {
  missions: Mission[];
  isLoading: boolean;
  onMissionClick?: (mission: Mission) => void;
}

export default function CustomerMissionList({
  missions,
  isLoading,
  onMissionClick,
}: Props) {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm font-medium text-gray-400">
        진행 중인 미션을 확인하고 있어요...
      </div>
    );
  }

  const activeMissions = Array.isArray(missions)
    ? missions.filter((mission) => mission && mission.isActive)
    : [];

  if (activeMissions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-col px-1">
      <h2 className="mb-3 text-lg font-bold text-black">진행 중인 미션</h2>
      <div className="flex flex-col rounded-2xl border border-gray-100 bg-white px-4 py-1 shadow-sm">
        {activeMissions.map((mission) => (
          <CustomerMissionListItem
            key={mission.id}
            mission={mission}
            onClick={onMissionClick ? () => onMissionClick(mission) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

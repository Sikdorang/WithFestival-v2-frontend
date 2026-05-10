import { Mission } from '@/types/global';
import MissionItem from './MissionListItem';

interface Props {
  missions: Mission[];
  isLoading: boolean;
  onMissionClick: (mission: Mission) => void;
  onToggleActive: (id: number, targetActive: boolean) => void;
}

export default function MissionList({
  missions,
  isLoading,
  onMissionClick,
  onToggleActive,
}: Props) {
  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm font-medium text-gray-400">
        미션을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-50 rounded-2xl bg-white px-3">
      {!missions || missions.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          등록된 미션이 없습니다.
        </div>
      ) : (
        missions.map((mission) => (
          <MissionItem
            key={mission.id}
            mission={mission}
            onClick={() => onMissionClick(mission)}
            onToggle={() => onToggleActive(mission.id, !mission.isActive)}
          />
        ))
      )}
    </div>
  );
}

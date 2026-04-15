import { useMission } from '@/hooks/useMission'; // 가상의 훅
import { Mission } from '@/types/global';
import { useEffect } from 'react';
import MissionItem from './MissionListItem';

interface Props {
  onMissionClick: (mission: Mission) => void;
}

export default function MissionList({ onMissionClick }: Props) {
  const { missions, fetchMissions, toggleMissionStatus, isLoading } =
    useMission();

  useEffect(() => {
    fetchMissions();
  }, []);

  if (isLoading)
    return <div className="p-4 text-gray-400">미션 불러오는 중...</div>;

  return (
    <div className="flex flex-col divide-y divide-gray-50 rounded-2xl bg-white">
      {missions.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          등록된 미션이 없습니다.
        </div>
      ) : (
        missions.map((mission) => (
          <MissionItem
            key={mission.id}
            mission={mission}
            onClick={() => onMissionClick(mission)}
            onToggle={() => toggleMissionStatus(mission.id)}
          />
        ))
      )}
    </div>
  );
}

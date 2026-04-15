import { Mission } from '@/types/global';

interface Props {
  mission: Mission;
  onClick: () => void;
  onToggle: (e: React.MouseEvent) => void;
}

export default function MissionListItem({ mission, onClick, onToggle }: Props) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between py-5 transition-colors active:bg-gray-50"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {/* 활성화 상태 표시 점 */}
          <div
            className={`h-2 w-2 rounded-full ${mission.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
          />
          <h3 className="text-st-1 font-bold text-gray-900">{mission.title}</h3>
        </div>
        <p className="text-b-2 text-gray-400">보상: {mission.reward}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* 토글 스위치 (단순화된 버전) */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
            onToggle(e);
          }}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            mission.isActive ? 'bg-primary-300' : 'bg-gray-200'
          }`}
        >
          <div
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
              mission.isActive ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

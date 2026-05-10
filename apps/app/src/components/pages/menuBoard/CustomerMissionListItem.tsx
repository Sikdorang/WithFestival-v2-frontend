import MissionIcon from '@/assets/icons/ic_mission.png';
import { Mission } from '@/types/global';
interface Props {
  mission: Mission;
  onClick?: () => void;
}

export default function CustomerMissionListItem({ mission, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-2 border-b border-gray-100 py-4 last:border-none ${
        onClick ? 'cursor-pointer transition-colors active:bg-gray-50' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src={MissionIcon}
            alt="미리보기"
            width={20}
            height={20}
            className="rounded-2xl object-cover"
          />
          <h3 className="text-st-2 text-primary-300 font-bold break-keep">
            {mission.missionName}
          </h3>
        </div>

        <div className="shrink-0 rounded-full bg-[#FFD43A]/20 px-3 py-1">
          <span className="text-xs font-bold text-yellow-600">
            {mission.reward}
          </span>
        </div>
      </div>

      {mission.description && (
        <p className="text-b-2 mt-1 line-clamp-2 text-gray-500">
          {mission.description}
        </p>
      )}
    </div>
  );
}

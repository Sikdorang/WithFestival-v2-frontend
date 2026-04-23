'use client';

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { Mission } from '@/types/global';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../../components/common/buttons/CtaButton';
import MissionList from '../../components/pages/manageMissions/MissionList';
import { ROUTES } from '../../constants/routes';

export default function ManageMission() {
  const navigate = useNavigate();

  const [isWaitEnabled, setIsWaitEnabled] = useState(true);

  const handleToggleWait = () => {
    setIsWaitEnabled((prev) => !prev);
    toast.success(
      isWaitEnabled ? '미션이 중단되었습니다.' : '미션이 시작되었습니다.',
    );
  };

  const handleMissionClick = (item: Mission) => {
    navigate(ROUTES.MANAGE_MISSIONS.DETAIL(item.id.toString()));
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="미션 관리"
      />

      <main className="flex min-h-screen flex-col gap-4 bg-white px-4 pt-4">
        {/* 설정 그룹 */}
        <div className="flex flex-col gap-2">
          {/* 웨이팅 활성화 토글 */}
          <div className="z-10 flex items-center justify-between rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(17,21,63,0.04)]">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-[#11153F]">
                미션 기능 활성화
              </span>
              <span className="text-xs text-gray-400">
                비활성화 시 방문객이 미션을 수행할 수 없습니다.
              </span>
            </div>
            <button
              onClick={handleToggleWait}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
                isWaitEnabled ? 'bg-[#FFD43A]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  isWaitEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <MissionList onMissionClick={handleMissionClick} />
      </main>

      <CtaButton
        text={'미션 추가'}
        onClick={() => navigate(ROUTES.MANAGE_MISSIONS.DETAIL('0'))}
        className="fixed right-4 bottom-10 z-10 px-6 py-3 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-white"
        width="fit"
        size="small"
      />
    </BaseResponsiveLayout>
  );
}

'use client';

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { useMission } from '@/hooks/useMission';
import { useStore } from '@/hooks/useStore';
import { Mission } from '@/types/global';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import CtaButton from '../../components/common/buttons/CtaButton';
import MissionList from '../../components/pages/manageMissions/MissionList';
import { ROUTES } from '../../constants/routes';

export default function ManageMission() {
  const navigate = useNavigate();

  const { missions, isLoading, fetchMissions, toggleMissionActive } =
    useMission();

  const { getMyStoreInfo, updateStoreStatus } = useStore();

  const [isMissionEnabled, setIsMissionEnabled] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const storeInfo = await getMyStoreInfo();
      if (storeInfo) {
        setIsMissionEnabled(storeInfo.missionsEnabled);
      }
      await fetchMissions();
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncMissionStatus = useDebouncedCallback(
    async (targetState: boolean) => {
      const success = await updateStoreStatus('mission', targetState);

      if (!success) {
        setIsMissionEnabled(!targetState);
      }
    },
    300,
  );

  const handleToggleMissionFeature = () => {
    const nextState = !isMissionEnabled;

    setIsMissionEnabled(nextState);
    syncMissionStatus(nextState);
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
          {/* 미션 전체 활성화 토글 */}
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
              onClick={handleToggleMissionFeature}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
                isMissionEnabled ? 'bg-[#FFD43A]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  isMissionEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <MissionList
          missions={missions}
          isLoading={isLoading}
          onMissionClick={handleMissionClick}
          onToggleActive={toggleMissionActive}
        />
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

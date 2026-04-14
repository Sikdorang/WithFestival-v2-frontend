import CtaButton from '@/components/common/buttons/CtaButton';
import TopBar from '@/components/common/layouts/TopBar';
import MenuList from '@/components/pages/board/MenuList';
import MissionList from '@/components/pages/manageMissions/MissionList';
import StoreInformation from '@/components/pages/store/StoreInformation';
import { ROUTES } from '@/constants/routes';
import { useStore } from '@/hooks/useStore';
import { Menu, Mission } from '@/types/global';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Store() {
  const navigate = useNavigate();
  const { getUserInfo, account, name } = useStore();

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleMenuItemClick = (item: Menu) => {
    navigate(ROUTES.MANAGE_MENUS.DETAIL(item.id.toString()));
  };

  const handleMissionClick = (item: Mission) => {
    navigate(ROUTES.MANAGE_MISSIONS.DETAIL(item.id.toString()));
  };

  return (
    <div className="relative min-h-screen space-y-4 bg-white">
      <TopBar />
      <div className="p-4">
        <StoreInformation name={name} account={account} />

        <section className="mb-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">QR 관리</h2>
            <CtaButton
              width="fit"
              text="+ QR 생성"
              size="small"
              onClick={() => navigate(ROUTES.MANAGE_QR)}
            />
          </div>
        </section>

        <section className="mb-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">미션 관리</h2>
            <CtaButton
              width="fit"
              text="+ 미션 생성"
              size="small"
              onClick={() => navigate(ROUTES.MANAGE_MISSIONS.DETAIL('0'))}
            />
          </div>
          <MissionList onMissionClick={handleMissionClick} />
        </section>

        <section className="space-y-4 pb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">메뉴 관리</h2>
            <CtaButton
              width="fit"
              text="+ 메뉴 생성"
              size="small"
              onClick={() => navigate(ROUTES.MANAGE_MENUS.DETAIL('0'))}
            />
          </div>
          <MenuList onMenuItemClick={handleMenuItemClick} />
        </section>
      </div>
    </div>
  );
}

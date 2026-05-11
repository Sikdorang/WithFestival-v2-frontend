import DepthIcon from '@/assets/icons/ic_arrow_right.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import TopBar from '@/components/common/layouts/TopBar';
import MenuList from '@/components/pages/board/MenuList';
import StoreInformation from '@/components/pages/store/StoreInformation';
import { ROUTES } from '@/constants/routes';
import { useStore } from '@/hooks/useStore';
import { useAuthStore } from '@/stores/authStore';
import { Menu } from '@/types/global';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Store() {
  const navigate = useNavigate();
  const { getMyStoreInfo, account, name } = useStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    getMyStoreInfo();
  }, []);

  const handleMenuItemClick = (item: Menu) => {
    navigate(ROUTES.MANAGE_MENUS.DETAIL(item.id.toString()));
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="relative min-h-screen space-y-4 bg-white">
      <TopBar />
      <div className="p-4">
        <StoreInformation name={name} account={account} />

        <section className="mb-2 space-y-4 p-1">
          <div
            className="flex items-center justify-between"
            onClick={() => navigate(ROUTES.MANAGE_WAITING_SETTING)}
          >
            <div className="text-lg font-semibold text-gray-900">
              웨이팅 관리
            </div>
            <DepthIcon />
          </div>
        </section>

        <section className="mb-2 space-y-4 p-1">
          <div
            className="flex items-center justify-between"
            onClick={() => navigate(ROUTES.MANAGE_RESERVE.ROOT)}
          >
            <div className="text-lg font-semibold text-gray-900">예약 관리</div>
            <DepthIcon />
          </div>
        </section>

        <section className="mb-2 space-y-4 p-1">
          <div
            className="flex items-center justify-between"
            onClick={() => navigate(ROUTES.MANAGE_QR)}
          >
            <div className="text-lg font-semibold text-gray-900">QR 관리</div>
            <DepthIcon />
          </div>
        </section>

        <section className="mb-2 space-y-4 p-1">
          <div
            className="flex items-center justify-between"
            onClick={() => navigate(ROUTES.MANAGE_MISSIONS.ROOT)}
          >
            <div className="text-lg font-semibold text-gray-900">미션 관리</div>
            <DepthIcon />
          </div>
        </section>

        <section className="mt-5 space-y-4 p-1 pb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">메뉴 관리</h2>
          </div>
          {/* <div
            className="flex items-center justify-between"
            onClick={() => navigate(ROUTES.AI_MENU_GENERATOR)}
          >
            <div className="text-lg font-semibold text-gray-900">
              AI 메뉴 관리
            </div>
            <DepthIcon />
          </div> */}
          <MenuList onMenuItemClick={handleMenuItemClick} />
        </section>

        <section className="mt-8 flex justify-center pb-20">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-400 underline underline-offset-2 hover:text-gray-600"
          >
            로그아웃
          </button>
        </section>
      </div>

      <CtaButton
        text={'메뉴 추가'}
        onClick={() => navigate(ROUTES.MANAGE_MENUS.DETAIL('0'))}
        className="fixed right-4 bottom-24 z-10 px-6 py-3 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-white"
        width="fit"
        size="small"
      />
    </div>
  );
}

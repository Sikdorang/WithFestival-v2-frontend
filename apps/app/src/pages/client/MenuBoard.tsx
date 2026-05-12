import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import Navigator from '@/components/common/layouts/Navigator';
import TopBar from '@/components/common/layouts/TopBar';
import MenuDetail from '@/components/pages/board/MenuDetail';
import MenuList from '@/components/pages/board/MenuList';
import StoreBanner from '@/components/pages/board/StoreBanner';
import CustomerMissionList from '@/components/pages/menuBoard/CustomerMissionList';
import { ROUTES } from '@/constants/routes';
import { KEYS } from '@/constants/storage';
import { useMission } from '@/hooks/useMission';
import { useStore } from '@/hooks/useStore';
import { useOrderStore } from '@/stores/orderStore';
import { Menu } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function MenuBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getStorePublicInfo, name, notice } = useStore();
  const {
    missions,
    isLoading: isMissionsLoading,
    fetchMissionsByStoreId,
  } = useMission();

  const { orderItems } = useOrderStore();
  const isPreview = localStorage.getItem(KEYS.IS_PREVIEW);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const userData = useMemo(() => {
    if (location.state?.userData) return location.state.userData;
    try {
      const stored = sessionStorage.getItem('userData');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, [location.state?.userData]);

  const handleMenuItemClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  useEffect(() => {
    if (userData.userId !== undefined) {
      getStorePublicInfo(userData.userId);
      fetchMissionsByStoreId(userData.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.userId]);

  if (userData.userId === undefined) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return (
    <>
      <div className="relative min-h-screen space-y-4 bg-white">
        {userData.tableId == 0 ? (
          <Navigator
            left={<GoBackIcon />}
            onLeftPress={() => navigate(-1)}
            center={<div className="text-st-1">포장 주문하기</div>}
          />
        ) : (
          <TopBar />
        )}
        <main className="p-4 pb-24">
          <StoreBanner
            boothName={name}
            isPreview={isPreview === '1'}
            tableId={userData.tableId}
            notice={notice || ''}
          />
          <MenuList onMenuItemClick={handleMenuItemClick} />
          <CustomerMissionList
            missions={missions}
            isLoading={isMissionsLoading}
          />
        </main>
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
          <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <Dialog.Title className="sr-only">메뉴 상세 정보</Dialog.Title>
            <Dialog.Description className="sr-only">
              선택한 메뉴의 상세 정보를 보고 장바구니에 담을 수 있습니다.
            </Dialog.Description>
            {selectedMenu && (
              <MenuDetail
                menu={selectedMenu}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {orderItems.length > 0 && (
        <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(ROUTES.ORDERING)}
            className="bg-primary-300 flex w-full flex-1 items-center justify-between rounded-2xl px-6 py-4 text-black"
          >
            <div className="flex w-full items-center justify-center gap-2">
              <div className="text-b-1">주문하기</div>
              <div className="text-c-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                {totalQuantity}
              </div>
            </div>
          </button>
        </footer>
      )}
    </>
  );
}

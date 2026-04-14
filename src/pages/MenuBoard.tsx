import MenuDetail from '@/components/pages/board/MenuDetail';
import MenuList from '@/components/pages/board/MenuList';
import { ROUTES } from '@/constants/routes';
import { useOrderStore } from '@/stores/orderStore';
import { Menu } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import BottomSpace from '../components/common/exceptions/BottomSpace';
import TopBar from '../components/common/layouts/TopBar';
import StoreBanner from '../components/pages/board/StoreBanner';
import { KEYS } from '../constants/storage';
import { useStore } from '../hooks/useStore';

export default function MenuBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserInfoByUserId, name, notice } = useStore();
  const { orderItems } = useOrderStore();
  const isPreview = localStorage.getItem(KEYS.IS_PREVIEW);

  const userData =
    location.state?.userData ||
    JSON.parse(sessionStorage.getItem('userData') || '{}');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleMenuItemClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  useEffect(() => {
    getUserInfoByUserId(userData.userId);
  }, []);

  if (userData.userId === undefined) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return (
    <>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="relative min-h-screen space-y-4 bg-white">
          <TopBar />
          <main className="p-4 pb-24">
            <StoreBanner
              boothName={name}
              isPreview={isPreview === '1'}
              tableNumber={userData.tableId}
              notice={notice || ''}
            />
            <MenuList onMenuItemClick={handleMenuItemClick} />
            <BottomSpace />
          </main>
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
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
      </Dialog.Root>
    </>
  );
}

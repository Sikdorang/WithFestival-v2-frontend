// import BombIcon from '@/assets/icons/ic_bomb.svg?react';
import EmptyImage from '@/assets/images/img_empty_image.svg?react';
import MenuDetail from '@/components/pages/board/MenuDetail';
import { ROUTES } from '@/constants/routes';
import { useOrderStore } from '@/stores/orderStore';
import { Menu } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import BottomSpace from '../components/common/exceptions/BottomSpace';
import TopBar from '../components/common/layouts/TopBar';
import MenuItemSkeleton from '../components/common/skeletons/MenuItemSkeleton';
import { KEYS } from '../constants/storage';
import { useMenu } from '../hooks/useMenu';
import { useStore } from '../hooks/useStore';
import NoticeView from '@/components/pages/board/NoticeView';
import RequestModal from '@/components/pages/board/RequestModal';

const IMAGE_PREFIX = import.meta.env.VITE_IMAGE_PREFIX;
interface StoreInfoSectionProps {
  boothName: string;
  isPreview: boolean;
  tableNumber?: number;
  notice: string;
}

function StoreInfoSection({
  boothName,
  isPreview,
  tableNumber,
  notice,
}: StoreInfoSectionProps) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<'message' | 'call'>('message');

  return (
    <div>
      <RequestModal
        open={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        type={requestType}
      />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-b-2 text-gray-300">{boothName}</div>
          <div className="text-st-2 text-black">
            {isPreview ? '메뉴판 미리보기' : `테이블 번호 ${tableNumber}`}
          </div>
          {isPreview && (
            <div className="text-c-1 flex text-gray-200">
              웨이팅을 기다리며 메뉴를 미리 볼 수 있어요.
            </div>
          )}
        </div>
      </div>
      <NoticeView notice={notice} />
    </div>
  );
}

function MenuItem({
  name,
  price,
  image,
  onClick,
}: {
  name: string;
  price: number;
  image: string;
  onClick: () => void;
}) {
  return (
    <div className="w-fullitems-center flex py-4" onClick={onClick}>
      <div className="mr-2 flex-1 text-left">
        <h3 className="text-b-1 text-gray-400">{name}</h3>
        <p className="text-st-1 text-gray-800">{price.toLocaleString()}원</p>
      </div>
      {image ? (
        <img
          className="flex aspect-square max-w-[180px] flex-1 rounded-2xl bg-gray-100"
          src={`${IMAGE_PREFIX}${image}`}
        />
      ) : (
        <div className="flex aspect-square flex-1 items-center justify-center rounded-3xl bg-gray-100">
          <EmptyImage />
        </div>
      )}
    </div>
  );
}

function MenuList({
  onMenuItemClick,
}: {
  onMenuItemClick: (item: Menu) => void;
}) {
  const { menus, getMenuByUserId, isLoading } = useMenu();
  const location = useLocation();

  const userData =
    location.state?.userData ||
    JSON.parse(sessionStorage.getItem('userData') || '{}');

  useEffect(() => {
    getMenuByUserId(userData.userId);
  }, []);

  return (
    <div className="rounded-lg bg-white">
      {isLoading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <MenuItemSkeleton key={index} />
          ))}
        </div>
      ) : (
        menus.map((item) => (
          <MenuItem
            key={item.id}
            name={item.menu}
            price={item.price}
            image={item.image ?? ''}
            onClick={() => onMenuItemClick(item)}
          />
        ))
      )}
    </div>
  );
}

export default function MenuBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserInfoByUserId, name, notice, event } = useStore();
  const { orderItems } = useOrderStore();
  const isPreview = localStorage.getItem(KEYS.IS_PREVIEW);

  const userData =
    location.state?.userData ||
    JSON.parse(sessionStorage.getItem('userData') || '{}');

  const [isEventModalOpen, setIsEventModalOpen] = useState(true);
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
        <div className="relative min-h-screen space-y-4 bg-white p-4">
          <TopBar />
          <main className="pt-12 pb-24">
            <StoreInfoSection
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

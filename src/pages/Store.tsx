import EmptyImage from '@/assets/images/img_empty_image.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import { ROUTES } from '@/constants/routes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import * as Dialog from '@radix-ui/react-dialog';
import ManageBooth from '@/components/pages/store/ManageBooth';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import EmptyMenusIcon from '@/assets/icons/ic_empty_board.svg?react';

const IMAGE_PREFIX = import.meta.env.VITE_IMAGE_PREFIX;

function AccountSection() {
  const [showManageBooth, setShowManageBooth] = useState(false);

  return (
    <Dialog.Root open={showManageBooth} onOpenChange={setShowManageBooth}>
      <div>
        <div className="relative mb-4 rounded-2xl bg-gray-100 p-4 shadow-sm">
          <h2 className="text-st-2 mb-3">부스 관리하기</h2>

          <div className="space-y-3">
            <CtaButton
              text="관리하러 가기"
              color="white"
              size="small"
              onClick={() => setShowManageBooth(true)}
            />
          </div>
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <ManageBooth
              onClose={() => {
                setShowManageBooth(false);
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
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
      <div className="flex-1 text-left">
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

function MenuList() {
  const navigate = useNavigate();
  const { menus, fetchMenu } = useMenu();

  useEffect(() => {
    fetchMenu();
  }, []);
  return (
    <div className="rounded-lg bg-white p-4">
      {menus.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <EmptyPlaceHolder
            image={<EmptyMenusIcon />}
            text="메뉴가 없습니다."
            textClassName="text-gray-300"
          />
        </div>
      ) : (
        menus.map((item) => (
          <MenuItem
            key={item.id}
            name={item.menu}
            price={item.price}
            image={item.image}
            onClick={() => {
              navigate(ROUTES.MANAGE_MENUS.DETAIL(item.id.toString()));
            }}
          />
        ))
      )}
    </div>
  );
}

function AddMenuButton() {
  const navigate = useNavigate();
  return (
    <div className="fixed right-4 bottom-30 rounded-xl">
      <CtaButton
        text="메뉴 추가"
        radius="xl"
        onClick={() => {
          navigate(ROUTES.MANAGE_MENUS.DETAIL('0'));
        }}
      />
    </div>
  );
}

export default function Store() {
  return (
    <div className="relative min-h-screen space-y-4 bg-white p-4">
      <AccountSection />
      <MenuList />
      <AddMenuButton />
    </div>
  );
}

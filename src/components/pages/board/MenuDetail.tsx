import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import EmptyImage from '@/assets/images/img_empty_image.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { useOrderStore } from '@/stores/orderStore';
import { Menu } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
interface Props {
  menu: Menu;
  onClose: () => void;
}

const IMAGE_PREFIX = import.meta.env.VITE_IMAGE_PREFIX;

export default function MenuDetail({ menu, onClose }: Props) {
  const { addItem } = useOrderStore();

  const isPreview = localStorage.getItem('preview') === '1';

  const handleAddItem = () => {
    addItem({
      id: menu.id,
      name: menu.menu,
      price: menu.price,
      image: menu.image || '',
    });
    onClose();
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        center={<div className="text-st-1">메뉴 상세</div>}
        onLeftPress={onClose}
      />

      <main className="flex flex-grow flex-col">
        <div className="mb-2 flex w-full flex-col items-center gap-2 px-8">
          <div className="relative flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-gray-200 transition-all duration-200 hover:bg-gray-100">
            {menu.image ? (
              <img
                src={`${IMAGE_PREFIX}${menu.image}`}
                alt="미리보기"
                className="aspect-square h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 text-gray-400">
                <EmptyImage className="h-30 w-30" />
              </div>
            )}
          </div>
        </div>

        <h1 className="text-st-2 px-10">{menu.menu}</h1>

        <p className="text-b-1 mb-2 px-10 text-gray-400">
          {menu.description || ''}
        </p>

        <p className="text-st-2 px-10 text-black">
          {Number(menu.price).toLocaleString()}원
        </p>
      </main>

      {!isPreview && (
        <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 px-4 pb-4">
          <Dialog.Close asChild>
            <CtaButton text="담기" radius="_2xl" onClick={handleAddItem} />
          </Dialog.Close>
        </footer>
      )}
    </BaseResponsiveLayout>
  );
}

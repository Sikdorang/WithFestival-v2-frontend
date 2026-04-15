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
        center={'메뉴 상세'}
        onLeftPress={onClose}
      />

      <main className="flex flex-grow flex-col gap-8 px-4 pt-4 pb-24">
        <div className="mb-2 flex w-full flex-col items-center gap-2">
          <div className="relative flex w-full overflow-hidden rounded-xl bg-gray-100">
            {menu.image ? (
              <img
                src={`${IMAGE_PREFIX}${menu.image}`}
                alt="메뉴 이미지"
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center text-gray-400">
                <EmptyImage />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-st-2 text-black">{menu.menu}</h1>
          {menu.description && (
            <p className="text-b-1 text-gray-500">{menu.description}</p>
          )}
          <p className="text-st-2 mt-2 text-black">
            {Number(menu.price).toLocaleString()}원
          </p>
        </div>
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

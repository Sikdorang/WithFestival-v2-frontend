import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import EmptyImage from '@/assets/images/img_empty_image.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import QuantityController from '@/components/common/inputs/QuantityController'; // 💡 임포트 경로 확인 필요
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { useOrderStore } from '@/stores/orderStore';
import { Menu } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  menu: Menu;
  onClose: () => void;
}

export default function MenuDetail({ menu, onClose }: Props) {
  const { addItem } = useOrderStore();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const isPreview = localStorage.getItem('preview') === '1';

  const handleAddItem = () => {
    addItem({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      image: menu.imageUrl || '',
      quantity,
    });
    onClose();
  };

  const totalPrice = menu.price * quantity;

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        center={t('customer.menuDetail.title', '메뉴 상세')}
        onLeftPress={onClose}
      />

      <main className="flex flex-grow flex-col gap-6 pt-4 pb-28">
        <div className="flex w-full flex-col items-center px-4">
          <div className="relative flex w-full overflow-hidden rounded-xl bg-gray-100">
            {menu.imageUrl ? (
              <img
                src={`${menu.imageUrl}`}
                alt={t('customer.menuDetail.imageAlt', '메뉴 이미지')}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center text-gray-400">
                <EmptyImage />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <h1 className="text-xl font-bold text-black">{menu.name}</h1>
          {menu.description && (
            <p className="text-sm leading-relaxed text-gray-500">
              {menu.description}
            </p>
          )}
          <p className="mt-1 text-lg font-bold text-black">
            {t('customer.menuDetail.price', {
              price: Number(menu.price).toLocaleString(),
            })}
          </p>
        </div>

        <hr className="border-gray-500-5" />

        <div className="flex items-center justify-between px-4">
          <span className="text-base font-medium text-gray-800">수량</span>
          <QuantityController
            quantity={quantity}
            onIncrease={() => setQuantity((prev) => prev + 1)}
            onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
          />
        </div>
      </main>

      {!isPreview && (
        <footer className="fixed right-0 bottom-0 left-0 border-t border-gray-50 bg-white px-4 pt-4 pb-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-6">
            <span className="shrink-0 text-lg font-bold text-gray-800">
              총 {totalPrice.toLocaleString()}원
            </span>

            <Dialog.Close asChild>
              <CtaButton
                text={t('customer.menuDetail.addBtn', '주문하기')}
                radius="_2xl"
                onClick={handleAddItem}
                right={
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-[13px] font-bold text-white">
                    {quantity}
                  </span>
                }
              />
            </Dialog.Close>
          </div>
        </footer>
      )}
    </BaseResponsiveLayout>
  );
}

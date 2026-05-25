import EmptyImage from '@/assets/images/img_empty_image.svg?react';
import { useTranslation } from 'react-i18next';

interface MenuItemProps {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function MenuItem({
  name,
  price,
  image,
  quantity,
}: MenuItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between py-4">
      {image ? (
        <img
          className="flex aspect-square max-w-[180px] flex-1 rounded-2xl bg-gray-100 object-cover"
          src={`${image}`}
          alt={name}
        />
      ) : (
        <div className="flex aspect-square flex-1 items-center justify-center rounded-3xl bg-gray-100">
          <EmptyImage />
        </div>
      )}

      <div className="flex-1 pl-4 text-left">
        <div className="text-b-1 text-gray-400">{name}</div>
        <div className="text-st-1 text-gray-800">
          {t('customer.ordering.priceFormat', {
            price: price.toLocaleString(),
          })}
        </div>
        <div className="text-st-1 text-gray-800">
          {t('customer.ordering.quantityFormat', {
            quantity,
          })}
        </div>
      </div>
    </div>
  );
}

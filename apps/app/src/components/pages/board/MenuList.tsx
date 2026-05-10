import StoreIcon from '@/assets/icons/ic_store_gray.svg?react';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import MenuItemSkeleton from '@/components/common/skeletons/MenuItemSkeleton';
import { useMenu } from '@/hooks/useMenu';
import { Menu } from '@/types/global';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuListItem';

export default function MenuList({
  onMenuItemClick,
}: {
  onMenuItemClick: (item: Menu) => void;
}) {
  const { menus, getMenusByStoreId, isLoading } = useMenu();
  const location = useLocation();

  const userData = useMemo(
    () =>
      location.state?.userData ||
      JSON.parse(sessionStorage.getItem('userData') || '{}'),
    [location.state],
  );

  const storeId = userData?.storeId || userData?.id;

  useEffect(() => {
    if (storeId) {
      getMenusByStoreId(Number(storeId));
    }
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <MenuItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <div className="py-20">
        <EmptyPlaceHolder
          image={<StoreIcon width={48} height={48} className="text-gray-300" />}
          text="등록된 메뉴가 없습니다."
          textClassName="text-gray-400"
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="flex flex-col">
        {menus.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.imageUrl ?? ''}
            onClick={() => onMenuItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

import StoreIcon from '@/assets/icons/ic_store_gray.svg?react';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import MenuItemSkeleton from '@/components/common/skeletons/MenuItemSkeleton';
import { useAdminMenuQuery } from '@/hooks/useMenuQuery';
import { Menu } from '@/types/global';
import AdminMenuListItem from './AdminMenuListItem';

export default function AdminMenuList({
  onMenuItemClick,
}: {
  onMenuItemClick: (item: Menu) => void;
}) {
  const { data: menus, isLoading } = useAdminMenuQuery(true);

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
        {menus.map((item: any) => (
          <AdminMenuListItem
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

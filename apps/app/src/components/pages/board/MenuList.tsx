import { useMenu } from '@/hooks/useMenu';
import { Menu } from '@/types/global';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItemSkeleton from '../../common/skeletons/MenuItemSkeleton';
import MenuItem from './MenuListItem';

export default function MenuList({
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
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <MenuItemSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {menus.map((item) => (
            <MenuItem
              key={item.id}
              name={item.menu}
              price={item.price}
              image={item.image ?? ''}
              onClick={() => onMenuItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

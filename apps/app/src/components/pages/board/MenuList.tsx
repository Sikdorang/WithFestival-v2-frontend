import StoreIcon from '@/assets/icons/ic_store_gray.svg?react';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import MenuItemSkeleton from '@/components/common/skeletons/MenuItemSkeleton';
import { KEYS } from '@/constants/storage';
import { useAdminMenuQuery, useCustomerMenuQuery } from '@/hooks/useMenuQuery';
import { Menu } from '@/types/global';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuListItem';

const getLocalizedMenu = (menu: any, lang: string): Menu => {
  let name = menu.name;
  let description = menu.description;

  if (lang === 'en') {
    name = menu.nameEn || menu.name;
    description = menu.descriptionEn || menu.description;
  } else if (lang === 'zh') {
    name = menu.nameZh || menu.name;
    description = menu.descriptionZh || menu.description;
  } else if (lang === 'ja') {
    name = menu.nameJa || menu.name;
    description = menu.descriptionJa || menu.description;
  }

  return {
    ...menu,
    name,
    description,
  };
};

export default function MenuList({
  onMenuItemClick,
}: {
  onMenuItemClick: (item: Menu) => void;
}) {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const userData = useMemo(() => {
    if (location.state?.userData) return location.state.userData;
    try {
      const stored = sessionStorage.getItem('userData');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, [location.state?.userData]);

  const storeId = userData?.userId || userData?.id;

  const isAdmin = !!sessionStorage.getItem(KEYS.ACCESS_TOKEN);
  // 관리자용 쿼리
  const { data: adminMenus, isLoading: isAdminLoading } =
    useAdminMenuQuery(isAdmin);
  // 고객용 쿼리
  const { data: customerMenus, isLoading: isCustomerLoading } =
    useCustomerMenuQuery(storeId, !isAdmin);

  const menus = isAdmin ? adminMenus : customerMenus;
  const isLoading = isAdmin ? isAdminLoading : isCustomerLoading;

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
          text={t('customer.menuBoard.emptyMenu')}
          textClassName="text-gray-400"
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="flex flex-col">
        {menus.map((rawItem: any) => {
          const localizedItem = getLocalizedMenu(rawItem, i18n.language);

          return (
            <MenuItem
              key={localizedItem.id}
              name={localizedItem.name}
              price={localizedItem.price}
              image={localizedItem.imageUrl ?? ''}
              onClick={() => onMenuItemClick(localizedItem)}
            />
          );
        })}
      </div>
    </div>
  );
}

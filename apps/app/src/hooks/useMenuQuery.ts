import { menuAPI } from '@/apis/menu';
import { useQuery } from '@tanstack/react-query';

// [관리자/부스용] 내 스토어 메뉴 조회 훅
export const useAdminMenuQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['menu', 'admin'],
    queryFn: menuAPI.getMenus,
    retry: false,
    enabled,
  });
};

// [손님/고객용] 특정 스토어 메뉴 조회 훅
export const useCustomerMenuQuery = (
  storeId: number | undefined,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ['menu', 'customer', storeId],
    queryFn: () => {
      if (!storeId) throw new Error('Store ID is required');
      return menuAPI.getMenusByStoreId(storeId);
    },
    retry: false,
    enabled: !!storeId && enabled,
  });
};

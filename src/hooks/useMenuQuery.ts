import { menuAPI } from '@/apis/menu';
import { useQuery } from '@tanstack/react-query';

export const useMenuQuery = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: menuAPI.getMenu,
    retry: false,
  });
};

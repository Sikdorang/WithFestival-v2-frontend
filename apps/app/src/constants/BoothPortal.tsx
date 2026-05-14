import CalendarIcon from '@/assets/icons/ic_calendar.svg?react';
import RankingIcon from '@/assets/icons/ic_ranking.svg?react';
import ShoppingBagIcon from '@/assets/icons/ic_speed_bag.svg?react';
import TimerIcon from '@/assets/icons/ic_timer.svg?react';
import SchoolIcon from '@/assets/icons/ic_university.svg?react';
import { ROUTES } from '@/constants/routes';
import { TFunction } from 'i18next';

interface BoothLinkParams {
  waitingsEnabled: boolean;
  reservationEnabled: boolean;
  t: TFunction;
}

export const getBoothLinks = ({
  waitingsEnabled,
  reservationEnabled,
  t,
}: BoothLinkParams) => [
  {
    id: 'waiting',
    title: t('customer.portal.links.waiting.title'),
    subtitle: t('customer.portal.links.waiting.sub'),
    icon: <TimerIcon width={20} height={20} />,
    path: ROUTES.WAITING,
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#D96B6B]',
    enabled: waitingsEnabled,
  },
  {
    id: 'reservation',
    title: t('customer.portal.links.reserve.title'),
    subtitle: t('customer.portal.links.reserve.sub'),
    icon: <CalendarIcon width={20} height={20} />,
    path: ROUTES.RESERVATION,
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#D28A5B]',
    enabled: reservationEnabled,
  },
  {
    id: 'takeout',
    title: t('customer.portal.links.takeout.title'),
    subtitle: t('customer.portal.links.takeout.sub'),
    icon: <ShoppingBagIcon width={20} height={20} />,
    path: ROUTES.MENU_BOARD,
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#47A368]',
    enabled: true,
  },
  {
    id: 'festival-schedule',
    title: t('customer.portal.links.schedule.title'),
    subtitle: t('customer.portal.links.schedule.sub'),
    icon: <SchoolIcon width={20} height={20} />,
    path: 'https://withfestival.site/schedule',
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#47A368]',
    enabled: true,
  },
  {
    id: 'pub-ranking',
    title: t('customer.portal.links.ranking.title'),
    subtitle: t('customer.portal.links.ranking.sub'),
    icon: <RankingIcon width={20} height={20} />,
    path: 'https://withfestival.site/ranking',
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#47A368]',
    enabled: true,
  },
  // {
  //   id: 'map',
  //   title: '부스 맵 보기',
  //   subtitle: '우리 부스 위치 찾기',
  //   icon: <MapIcon width={20} height={20} />,
  //   path: ROUTES.MAP,
  //   iconBg: 'bg-gray-500-5',
  //   iconColor: 'text-[#508CAE]',
  //   enabled: true,
  // },
];

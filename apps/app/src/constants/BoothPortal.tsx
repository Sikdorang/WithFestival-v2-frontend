import CalendarIcon from '@/assets/icons/ic_calendar.svg?react';
import RankingIcon from '@/assets/icons/ic_ranking.svg?react';
import ShoppingBagIcon from '@/assets/icons/ic_speed_bag.svg?react';
import TimerIcon from '@/assets/icons/ic_timer.svg?react';
import SchoolIcon from '@/assets/icons/ic_university.svg?react';
import { ROUTES } from '@/constants/routes';

interface BoothLinkParams {
  waitingsEnabled: boolean;
  reservationEnabled: boolean;
}

export const getBoothLinks = ({
  waitingsEnabled,
  reservationEnabled,
}: BoothLinkParams) => [
  {
    id: 'waiting',
    title: '웨이팅 등록하기',
    subtitle: '현재 부스 앞 대기줄 서기',
    icon: <TimerIcon width={20} height={20} />,
    path: ROUTES.WAITING,
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#D96B6B]',
    enabled: waitingsEnabled,
  },
  {
    id: 'reservation',
    title: '부스 예약하기',
    subtitle: '원하는 시간에 미리 예약하기',
    icon: <CalendarIcon width={20} height={20} />,
    path: ROUTES.RESERVATION,
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#D28A5B]',
    enabled: reservationEnabled,
  },
  {
    id: 'takeout',
    title: '포장 주문하기',
    subtitle: '기다림 없이 바로 픽업하기',
    icon: <ShoppingBagIcon width={20} height={20} />,
    path: ROUTES.MENU_BOARD,
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#47A368]',
    enabled: true,
  },
  {
    id: 'festival-schedule',
    title: '타 대학 축제 현황',
    subtitle: '다른 대학의 축제 현황보기',
    icon: <SchoolIcon width={20} height={20} />,
    path: 'https://withfestival.site/schedule',
    iconBg: 'bg-gray-500-5',
    iconColor: 'text-[#47A368]',
    enabled: true,
  },
  {
    id: 'pub-ranking',
    title: '실시간 학교 주점 랭킹',
    subtitle: '주점 별로 순위 확인해보기',
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

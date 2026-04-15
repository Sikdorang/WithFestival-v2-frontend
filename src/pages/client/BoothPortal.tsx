import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import TopBar from '@/components/common/layouts/TopBar';
import { useNavigate } from 'react-router-dom';

const ROUTES = {
  WAITING: '/waiting',
  TAKEOUT: '/takeout',
  MAP: '/map',
  RESERVATION: '/reserve',
};

export default function BoothPortal() {
  const navigate = useNavigate();

  const links = [
    {
      id: 'waiting',
      title: '웨이팅 등록하기',
      subtitle: '현재 부스 앞 대기줄 서기',
      icon: '⏱️',
      path: ROUTES.WAITING,
    },
    {
      id: 'takeout',
      title: '포장 주문하기',
      subtitle: '기다림 없이 바로 픽업하기',
      icon: '🛍️',
      path: ROUTES.TAKEOUT,
    },
    {
      id: 'map',
      title: '부스 맵 보기',
      subtitle: '우리 부스 위치 찾기',
      icon: '🗺️',
      path: ROUTES.MAP,
    },
    {
      id: 'reservation',
      title: '부스 예약하기',
      subtitle: '원하는 시간에 미리 방문 예약',
      icon: '📅',
      path: ROUTES.RESERVATION,
    },
  ];

  return (
    <BaseResponsiveLayout>
      <TopBar />
      {/* 배경: 완전한 흰색보다 아주 약간 따뜻한 쿨그레이톤으로 옐로우를 돋보이게 함 */}
      <div className="flex min-h-screen flex-col items-center bg-white px-6 py-12">
        {/* 1. 상단 프로필 영역 */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          {/* 로고 컨테이너: 축제랑 메인 옐로우 적용 */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFD43A] shadow-[0_4px_16px_rgba(255,212,58,0.3)]">
            {/* 실제 로고 이미지 태그(<img src={...} />)로 교체할 부분 */}
            <span className="text-2xl font-black tracking-tighter text-[#11153F]">
              🌸
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {/* 텍스트: 딥 네이비 컬러로 가독성과 무게감 확보 */}
            <h1 className="text-2xl font-bold text-[#11153F]">어우야 부스</h1>
            <p className="text-sm font-medium text-[#11153F]/60">
              2026 경희대학교 대동제 주점
            </p>
          </div>
        </div>

        {/* 2. 링크 버튼 리스트 영역 */}
        <div className="flex w-full max-w-md flex-col gap-4">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => navigate(link.path)}
              // 터치 시 아주 연한 옐로우 배경으로 피드백
              className="group bg-primary-50 flex w-full items-center justify-between rounded-2xl p-5 text-left shadow-[0_4px_16px_rgba(17,21,63,0.04)] transition-all active:scale-95 active:bg-[#FFFDF5]"
            >
              <div className="flex items-center gap-4">
                {/* 아이콘 컨테이너: 연한 옐로우 -> 터치 시 메인 옐로우 */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF9E6] text-2xl transition-colors group-active:bg-[#FFD43A]">
                  {link.icon}
                </div>
                {/* 텍스트 정보 */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[17px] font-bold text-[#11153F]">
                    {link.title}
                  </span>
                  <span className="text-[13px] font-medium text-[#11153F]/50">
                    {link.subtitle}
                  </span>
                </div>
              </div>

              {/* 우측 화살표 아이콘: 메인 옐로우 적용 및 터치 시 이동 애니메이션 */}
              <div className="text-[#FFD43A] transition-transform group-active:translate-x-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BaseResponsiveLayout>
  );
}

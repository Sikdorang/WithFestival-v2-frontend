import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import MapPinIcon from '@/assets/icons/ic_place_pin.svg?react';
import BoothIcon from '@/assets/icons/ic_store_gray.svg?react';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { useNavigate } from 'react-router-dom';

interface BoothLocation {
  id: string;
  name: string;
  top: string;
  left?: string;
  right?: string;
  isUs?: boolean;
}

const MOCK_BOOTHS: BoothLocation[] = [
  // 왼쪽 줄 (x축 정렬)
  { id: '11', name: '막걸리나', top: '32%', left: '12%' },
  { id: '12', name: '하이볼', top: '48%', left: '12%' },
  { id: '13', name: '전아랑', top: '64%', left: '12%' },
  { id: '14', name: '어우야', top: '80%', left: '12%', isUs: true }, // 🌟 우리 부스

  // 오른쪽 줄 (왼쪽 줄과 y축 엇갈림 배치)
  { id: '21', name: '막걸리나', top: '38%', right: '15%' },
  { id: '22', name: '하이볼', top: '54%', right: '15%' },
  { id: '23', name: '전아랑', top: '70%', right: '15%' },
];

export default function BoothMap() {
  const navigate = useNavigate();

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="부스 맵 보기"
      />

      <main className="flex min-h-screen flex-col bg-white px-6 pt-6 pb-24">
        {/* 상단 안내 문구 */}
        <div className="bg-gray-500-3 mb-6 flex items-center gap-4 rounded-xl p-5">
          <div className="bg-gray-500-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#C85A54]">
            {/* Map Pin Icon */}
            <MapPinIcon width={22} height={22} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-medium text-gray-500">
              {'{부스 이름}'} 부스 위치
            </span>
            <span className="text-lg font-bold text-red-200">
              사회과학대학 앞 광장 14번
            </span>
          </div>
        </div>

        {/* 인터랙티브 지도 영역 (HTML 절대 좌표 배치) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          {MOCK_BOOTHS.map((booth) => {
            const isUs = booth.isUs;
            return (
              <div
                key={booth.id}
                className={`absolute flex h-[55px] w-[75px] flex-col items-center justify-center gap-1.5 rounded-xl transition-transform ${
                  isUs ? 'bg-red-200 text-white' : 'bg-[#F4F5F7] text-[#11153F]'
                }`}
                style={{
                  top: booth.top,
                  ...(booth.left ? { left: booth.left } : {}),
                  ...(booth.right ? { right: booth.right } : {}),
                }}
              >
                {/* Store Icon */}
                <BoothIcon width={18} height={18} />
                <span className="text-[12px] font-semibold tracking-tight">
                  {booth.name}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </BaseResponsiveLayout>
  );
}

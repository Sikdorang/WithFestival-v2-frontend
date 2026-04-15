import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import TopBar from '@/components/common/layouts/TopBar';
import { useNavigate } from 'react-router-dom';

// 💡 1. 지도에 표시할 부스 데이터 정의 (위치 및 이름)
interface BoothLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  isUs?: boolean; // 우리 부스 여부
}

const MOCK_BOOTHS: BoothLocation[] = [
  // 윗줄 (사회과학대 광장 방면)
  { id: '11', name: '막걸리나', x: 20, y: 80 },
  { id: '12', name: '하이볼Z', x: 20, y: 130 },
  { id: '13', name: '전이랑', x: 20, y: 180 },
  { id: '14', name: '어우야', x: 20, y: 230, isUs: true }, // 🌟 우리 부스

  // 아랫줄 (정문 방면)
  { id: '21', name: '소주방', x: 220, y: 100 },
  { id: '22', name: '청춘일기', x: 220, y: 150 },
  { id: '23', name: '경희빵집', x: 220, y: 200 },
  { id: '24', name: '축제야', x: 220, y: 250 },
];

export default function BoothMap() {
  const navigate = useNavigate();

  return (
    <BaseResponsiveLayout>
      <TopBar />

      <main className="flex min-h-screen flex-col bg-white px-6 pt-8 pb-24">
        {/* 상단 안내 문구 */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF9E6] text-xl">
              📍
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400">
                어우야 부스 위치
              </span>
              <span className="text-base font-bold text-[#11153F]">
                사회과학대학 앞 광장 14번
              </span>
            </div>
          </div>
        </div>

        {/* 인터랙티브 지도 영역 (SVG) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <svg
            viewBox="0 0 300 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            {/* 배경 및 길 (회색) */}
            <path d="M50 0V400" stroke="#F2F4F6" strokeWidth="20" />
            <path d="M250 0V400" stroke="#F2F4F6" strokeWidth="20" />
            <path d="M0 200H300" stroke="#F2F4F6" strokeWidth="20" />

            {/* 메인 무대 */}
            <rect
              x="100"
              y="20"
              width="100"
              height="40"
              rx="20"
              fill="#11153F"
              fillOpacity="0.1"
            />
            <text
              x="150"
              y="45"
              textAnchor="middle"
              fill="#11153F"
              fontSize="12"
              fontWeight="bold"
            >
              MAIN STAGE
            </text>

            {/* 💡 모든 부스 렌더링 */}
            {MOCK_BOOTHS.map((booth) => {
              const fill = booth.isUs ? '#FFD43A' : '#E2E8F0'; // 우리 부스는 노란색, 나머지는 회색
              const fontWeight = booth.isUs ? 'bold' : 'medium';

              return (
                <g key={booth.id}>
                  {/* 🌟 우리 부스일 경우에만 바깥쪽에 퍼지는 노란 불빛 효과 추가 */}
                  {booth.isUs && (
                    <circle
                      cx={booth.x + 30}
                      cy={booth.y + 20}
                      r="15"
                      fill="#FFD43A"
                      fillOpacity="0.4"
                    >
                      <animate
                        attributeName="r"
                        values="15;35;15"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="fill-opacity"
                        values="0.4;0;0.4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* 부스 사각형 (배경) */}
                  <rect
                    x={booth.x}
                    y={booth.y}
                    width="60"
                    height="40"
                    rx="8"
                    fill={fill}
                  />

                  {/* 텍스트: 부스 이름 */}
                  <text
                    x={booth.x + 30} // 사각형 중앙 정렬
                    y={booth.y + 25} // 사각형 중앙 정렬 (Baseline 고려)
                    textAnchor="middle"
                    fill="#11153F" // 딥 네이비 컬러로 가독성 확보
                    fontSize="10"
                    fontWeight={fontWeight}
                  >
                    {booth.name}
                  </text>
                </g>
              );
            })}

            {/* 입구 안내 */}
            <text
              x="150"
              y="380"
              textAnchor="middle"
              fill="#11153F"
              fontSize="10"
              fillOpacity="0.4"
            >
              정문 입구
            </text>
          </svg>
        </div>
      </main>
    </BaseResponsiveLayout>
  );
}

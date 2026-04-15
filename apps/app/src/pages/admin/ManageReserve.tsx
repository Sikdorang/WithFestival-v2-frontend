import CtaButton from '@/components/common/buttons/CtaButton';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import TopBar from '@/components/common/layouts/TopBar';
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// 💡 1. 모킹 데이터: 시간대 및 예약자 목록
interface TimeSlot {
  id: string;
  timeRange: string;
  bookedTables: number;
  maxTables: number;
}

interface Reservation {
  id: string;
  name: string;
  phone: string;
  peopleCount: number;
}

const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: '1', timeRange: '17:00 - 18:00', bookedTables: 3, maxTables: 5 },
  { id: '2', timeRange: '18:00 - 19:00', bookedTables: 5, maxTables: 5 },
  { id: '3', timeRange: '19:00 - 20:00', bookedTables: 1, maxTables: 5 },
  { id: '4', timeRange: '20:00 - 21:00', bookedTables: 0, maxTables: 5 },
];

const MOCK_RESERVATIONS: Record<string, Reservation[]> = {
  '1': [
    { id: 'r1', name: '김경희', phone: '010-1234-5678', peopleCount: 4 },
    { id: 'r2', name: '이축제', phone: '010-8765-4321', peopleCount: 2 },
    { id: 'r3', name: '박주점', phone: '010-1111-2222', peopleCount: 3 },
  ],
  '2': [
    { id: 'r4', name: '최어우', phone: '010-3333-4444', peopleCount: 4 },
    // ... (마감된 경우 5팀 리스트)
  ],
  '3': [{ id: 'r5', name: '정야야', phone: '010-5555-6666', peopleCount: 2 }],
  '4': [],
};

export default function AdminReserveManage() {
  const navigate = useNavigate();
  const isMobile = useMemo(() => /Mobi/i.test(window.navigator.userAgent), []);

  // 전역 예약 활성화 상태
  const [isReservationEnabled, setIsReservationEnabled] = useState(true);

  // 모달 상태: 예약자 명단 조회
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // 선택된 시간대의 예약자 목록 가져오기
  const currentReservations = useMemo(() => {
    if (!selectedSlotId) return [];
    return MOCK_RESERVATIONS[selectedSlotId] || [];
  }, [selectedSlotId]);

  const currentSlotTime = useMemo(() => {
    return (
      MOCK_TIME_SLOTS.find((s) => s.id === selectedSlotId)?.timeRange || ''
    );
  }, [selectedSlotId]);

  const handleToggleReservation = () => {
    setIsReservationEnabled((prev) => !prev);
    toast.success(
      isReservationEnabled
        ? '예약 기능이 비활성화되었습니다.'
        : '예약 기능이 활성화되었습니다.',
    );
  };

  const handleOpenUserModal = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsUserModalOpen(true);
  };

  return (
    <BaseResponsiveLayout>
      <TopBar />

      <main className="flex min-h-screen flex-col gap-4 bg-white px-4 pt-4">
        {/* 예약 전역 설정 토글 */}
        <div className="z-10 flex items-center justify-between rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(17,21,63,0.04)]">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-[#11153F]">
              예약 기능 활성화
            </span>
            <span className="text-xs text-gray-400">
              비활성화 시 방문객이 예약을 할 수 없습니다.
            </span>
          </div>
          <button
            onClick={handleToggleReservation}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
              isReservationEnabled ? 'bg-[#FFD43A]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                isReservationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 비활성화 시 어둡게(Dimming) 처리되는 영역 */}
        <div
          className={`flex flex-col gap-4 transition-all duration-500 ease-in-out ${
            !isReservationEnabled
              ? 'pointer-events-none opacity-40 grayscale-[30%] select-none'
              : 'opacity-100 grayscale-0'
          }`}
        >
          {/* 관리자 안내 배너 */}
          <div className="flex items-center gap-3 rounded-xl bg-[#FFF9E6] p-4 text-[#11153F]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFD43A] text-lg">
              ⚙️
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">예약 일정을 관리하세요</span>
              <span className="text-xs text-[#11153F]/70">
                시간대를 눌러 예약자를 확인하거나 정보를 수정하세요.
              </span>
            </div>
          </div>

          {/* 시간대 리스트 영역 */}
          <div className="flex flex-col gap-3 pb-24">
            {MOCK_TIME_SLOTS.map((slot) => {
              const percentage = (slot.bookedTables / slot.maxTables) * 100;
              const isFull = slot.bookedTables === slot.maxTables;

              return (
                <button
                  key={slot.id}
                  onClick={() => handleOpenUserModal(slot.id)}
                  className="flex w-full flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-[0_2px_8px_rgba(17,21,63,0.04)] transition-all active:scale-[0.98]"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-[#11153F]">
                        {slot.timeRange}
                      </span>
                      <span
                        className={`text-sm font-bold ${isFull ? 'text-[#FF4D4F]' : 'text-[#11153F]'}`}
                      >
                        {isFull
                          ? '예약 마감'
                          : `예약 중: ${slot.bookedTables}팀`}
                      </span>
                    </div>
                    {/* 💡 예약 정보 수정하기 버튼 (이벤트 버블링 방지) */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        // 실제 수정 페이지 라우트로 이동
                        navigate(`/manage-reserve/detail/${slot.id}`);
                      }}
                      className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 active:bg-gray-200"
                    >
                      예약 정보 수정하기
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-1.5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F4F6]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-[#FF4D4F]' : 'bg-[#FFD43A]'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="self-end text-[11px] font-medium text-gray-400">
                      {slot.bookedTables} / {slot.maxTables} 테이블
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <BottomSpace />
      </main>

      {/* 하단 고정 버튼 */}
      <footer className="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-100 bg-white/80 p-4 backdrop-blur-md">
        <CtaButton
          text={
            isReservationEnabled
              ? '+ 예약 시간 추가하기'
              : '예약 기능이 꺼져있습니다'
          }
          disabled={!isReservationEnabled}
          onClick={() => navigate('/manage-reserve/detail/0')}
          className="w-full transition-colors duration-300"
        />
      </footer>

      {/* ===================== [MODAL 1: 예약자 명단 조회] ===================== */}
      <Dialog.Root open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[2rem] bg-[#F8F9FB] outline-none">
            <div className="flex items-center justify-between p-6 pb-2">
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold text-[#11153F]">
                  {currentSlotTime}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  현재 예약자 {currentReservations.length}팀
                </span>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 pb-10">
              {currentReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <span className="mb-2 text-4xl">📭</span>
                  <p>아직 예약자가 없습니다.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {currentReservations.map((res, idx) => {
                    // tel: URI 스킴에 맞게 하이픈 제거
                    const formattedPhone = res.phone.replace(/-/g, '');

                    return (
                      <div
                        key={res.id}
                        className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF9E6] font-bold text-[#FFD43A]">
                            {idx + 1}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[#11153F]">
                              {res.name}{' '}
                              <span className="ml-1 text-xs font-normal text-gray-400">
                                ({res.peopleCount}명)
                              </span>
                            </span>

                            {/* 전화 걸기 기능 적용 및 입장 처리 버튼 삭제 */}
                            <a
                              href={
                                isMobile ? `tel:${formattedPhone}` : undefined
                              }
                              className={`text-sm font-medium text-gray-500 ${
                                isMobile
                                  ? 'underline underline-offset-4 active:text-[#11153F]'
                                  : ''
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {res.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BaseResponsiveLayout>
  );
}

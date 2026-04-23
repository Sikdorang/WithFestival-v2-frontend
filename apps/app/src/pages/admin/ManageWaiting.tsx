'use client';

import EmptyImage from '@/assets/icons/ic_empty_waiting.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import ReservedUsersModal from '@/components/pages/manageWaiting/ReservedUsersModal';
import ReserveSlotList from '@/components/pages/manageWaiting/ReserveSlotList';
import { WaitingCard } from '@/components/pages/manageWaiting/WaitingCard';
import WaitingTopBar from '@/components/pages/waiting/WaitingTopBar';
import { useSocket } from '@/contexts/useSocket';
import { useWaiting } from '@/hooks/useWaiting';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 💡 모킹 데이터: 예약용
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
  '2': [{ id: 'r4', name: '최어우', phone: '010-3333-4444', peopleCount: 4 }],
  '3': [{ id: 'r5', name: '정야야', phone: '010-5555-6666', peopleCount: 2 }],
  '4': [],
};

// 🌟 탭 타입 정의
type TabType = 'WAITING' | 'RESERVE';

export default function ManageWaiting() {
  const navigate = useNavigate();
  const isMobile = useMemo(() => /Mobi/i.test(window.navigator.userAgent), []);
  const [activeTab, setActiveTab] = useState<TabType>('WAITING');

  // ===================== [웨이팅 상태 및 로직] =====================
  const socket = useSocket();
  const { waitingList, fetchWaiting, setWaitingProcessed } = useWaiting();
  const [isWaitEnabled] = useState(false);

  useEffect(() => {
    fetchWaiting();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchWaiting();
    };
    if (socket) {
      socket.on('waitingProcessed', handleRefresh);
      socket.on('waitingCreated', handleRefresh);
    }
    return () => {
      if (socket) {
        socket.off('waitingProcessed', handleRefresh);
        socket.off('waitingCreated', handleRefresh);
      }
    };
  }, [socket]);

  // ===================== [예약 상태 및 로직] =====================
  const [isReservationEnabled] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const currentReservations = useMemo(() => {
    if (!selectedSlotId) return [];
    return MOCK_RESERVATIONS[selectedSlotId] || [];
  }, [selectedSlotId]);

  const currentSlotTime = useMemo(() => {
    return (
      MOCK_TIME_SLOTS.find((s) => s.id === selectedSlotId)?.timeRange || ''
    );
  }, [selectedSlotId]);

  const handleOpenUserModal = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsUserModalOpen(true);
  };

  return (
    <BaseResponsiveLayout>
      <WaitingTopBar value={0} type={activeTab} onTypeChange={setActiveTab} />

      {/* ===================== [웨이팅 탭 컨텐츠] ===================== */}
      {activeTab === 'WAITING' && (
        <main className="bg-gray-500-10 relative flex min-h-screen flex-col gap-4 px-4 pt-4">
          {!isWaitEnabled && (
            <div className="bg-gray-500-40 absolute inset-0 z-20 flex items-start justify-center pt-60">
              <div className="rounded-full bg-gray-800/80 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                웨이팅 접수가 비활성화되었습니다.
              </div>
            </div>
          )}

          <div
            className={
              !isWaitEnabled
                ? 'pointer-events-none opacity-40 grayscale-[30%] select-none'
                : ''
            }
          >
            {waitingList.length === 0 ? (
              <div className="flex min-h-[90vh] items-center justify-center pb-20">
                <EmptyPlaceHolder
                  image={<EmptyImage color="#D1D5DB" />}
                  text="웨이팅이 없습니다."
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4 pb-24">
                {waitingList.map((item) => (
                  <WaitingCard
                    key={item.id}
                    waitingInfo={item}
                    setWaitingProcessed={setWaitingProcessed}
                  />
                ))}
              </div>
            )}
          </div>
          <BottomSpace />
        </main>
      )}

      {/* ===================== [예약 일정 탭 컨텐츠] ===================== */}
      {activeTab === 'RESERVE' && (
        <main className="bg-gray-500-10 relative flex min-h-screen flex-col gap-4 px-4 pt-4">
          {!isReservationEnabled && (
            <div className="bg-gray-500-40 absolute inset-0 z-20 flex items-start justify-center pt-60">
              <div className="rounded-full bg-gray-800/80 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                예약 기능이 비활성화되었습니다.
              </div>
            </div>
          )}

          <div
            className={`flex flex-col gap-2 ${!isReservationEnabled ? 'pointer-events-none opacity-40 grayscale-[30%] select-none' : ''}`}
          >
            <ReserveSlotList onOpenUserModal={handleOpenUserModal} />
          </div>
          <BottomSpace />

          {activeTab === 'RESERVE' && (
            <CtaButton
              text={'예약 시간 추가'}
              disabled={!isReservationEnabled}
              onClick={() => navigate('/manage-reserve/detail/0')}
              className="fixed right-4 bottom-24 z-10 px-6 py-3 transition-all active:scale-95 disabled:bg-gray-200 disabled:text-white"
              width="fit"
              size="small"
            />
          )}
        </main>
      )}

      <ReservedUsersModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        slotTime={currentSlotTime}
        reservations={currentReservations}
        isMobile={isMobile}
      />
    </BaseResponsiveLayout>
  );
}

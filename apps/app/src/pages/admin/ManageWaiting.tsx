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
import { useReserve } from '@/hooks/useReserve';
import { useStore } from '@/hooks/useStore';
import { useWaiting } from '@/hooks/useWaiting';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TabType = 'WAITING' | 'RESERVE';

export default function ManageWaiting() {
  const navigate = useNavigate();
  const isMobile = useMemo(() => /Mobi/i.test(window.navigator.userAgent), []);
  const [activeTab, setActiveTab] = useState<TabType>('WAITING');

  const { waitingsEnabled, reservationEnabled, getMyStoreInfo } = useStore();

  useEffect(() => {
    getMyStoreInfo();
  }, []);

  // ===================== [웨이팅 상태 및 로직] =====================
  const socket = useSocket();
  const { waitingList, fetchWaitings, updateWaitingStatus } = useWaiting();
  const {
    slots,
    reservations,
    fetchSlots,
    fetchReservationsBySlot,
    deleteReservation,
  } = useReserve();

  useEffect(() => {
    fetchSlots();
    fetchWaitings();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleWaitingRefresh = () => {
      fetchWaitings();
    };

    const handleReservationRefresh = () => {
      fetchSlots();
    };

    socket.on('waiting.created', handleWaitingRefresh);
    socket.on('waiting.status.canceled', handleWaitingRefresh);
    socket.on('waiting.status.entered', handleWaitingRefresh);

    socket.on('reservation.created', handleReservationRefresh);
    socket.on('reservation.rejected', handleReservationRefresh);

    return () => {
      socket.off('waiting.created', handleWaitingRefresh);
      socket.off('waiting.status.canceled', handleWaitingRefresh);
      socket.off('waiting.status.entered', handleWaitingRefresh);
      socket.off('reservation.created', handleReservationRefresh);
      socket.off('reservation.rejected', handleReservationRefresh);
    };
  }, [socket, fetchWaitings, fetchSlots]);

  // ===================== [예약 상태 및 로직] =====================
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const currentSlotTime = useMemo(() => {
    const targetSlot = slots.find((s) => s.id === selectedSlotId);
    return targetSlot ? `${targetSlot.startTime} - ${targetSlot.endTime}` : '';
  }, [selectedSlotId, slots]);

  const handleOpenUserModal = async (slotId: number) => {
    setSelectedSlotId(slotId);
    await fetchReservationsBySlot(slotId);
    setIsUserModalOpen(true);
  };

  const handleRejectReservation = async (reservationId: number) => {
    const success = await deleteReservation(reservationId);
    if (success) {
      await fetchSlots();
    }
  };

  return (
    <BaseResponsiveLayout>
      <WaitingTopBar
        value={waitingList.length}
        type={activeTab}
        onTypeChange={setActiveTab}
      />

      {/* ===================== [웨이팅 탭 컨텐츠] ===================== */}
      {activeTab === 'WAITING' && (
        <main className="bg-gray-500-10 relative flex min-h-screen flex-col gap-4 px-4 pt-4">
          {!waitingsEnabled && (
            <div className="bg-gray-500-40 absolute inset-0 z-20 flex items-start justify-center pt-60">
              <div className="rounded-full bg-gray-800/80 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                웨이팅 접수가 비활성화되었습니다.
              </div>
            </div>
          )}

          <div
            className={
              !waitingsEnabled
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
                    updateWaitingStatus={updateWaitingStatus}
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
          {!reservationEnabled && (
            <div className="bg-gray-500-40 absolute inset-0 z-20 flex items-start justify-center pt-60">
              <div className="rounded-full bg-gray-800/80 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                예약 기능이 비활성화되었습니다.
              </div>
            </div>
          )}

          <div
            className={`flex flex-col gap-2 ${!reservationEnabled ? 'pointer-events-none opacity-40 grayscale-[30%] select-none' : ''}`}
          >
            <ReserveSlotList
              slots={slots}
              onOpenUserModal={handleOpenUserModal}
            />
          </div>
          <BottomSpace />

          {activeTab === 'RESERVE' && (
            <CtaButton
              text={'예약 시간 추가'}
              disabled={!reservationEnabled}
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
        reservations={reservations}
        isMobile={isMobile}
        onReject={handleRejectReservation}
      />
    </BaseResponsiveLayout>
  );
}

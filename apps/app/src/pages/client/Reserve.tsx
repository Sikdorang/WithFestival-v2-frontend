'use client';

import { reservationAPI } from '@/apis/reservation';
import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import CustomerReserveSlotList from '@/components/pages/reserve/CustomerReserveSlotList';
import ReservationModal from '@/components/pages/reserve/ReservationModal';
import { useReserve } from '@/hooks/useReserve';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Reserve() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 스토어 식별자(storeId) 추출
  const userData = useMemo(
    () =>
      location.state?.userData ||
      JSON.parse(sessionStorage.getItem('userData') || '{}'),
    [location.state],
  );

  const storeId = userData?.userId || userData?.id;

  const { slots, fetchCustomerSlots, isLoading } = useReserve();

  useEffect(() => {
    if (storeId) {
      fetchCustomerSlots(Number(storeId));
    }
  }, [storeId, fetchCustomerSlots]);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTimeRange = useMemo(() => {
    const targetSlot = slots.find((slot) => slot.id === selectedSlotId);
    return targetSlot ? `${targetSlot.startTime} ~ ${targetSlot.endTime}` : '';
  }, [selectedSlotId, slots]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    let formatted = rawValue;
    if (rawValue.length > 3 && rawValue.length <= 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  const isFormValid = name.trim().length >= 2 && phone.length === 13;

  const handleSubmit = async () => {
    if (!isFormValid || !storeId || !selectedSlotId) return;

    setIsSubmitting(true);
    try {
      await reservationAPI.createCustomerReservation(Number(storeId), {
        reservationSlotId: selectedSlotId,
        reserverName: name,
        phoneNumber: phone,
        partySize: peopleCount,
      });

      toast.success('예약이 완료되었습니다!');
      setIsModalOpen(false);
      navigate(-1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="부스 예약하기"
      />

      {/* ===================== [STEP 1: 시간대 선택 화면] ===================== */}
      <main className="flex min-h-screen flex-col bg-white">
        <div className="flex flex-col bg-red-100 px-6 py-4">
          <h2 className="mb-2 text-lg font-bold text-red-200">
            시간대를 선택해주세요
          </h2>
          <p className="text-gray-500-70 text-[15px] leading-relaxed font-medium">
            시간대별 최대 5 테이블 예약 가능해요
            <br />
            (1 테이블당 최대 4인)
          </p>
        </div>

        {!isLoading && (
          <CustomerReserveSlotList
            slots={slots}
            selectedSlotId={selectedSlotId}
            onSelectSlot={setSelectedSlotId}
          />
        )}
      </main>

      <footer className="pointer-events-none fixed right-0 bottom-0 left-0 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-white via-white/90 to-transparent px-4 pt-16 pb-8">
        <CtaButton
          disabled={!selectedSlotId || isLoading}
          onClick={() => setIsModalOpen(true)}
          text="다음으로"
          radius="_2xl"
          className="disabled:border-primary-300 disabled:bg-primary-300 pointer-events-auto active:scale-95 disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-50 disabled:active:scale-100"
        />
      </footer>

      <ReservationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedTimeRange={selectedTimeRange}
        name={name}
        setName={setName}
        phone={phone}
        handlePhoneChange={handlePhoneChange}
        peopleCount={peopleCount}
        setPeopleCount={setPeopleCount}
        isFormValid={isFormValid && !isSubmitting}
        handleSubmit={handleSubmit}
      />
    </BaseResponsiveLayout>
  );
}

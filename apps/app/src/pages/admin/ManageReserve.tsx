import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import TextArea from '@/components/common/inputs/TextArea';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { useReserve } from '@/hooks/useReserve';
import { useStore } from '@/hooks/useStore';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
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

export default function AdminReserveManage() {
  const navigate = useNavigate();

  // 1. useStore 훅에서 필요한 상태와 함수 추출
  const { reservationEnabled, updateStoreStatus, getMyStoreInfo, isLoading } =
    useStore();

  const { fetchSlots, isLoading: isReserveLoading } = useReserve();

  // 모달 상태 관리
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTime, setMessageTime] = useState<number>(10);
  const [messageContent, setMessageContent] = useState<string>(
    '예약하신 시간이 얼마 남지 않았습니다. 늦지 않게 부스로 와주세요!',
  );

  useEffect(() => {
    getMyStoreInfo();
    fetchSlots();
  }, []);

  const handleToggleReservation = async () => {
    await updateStoreStatus('reservation', !reservationEnabled);
  };

  const handleSaveMessageSettings = () => {
    if (!messageContent.trim()) {
      toast.error('메시지 내용을 입력해주세요.');
      return;
    }
    toast.success('예약 메시지 설정이 저장되었습니다.');
    setIsMessageModalOpen(false);
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="예약 관리"
      />

      <main className="flex min-h-screen flex-col gap-4 bg-white px-4 pt-4">
        <div className="flex flex-col gap-2">
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
              disabled={isLoading}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
                reservationEnabled ? 'bg-[#FFD43A]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  reservationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 2. 예약 메시지 설정 버튼 (예약 기능이 켜져있을 때만 활성화) */}
          <button
            onClick={() => setIsMessageModalOpen(true)}
            disabled={!reservationEnabled || isLoading}
            className={`z-10 flex w-full items-center justify-between rounded-xl bg-white p-5 text-left shadow-[0_2px_8px_rgba(17,21,63,0.04)] transition-all active:bg-gray-50 ${
              !reservationEnabled
                ? 'pointer-events-none opacity-40 grayscale-[30%]'
                : ''
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-[#11153F]">
                예약 알림 메시지 설정
              </span>
              <span className="text-xs text-gray-400">
                예약 시간 {messageTime}분 전에 알림톡이 전송됩니다.
              </span>
            </div>
            <span className="text-xl font-light text-gray-300">›</span>
          </button>
        </div>
      </main>

      {/* ===================== [Modal: 예약 알림 메시지 설정] ===================== */}
      <Dialog.Root
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/25" />
          <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[2rem] bg-white outline-none">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 pb-4">
              <span className="text-xl font-bold text-[#11153F]">
                예약 메시지 설정
              </span>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-8 overflow-y-auto px-6 pb-24">
              {/* 알림 전송 시간 선택 */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#11153F]">
                  언제 알림을 보낼까요?
                </label>
                <div className="flex w-full gap-2">
                  {[5, 10, 15].map((time) => (
                    <button
                      key={time}
                      onClick={() => setMessageTime(time)}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition-colors ${
                        messageTime === time
                          ? 'bg-[#11153F] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {time === 60 ? '1시간 전' : `${time}분 전`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 메시지 내용 수정 */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#11153F]">
                  메시지 내용
                </label>
                <TextArea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="방문객에게 보낼 메시지를 입력하세요."
                  limitHide
                />
              </div>
            </div>

            {/* 하단 고정 저장 버튼 */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4">
              <CtaButton
                text="저장하기"
                onClick={handleSaveMessageSettings}
                className="w-full"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BaseResponsiveLayout>
  );
}

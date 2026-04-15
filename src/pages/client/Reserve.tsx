import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import TopBar from '@/components/common/layouts/TopBar';
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface TimeSlot {
  id: string;
  timeRange: string;
  bookedTables: number;
  maxTables: number;
}

const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: '1', timeRange: '17:00 - 19:00', bookedTables: 3, maxTables: 5 },
  { id: '2', timeRange: '19:00 - 21:00', bookedTables: 5, maxTables: 5 },
  { id: '3', timeRange: '21:00 - 23:00', bookedTables: 1, maxTables: 5 },
  { id: '4', timeRange: '23:00 - 01:00', bookedTables: 4, maxTables: 5 },
];

export default function Reserve() {
  const navigate = useNavigate();

  // --- Step 1: 시간대 선택 상태 ---
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // --- Step 2: 모달 및 폼 상태 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);

  // 선택된 시간대의 문자열 가져오기
  const selectedTimeRange = useMemo(() => {
    return (
      MOCK_TIME_SLOTS.find((slot) => slot.id === selectedSlotId)?.timeRange ||
      ''
    );
  }, [selectedSlotId]);

  // 연락처 자동 하이픈 변환
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

  // 최종 예약 확정 핸들러
  const handleSubmit = () => {
    if (!isFormValid) return;

    // TODO: 서버 API 연동
    console.log('예약 요청 데이터:', {
      slotId: selectedSlotId,
      name,
      phone,
      peopleCount,
    });

    toast.success('예약이 완료되었습니다!');
    setIsModalOpen(false);
  };

  return (
    <BaseResponsiveLayout>
      <TopBar />

      {/* ===================== [STEP 1: 시간대 선택 화면] ===================== */}
      <main className="flex min-h-screen flex-col gap-4 bg-white px-4 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#FFF9E6] p-4 text-[#11153F]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFD43A] text-lg">
            🍽️
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">시간대를 선택하세요</span>
            <span className="text-xs text-[#11153F]/70">
              시간대별 최대 5테이블 예약 가능 (1테이블 최대 4인)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-24">
          {MOCK_TIME_SLOTS.map((slot) => {
            const remaining = slot.maxTables - slot.bookedTables;
            const percentage = (slot.bookedTables / slot.maxTables) * 100;
            const isFull = remaining === 0;
            const isAlmostFull = remaining === 1 && !isFull;
            const isSelected = selectedSlotId === slot.id;

            return (
              <button
                key={slot.id}
                disabled={isFull}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`flex w-full flex-col gap-3 rounded-2xl border-2 bg-white p-5 text-left transition-all ${
                  isFull
                    ? 'cursor-not-allowed border-transparent opacity-50'
                    : isSelected
                      ? 'border-[#FFD43A] shadow-[0_4px_16px_rgba(255,212,58,0.15)]'
                      : 'border-transparent shadow-[0_2px_8px_rgba(17,21,63,0.04)] active:scale-[0.98]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-[#11153F]">
                      {slot.timeRange}
                    </span>
                    <span
                      className={`text-sm font-bold ${isFull ? 'text-gray-400' : isAlmostFull ? 'text-[#FF4D4F]' : 'text-[#11153F]'}`}
                    >
                      {isFull
                        ? '예약이 마감되었습니다'
                        : `남은 테이블: ${remaining}개`}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="text-[#FFD43A]">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F4F6]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isAlmostFull ? 'bg-[#FF4D4F]' : 'bg-[#FFD43A]'}`}
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
        <BottomSpace />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-100 bg-white/80 p-4 backdrop-blur-md">
        <CtaButton
          text={selectedSlotId ? '다음 단계로' : '예약할 시간대를 선택해주세요'}
          disabled={!selectedSlotId}
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        />
      </footer>

      {/* ===================== [STEP 2: 예약 폼 모달 (Radix Dialog)] ===================== */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

          <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white duration-300 outline-none">
            {/* 모달용 커스텀 네비게이터 */}
            <div className="sticky top-0 z-10 bg-[#F8F9FB]">
              <Navigator
                left={<GoBackIcon />}
                onLeftPress={() => setIsModalOpen(false)}
                title="예약 정보 입력"
              />
            </div>

            <div className="flex flex-grow flex-col gap-6 px-4 pt-4 pb-24">
              {/* 시간대 재확인 배너 */}
              <div className="flex items-center justify-between rounded-2xl bg-[#11153F] p-6 text-white shadow-lg shadow-indigo-900/10">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#FFD43A]">
                    선택한 예약 시간
                  </span>
                  <span className="text-2xl font-bold tracking-wide">
                    {selectedTimeRange}
                  </span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur-sm">
                  🌙
                </div>
              </div>

              {/* 폼 영역 */}
              <section className="flex flex-col gap-4">
                <TextInput
                  label="예약자 성함"
                  placeholder="이름을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  limitHide
                />
                <TextInput
                  label="연락처"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  type="tel"
                  maxLength={13}
                  limitHide
                />

                {/* 인원 수 Stepper */}
                <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(17,21,63,0.04)]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-[#11153F]">
                      예약 인원 수
                    </span>
                    <span className="text-xs font-medium text-[#11153F]/50">
                      테이블 1개 배정 (최대 4인)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-[#F8F9FB] p-1.5">
                    <button
                      onClick={() =>
                        setPeopleCount(Math.max(1, peopleCount - 1))
                      }
                      disabled={peopleCount <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-bold text-[#11153F] shadow-sm active:bg-gray-50 disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-base font-bold text-[#11153F]">
                      {peopleCount}
                    </span>
                    <button
                      onClick={() =>
                        setPeopleCount(Math.min(4, peopleCount + 1))
                      }
                      disabled={peopleCount >= 4}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-bold text-[#11153F] shadow-sm active:bg-gray-50 disabled:opacity-30"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </section>

              {/* 유의사항 */}
              <div className="mt-4 rounded-xl bg-[#F2F4F6] p-5 text-xs text-[#11153F]/60">
                <p className="mb-2 font-bold text-[#11153F]/80">
                  💡 예약 전 유의사항
                </p>
                <ul className="flex list-disc flex-col gap-1.5 pl-4">
                  <li>
                    예약 시간{' '}
                    <strong className="text-[#FF4D4F]">
                      10분 경과 시 자동 취소
                    </strong>
                    되며, 노쇼 시 향후 예약이 제한될 수 있습니다.
                  </li>
                  <li>
                    입장 시 예약자의{' '}
                    <strong className="text-[#11153F]">
                      학생증(또는 신분증) 확인
                    </strong>
                    이 필요합니다.
                  </li>
                </ul>
              </div>
            </div>

            {/* 폼 모달용 하단 CTA */}
            <footer className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-[#F8F9FB]/90 p-4 backdrop-blur-md">
              <CtaButton
                text={
                  isFormValid
                    ? `${peopleCount}명 예약 확정하기`
                    : '정보를 모두 입력해주세요'
                }
                disabled={!isFormValid}
                onClick={handleSubmit}
                className="w-full transition-all"
              />
            </footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BaseResponsiveLayout>
  );
}

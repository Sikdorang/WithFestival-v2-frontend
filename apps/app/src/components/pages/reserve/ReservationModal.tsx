import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import ExclamationIcon from '@/assets/icons/ic_exclamation_circle.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import Navigator from '@/components/common/layouts/Navigator';
import * as Dialog from '@radix-ui/react-dialog';

interface ReservationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTimeRange: string;
  name: string;
  setName: (name: string) => void;
  phone: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  peopleCount: number;
  setPeopleCount: (count: number | ((prev: number) => number)) => void;
  isFormValid: boolean;
  handleSubmit: () => void;
}

export default function ReservationModal({
  isOpen,
  onOpenChange,
  selectedTimeRange,
  name,
  setName,
  phone,
  handlePhoneChange,
  peopleCount,
  setPeopleCount,
  isFormValid,
  handleSubmit,
}: ReservationModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white duration-300 outline-none">
          <Navigator
            left={<GoBackIcon />}
            onLeftPress={() => onOpenChange(false)}
            title="예약 정보 입력"
          />

          <div className="flex flex-grow flex-col pt-4 pb-32">
            {/* 1. 선택한 예약 시간 */}
            <div className="mx-6 mb-8 flex flex-col gap-1.5 rounded-xl bg-[#F4F5F7] p-5">
              <span className="text-gray-500-70 text-[13px] font-medium">
                선택한 예약 시간
              </span>
              <span className="text-[19px] font-bold text-[#11153F]">
                {selectedTimeRange}
              </span>
            </div>

            {/* 2. 폼 입력 영역 */}
            <section className="flex flex-col gap-6 px-6">
              <TextInput
                label="예약자 성함"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                limitHide
              />
              <TextInput
                label="예약자 연락처"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                type="tel"
                maxLength={13}
                limitHide
              />

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
                    onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                    disabled={peopleCount <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-bold text-[#11153F] shadow-sm active:bg-gray-50 disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="w-4 text-center text-base font-bold text-[#11153F]">
                    {peopleCount}
                  </span>

                  <button
                    onClick={() => setPeopleCount(Math.min(4, peopleCount + 1))}
                    disabled={peopleCount >= 4}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-bold text-[#11153F] shadow-sm active:bg-gray-50 disabled:opacity-30"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </section>

            {/* 3. 하단 유의사항 영역 */}
            <div className="mt-10 flex flex-col gap-4 bg-[#F8F9FB] px-6 py-4">
              <div className="flex items-center gap-1.5">
                <ExclamationIcon width={15} height={15} />
                <h3 className="text-[15px] font-bold text-red-200">
                  예약 전 꼭 확인해주세요
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5 text-[14px] leading-relaxed text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                  <span>
                    예약 시간 10분 경과 시 자동 취소되며, 노쇼 시 향후 예약이
                    제한 될 수 있습니다.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                  <span>
                    입장 시 예약자의 학생증(또는 신분증) 확인이 필요합니다.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 하단 고정 버튼 */}
          <footer className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4 pb-6">
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
  );
}

import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { ReservationInfo } from '@/types/payload/reservation';
import * as Dialog from '@radix-ui/react-dialog';

interface ReserveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotTime: string;
  reservations: ReservationInfo[];
  isMobile: boolean;
  onReject: (reservationId: number) => void;
}

export default function ReserveUserModal({
  isOpen,
  onClose,
  slotTime,
  reservations,
  isMobile,
  onReject,
}: ReserveUserModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/25" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[2rem] bg-[#F8F9FB] outline-none">
          <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-[#11153F]">
                {slotTime}
              </span>
              <span className="text-sm font-medium text-gray-500">
                현재 예약{' '}
                <span className="font-semibold text-[#FFB800]">
                  {reservations.length}
                </span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-[#11153F]"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 pb-10">
            {reservations.length === 0 ? (
              <EmptyPlaceHolder
                image={undefined}
                text={'현재 예약자가 없습니다.'}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {reservations.map((res, idx) => {
                  const phoneString = res.phoneNumber || '';
                  const formattedPhone = phoneString.replace(/-/g, '');

                  return (
                    <div
                      key={res.id}
                      className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-400">
                          {idx + 1}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-[#11153F]">
                            {res.reserverName || '이름 없음'}
                          </span>

                          <span className="text-sm text-gray-500">
                            ({res.partySize || 0}명)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={
                            isMobile && formattedPhone
                              ? `tel:${formattedPhone}`
                              : undefined
                          }
                          className={`text-sm font-semibold text-gray-700 underline underline-offset-4 ${
                            isMobile && formattedPhone
                              ? 'active:text-[#11153F]'
                              : ''
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {phoneString || '연락처 없음'}
                        </a>

                        <DeleteConfirmModal
                          title="해당 손님을 거절할까요?"
                          description="손님에게 먼저 연락을 취한 뒤 거절 버튼을 눌러주세요. 거절 버튼을 누르면 리스트가 삭제됩니다."
                          cancelButtonText="취소"
                          confirmButtonText="거절하기"
                          onConfirm={() => onReject(res.id)}
                        >
                          <button className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-500 active:bg-red-100">
                            거절
                          </button>
                        </DeleteConfirmModal>
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
  );
}

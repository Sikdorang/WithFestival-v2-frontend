import * as Dialog from '@radix-ui/react-dialog';

interface ReserveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotTime: string;
  reservations: any[];
  isMobile: boolean;
}

export default function ReserveUserModal({
  isOpen,
  onClose,
  slotTime,
  reservations,
  isMobile,
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
                현재 예약자 {reservations.length}팀
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 pb-10">
            {reservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <span className="mb-2 text-4xl">📭</span>
                <p>아직 예약자가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reservations.map((res, idx) => {
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
  );
}

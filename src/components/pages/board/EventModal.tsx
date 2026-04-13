import * as Dialog from '@radix-ui/react-dialog';
import EventIcon from '@/assets/icons/ic_eventbox.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';

interface Props {
  event: string;
  open: boolean;
  onClose: () => void;
}

export default function EventModal({ open, onClose, event }: Props) {
  const eventLines = event.split('\n');
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/25 duration-300 ease-out" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg bg-transparent p-6 duration-300 ease-out">
          <div className="w-full items-center justify-center rounded-xl bg-white p-6">
            <Dialog.Title className="text-st-2 mb-6 flex items-center gap-2 text-center font-bold">
              <div className="text-st-1 flex w-full items-center justify-center gap-2">
                <EventIcon />
                <div>이벤트에 참여해보세요 !</div>
              </div>
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="text-b-2 items-start text-gray-600">
                {eventLines.map((line, index) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-2">・</span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))}
              </div>
            </Dialog.Description>
          </div>
          <div className="mt-6 flex justify-center">
            <CtaButton
              onClick={onClose}
              text="닫기"
              radius="_2xl"
              color="white"
              width="fit"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

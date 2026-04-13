import * as Dialog from '@radix-ui/react-dialog';
import { type PropsWithChildren } from 'react';
import CtaButton from '../buttons/CtaButton';

interface Props extends PropsWithChildren {
  title: string;
  description: string;
  cancelButtonText: string;
  confirmButtonText: string;
  onConfirm?: () => void;
}

export default function DeleteConfirmModal({
  children,
  title,
  description,
  cancelButtonText = '아니요',
  confirmButtonText = '예',
  onConfirm,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/25 duration-300 ease-out" />

        <Dialog.Content className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg duration-300 ease-out">
          <Dialog.Title className="text-st-1 text-center">{title}</Dialog.Title>
          <Dialog.Description className="text-b-2 mt-6 text-center text-gray-500">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-4">
            <Dialog.Close asChild>
              <CtaButton
                text={cancelButtonText}
                size="small"
                color="gray"
                radius="xl"
              />
            </Dialog.Close>
            <Dialog.Close asChild>
              <CtaButton
                text={confirmButtonText}
                size="small"
                color="red"
                radius="xl"
                onClick={onConfirm ?? (() => {})}
              />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

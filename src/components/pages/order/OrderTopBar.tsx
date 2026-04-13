import ArrowRightLeftIcon from '@/assets/icons/ic_arrow_right_left.svg?react';
import MessageIcon from '@/assets/icons/ic_letter.svg?react';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import CustomerInquiry from './CustomerInquiry';
import { useSocket } from '@/contexts/useSocket';
import { TabButton } from '@/components/common/buttons/TabButton';

interface Props {
  orderCount: number;
  type: 'pending' | 'sent';
  onTypeChange: (newType: 'pending' | 'sent') => void;
}

export default function OrderTopBar({ orderCount, type, onTypeChange }: Props) {
  const socket = useSocket();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleMessageCreated = () => {
      setHasNewMessage(true);
    };

    socket.on('messageCreated', handleMessageCreated);

    return () => {
      socket.off('messageCreated', handleMessageCreated);
    };
  }, [socket]);

  const handleCustomerInquiryClick = () => {
    setHasNewMessage(false);
    setIsModalOpen(true);
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="flex w-full items-center justify-between bg-white px-4 py-2">
        <div className="text-st-2 flex gap-1 text-black">
          <div>{type === 'pending' ? '신규 주문' : '확정 주문'}</div>
          <span className="text-primary-300">{orderCount}</span>
        </div>

        <div className="flex flex-row items-center gap-2 w-[200px]">
          {/* <div
            className="relative cursor-pointer rounded-2xl bg-gray-100 p-3"
            onClick={handleCustomerInquiryClick}
          >
            <MessageIcon />
            {hasNewMessage && (
              <div className="absolute right-2 bottom-3 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
            )}
          </div> */}

          <TabButton
            options={['송금 전', '송금 완료']}
            selectedIndex={type === 'pending' ? 0 : 1}
            onChange={(index) => {
            onTypeChange(index === 0 ? 'pending' : 'sent');
            }}
          />

        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <Dialog.Title className="sr-only">고객 문의</Dialog.Title>
            <Dialog.Description className="sr-only">
              고객 메세지
            </Dialog.Description>
            <CustomerInquiry
              onClose={() => {
                setIsModalOpen(false);
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}

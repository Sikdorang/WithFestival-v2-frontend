import * as Dialog from '@radix-ui/react-dialog';
import MessageImage from '@/assets/images/img_post.png';
import CallImage from '@/assets/images/img_bell.png';
import CtaButton from '@/components/common/buttons/CtaButton';
import Navigator from '@/components/common/layouts/Navigator';
import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import TextInput from '@/components/common/inputs/TextInput';
import { useState } from 'react';
import { useOrder } from '@/hooks/useOrder';

interface Props {
  type: 'message' | 'call';
  open: boolean;
  onClose: () => void;
}

export default function RequestModal({ open, onClose, type }: Props) {
  const { createMessage, createServiceRequestOrder } = useOrder();

  const [inputValue, setInputValue] = useState('');
  const handleSubmit = () => {
    if (type === 'message') {
      createMessage(inputValue);
    } else {
      createServiceRequestOrder(inputValue);
    }

    onClose();
    setInputValue('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/25" />
        <Dialog.Description className="sr-only">
          직원에게 메시지를 보내거나 필요한 물품을 요청할 수 있습니다.
        </Dialog.Description>

        <Dialog.Content className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom fixed inset-0 z-50 flex flex-col bg-white duration-300">
          <header className="flex-shrink-0">
            <Navigator
              left={<GoBackIcon onClick={onClose} />}
              center={
                <Dialog.Title className="text-st-1">
                  {type === 'message' ? '메세지' : '호출하기'}
                </Dialog.Title>
              }
            />
          </header>

          <main className="flex-grow overflow-y-auto p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              {type === 'message' ? (
                <img src={MessageImage} className="w-1/2" alt="message" />
              ) : (
                <img src={CallImage} className="w-1/2" alt="call" />
              )}
              <TextInput
                label={
                  type === 'message'
                    ? '직원에게 메세지를 보내주세요 !'
                    : '어떤게 필요하신가요 ?'
                }
                placeholder={
                  type === 'message'
                    ? 'ex. 신청곡, 응원, 미팅'
                    : '필요한 내용을 입력해주세요.'
                }
                maxLength={20}
                limitHide
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </main>

          <footer className="flex-shrink-0 p-4">
            <CtaButton
              onClick={handleSubmit}
              color="white"
              text="전송하기"
              radius="_2xl"
              disabled={inputValue.trim() === ''}
            />
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import EmptyImage from '@/assets/images/img_bell.png';
import Navigator from '@/components/common/layouts/Navigator';
import { IMessage } from '@/types/global';
import CustomerInquiryItem from './CustomerInquiryItem';

interface Props {
  onClose: () => void;
}

export default function CustomerInquiry({ onClose }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Navigator
        left={<GoBackIcon />}
        center={<div className="text-st-1">고객 메세지</div>}
        onLeftPress={onClose}
      />

      <main className="flex flex-grow flex-col gap-3 p-4">
        {[].length === 0 ? (
          <div className="flex flex-grow flex-col items-center justify-center gap-2">
            <img src={EmptyImage} alt="empty" className="h-16 w-16" />
            <div className="text-b-1 text-gray-400">
              도착한 메세지가 없어요 !
            </div>
          </div>
        ) : (
          [].map((item: IMessage) => (
            <CustomerInquiryItem
              key={item.id}
              inquiry={item}
              checkMessage={() => {}}
            />
          ))
        )}
      </main>
    </div>
  );
}

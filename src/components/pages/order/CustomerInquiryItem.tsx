import { IMessage } from '@/types/global';
import CheckIcon from '@/assets/icons/ic_check.svg?react';

interface Props {
  inquiry: IMessage;
  checkMessage: (id: number) => void;
}

export default function CustomerInquiryItem({ inquiry, checkMessage }: Props) {
  return (
    <div className="flex flex-col rounded-xl bg-gray-100 p-4">
      <div className="flex flex-col gap-1">
        <div className="text-b-2">테이블 번호 {inquiry.tableNumber}</div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-st-2">{inquiry.message} </div>
          <div className="text-c-1 rounded-full text-gray-200">
            {inquiry.time}
          </div>
        </div>
        <div
          className={`${
            inquiry.check ? 'bg-gray-200' : 'bg-primary-300'
          } flex h-10 w-10 items-center justify-center rounded-full`}
          onClick={() => {
            checkMessage(inquiry.id);
          }}
        >
          {inquiry.check ? (
            <CheckIcon width={20} height={20} color="white" />
          ) : (
            <CheckIcon width={20} height={20} color="white" />
          )}
        </div>
      </div>
    </div>
  );
}

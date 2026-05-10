import { IWaitingListItem } from '@/types/global';
import { useMemo } from 'react';

interface Props {
  waitingInfo: IWaitingListItem;
  updateWaitingStatus: (waitingId: number, status: string) => void;
}

export function WaitingCard({ waitingInfo, updateWaitingStatus }: Props) {
  const { name, people, phoneNumber, time, id } = waitingInfo;

  const isMobile = useMemo(() => /Mobi/i.test(window.navigator.userAgent), []);
  const formattedPhone = useMemo(
    () => phoneNumber.replace(/-/g, ''),
    [phoneNumber],
  );

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-[#EAECEF] px-2 py-1.5 text-base font-semibold text-gray-800">
          {id}번
        </span>
        <span className="font-medium text-gray-400">{time}</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">예약자 이름</span>
          <span className="text-lg font-semibold text-gray-800">{name}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">전화번호</span>
          <a
            href={isMobile ? `tel:${formattedPhone}` : undefined}
            className="text-lg font-semibold text-gray-800 underline underline-offset-4"
            onClick={(e) => e.stopPropagation()}
          >
            {phoneNumber}
          </a>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">인원</span>
          <span className="text-lg font-semibold text-gray-800">
            {people}명
          </span>
        </div>
      </div>

      <div className="flex gap-3 text-base">
        <button
          className="rounded-xl bg-[#FFF0F0] px-6 py-4 font-bold text-[#DE5252] transition-colors active:bg-red-100"
          onClick={() => updateWaitingStatus(id, 'CANCELED')}
        >
          취소하기
        </button>
        <button
          className="flex-1 rounded-xl bg-[#FFCC3E] py-4 font-bold text-[#36383E] transition-colors active:bg-yellow-500"
          onClick={() => updateWaitingStatus(id, 'ENTERED')}
        >
          착석 완료
        </button>
      </div>
    </div>
  );
}

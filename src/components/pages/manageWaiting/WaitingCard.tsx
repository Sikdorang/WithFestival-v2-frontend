import { SUCCESS_MESSAGES } from '@/constants/message';
import { IWaitingListItem } from '@/types/global';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

interface Props {
  waitingInfo: IWaitingListItem;
  setWaitingProcessed: (waitingId: number) => void;
}

export function WaitingCard({ waitingInfo, setWaitingProcessed }: Props) {
  const { name, people, phoneNumber, time, id } = waitingInfo;

  const isMobile = useMemo(() => /Mobi/i.test(window.navigator.userAgent), []);
  const formattedPhone = useMemo(
    () => phoneNumber.replace(/-/g, ''),
    [phoneNumber],
  );

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-[#F8F9FA] p-5 shadow-sm">
      {/* Header: 대기 번호 및 시간 */}
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-[#EAECEF] px-2 py-1.5 text-base font-semibold text-gray-800">
          {id}번
        </span>
        <span className="font-medium text-gray-400">{time}</span>
      </div>

      {/* Body: 상세 정보 리스트 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-medium">예약자 이름</span>
          <span className="text-lg font-semibold text-gray-800">{name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-medium">전화번호</span>
          <a
            href={isMobile ? `tel:${formattedPhone}` : undefined}
            className="text-lg font-semibold text-gray-800 underline underline-offset-4"
            onClick={(e) => e.stopPropagation()}
          >
            {phoneNumber}
          </a>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-medium">인원</span>
          <span className="text-lg font-semibold text-gray-800">{people}명</span>
        </div>
      </div>

      {/* Footer: 액션 버튼 */}
      <div className="flex gap-3 text-base">
        <button
          className="rounded-xl bg-[#FFF0F0] px-6 py-4 font-bold text-[#DE5252] transition-colors active:bg-red-100"
          onClick={() => {
            setWaitingProcessed(id);
            toast.success(SUCCESS_MESSAGES.waitingCancelSuccess);
          }}
        >
          취소하기
        </button>
        <button
          className="flex-1 rounded-xl bg-[#FFCC3E] py-4 font-bold text-[#36383E] transition-colors active:bg-yellow-500"
          onClick={() => {
            setWaitingProcessed(id);
            toast.success(SUCCESS_MESSAGES.waitingSuccess);
          }}
        >
          착석 완료
        </button>
      </div>
    </div>
  );
}
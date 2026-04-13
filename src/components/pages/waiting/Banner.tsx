import CheckAnimation from '@/assets/lotties/lottie_check.json';
import Lottie from 'lottie-react';

interface Props {
  boothName: string;
  waitingListLength: number;
  isFinishJoinWaitlist?: boolean;
}

export default function Banner({
  boothName,
  waitingListLength,
  isFinishJoinWaitlist,
}: Props) {
  return (
    <div className="text-t-1 flex flex-col items-center gap-4 pt-20">
      {isFinishJoinWaitlist && (
        <div className="flex flex-col items-center gap-3">
          <Lottie
            animationData={CheckAnimation}
            loop={false}
            style={{ width: 64, height: 64 }}
          />
          <div className="text-st-2 text-gray-400">웨이팅 등록 완료 !</div>
        </div>
      )}
      <div className="text-c-1">{boothName}</div>
      <div>
        현재 대기팀{' '}
        <span className="text-primary-300">{waitingListLength}</span>
      </div>
    </div>
  );
}

import LogoImage from '@/assets/images/img_logo.svg?react';
import { TabButton } from '../../common/buttons/TabButton';

interface Props {
  value: number;
  type: 'WAITING' | 'RESERVE';
  onTypeChange: (newType: 'WAITING' | 'RESERVE') => void;
}

export default function WaitingTopBar({ value, type, onTypeChange }: Props) {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-col gap-4 bg-white px-6 pt-4 pb-2 shadow-sm">
      <div className="flex w-full items-center">
        <LogoImage name="logo" />
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="text-st-2 flex items-baseline gap-2 font-bold">
          <div className="text-black">
            {type === 'WAITING' ? '현재 웨이팅' : '웨이팅 일정'}
          </div>
          <span className="text-primary-300">{value}</span>
        </div>

        <div className="flex w-[200px]">
          <TabButton
            options={['현재 웨이팅', '예약 일정']}
            selectedIndex={type === 'WAITING' ? 0 : 1}
            onChange={(index) => {
              onTypeChange(index === 0 ? 'WAITING' : 'RESERVE');
            }}
          />
        </div>
      </div>
    </div>
  );
}

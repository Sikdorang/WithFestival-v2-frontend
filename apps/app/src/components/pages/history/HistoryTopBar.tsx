import LogoImage from '@/assets/images/img_logo.svg?react';
import { TabButton } from '../../common/buttons/TabButton';

interface Props {
  title: string;
  value: number;
  type: 'TODAY' | 'ALL';
  onTypeChange: (newType: 'TODAY' | 'ALL') => void;
}

export default function HistoryTopBar({
  title,
  value,
  type,
  onTypeChange,
}: Props) {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-col gap-4 bg-white px-6 pt-4 pb-2 shadow-sm">
      <div className="flex w-full items-center">
        <LogoImage name="logo" />
      </div>

      <div className="flex w-full items-center justify-between">
        <h1 className="text-st-2 flex items-baseline gap-2 font-bold text-black">
          <div>{title}</div>
          <span className="text-primary-300">{value}</span>
        </h1>

        <div className="flex w-[160px]">
          <TabButton
            options={['금일', '전체']}
            selectedIndex={type === 'TODAY' ? 0 : 1}
            onChange={(index) => {
              onTypeChange(index === 0 ? 'TODAY' : 'ALL');
            }}
          />
        </div>
      </div>
    </div>
  );
}

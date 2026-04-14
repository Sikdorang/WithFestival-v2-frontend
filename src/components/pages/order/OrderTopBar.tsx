import LogoImage from '@/assets/images/img_logo.svg?react';
import { TabButton } from '@/components/common/buttons/TabButton';

interface Props {
  orderCount: number;
  type: 'pending' | 'sent';
  onTypeChange: (newType: 'pending' | 'sent') => void;
}

export default function OrderTopBar({ orderCount, type, onTypeChange }: Props) {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-col gap-4 bg-white px-6 pt-4 pb-2 shadow-sm">
      <div className="flex w-full items-center">
        <LogoImage name="logo" />
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="text-st-2 flex items-baseline gap-2 font-bold">
          <div className="text-black">
            {type === 'pending' ? '신규 주문' : '확정 주문'}
          </div>
          <span className="text-primary-300">{orderCount}</span>
        </div>

        <div className="flex w-[200px]">
          <TabButton
            options={['송금 전', '송금 완료']}
            selectedIndex={type === 'pending' ? 0 : 1}
            onChange={(index) => {
              onTypeChange(index === 0 ? 'pending' : 'sent');
            }}
          />
        </div>
      </div>
    </div>
  );
}

import ClockIcon from '@/assets/icons/ic_clock.svg?react';
import SettingsIcon from '@/assets/icons/ic_cogwheel.svg?react';
import FoodIcon from '@/assets/icons/ic_cuisine.svg?react';
import ReceiptIcon from '@/assets/icons/ic_receipt.svg?react';

export interface Props {
  activeTab: 'timer' | 'history' | 'food' | 'settings';
  onTabClick: (tabName: 'timer' | 'history' | 'food' | 'settings') => void;
  hasNewWaiting: boolean;
  hasNewOrder: boolean;
}

const TABS = [
  { name: 'timer', label: '웨이팅', Icon: ClockIcon },
  { name: 'food', label: '주문', Icon: FoodIcon },
  { name: 'history', label: '내역', Icon: ReceiptIcon },
  { name: 'settings', label: '관리', Icon: SettingsIcon },
] as const;

export function BottomBar({
  activeTab,
  onTabClick,
  hasNewWaiting,
  hasNewOrder,
}: Props) {
  return (
    <footer className="fixed right-0 bottom-5 left-0 flex w-full justify-center px-6">
      <div className="flex w-full items-center justify-between gap-10 rounded-full bg-white px-10 py-2 shadow-[0_8px_16px_rgba(0,0,0,0.12)]">
        {TABS.map(({ name, label, Icon }) => {
          const isActive = activeTab === name;
          const iconColor = isActive ? '#5F616A' : '#C8C9CD';

          return (
            <button
              key={name}
              onClick={() => onTabClick(name)}
              className="relative flex cursor-pointer flex-col items-center border-none bg-transparent"
              aria-label={label}
            >
              <Icon color={iconColor} width={28} height={28} />
              <span className={`text-[12px] font-medium text-gray-400`}>
                {label}
              </span>

              {/* 웨이팅 알림 표시 */}
              {name === 'timer' && hasNewWaiting && (
                <div className="absolute top-[-2px] right-[-2px] h-2 w-2 rounded-full bg-[#E5484D]" />
              )}

              {/* 주문 알림 표시 */}
              {name === 'food' && hasNewOrder && (
                <div className="absolute top-[-2px] right-[-2px] h-2 w-2 rounded-full bg-[#E5484D]" />
              )}
            </button>
          );
        })}
      </div>
    </footer>
  );
}

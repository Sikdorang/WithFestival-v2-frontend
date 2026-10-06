import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { KEYS } from '@/constants/storage';
import { useStore } from '@/hooks/useStore';
import {
  getPaymentMethodSettings,
  setPaymentMethodSettings,
  type PaymentMethodSettings,
} from '@/shared/lib/payment-methods';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ManagePayment() {
  const navigate = useNavigate();
  const { storeId, getMyStoreInfo } = useStore();
  const settingsId = storeId ?? 'preview';
  const [settings, setSettings] = useState<PaymentMethodSettings>(() =>
    getPaymentMethodSettings('preview'),
  );

  useEffect(() => {
    if (!sessionStorage.getItem(KEYS.ACCESS_TOKEN)) return;
    getMyStoreInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSettings(getPaymentMethodSettings(settingsId));
  }, [settingsId]);

  const update = (next: PaymentMethodSettings) => {
    if (!setPaymentMethodSettings(settingsId, next)) {
      toast.error('결제 수단은 최소 1개 켜 두어야 해요.');
      return;
    }
    setSettings(next);
    toast.success('결제 설정이 변경되었습니다.');
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="결제 설정"
      />

      <main className="flex min-h-screen flex-col gap-3 bg-white px-4 pt-4">
        <PaymentToggle
          title="계좌 송금"
          description="방문객이 등록된 계좌로 송금한 뒤 입금자명을 입력합니다."
          enabled={settings.remitEnabled}
          lockedOn={settings.remitEnabled && !settings.easyPayEnabled}
          onToggle={() =>
            update({ ...settings, remitEnabled: !settings.remitEnabled })
          }
        />
        <PaymentToggle
          title="간편결제"
          description="방문객이 간편결제로 주문 금액을 결제합니다."
          enabled={settings.easyPayEnabled}
          lockedOn={settings.easyPayEnabled && !settings.remitEnabled}
          onToggle={() =>
            update({ ...settings, easyPayEnabled: !settings.easyPayEnabled })
          }
        />
        <p className="px-1 pt-2 text-xs text-gray-400">
          계좌 송금과 간편결제 중 최소 1개는 켜 두어야 합니다.
        </p>
      </main>
    </BaseResponsiveLayout>
  );
}

function PaymentToggle({
  title,
  description,
  enabled,
  lockedOn,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  lockedOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(17,21,63,0.04)]">
      <div className="flex flex-col gap-1 pr-4">
        <span className="text-sm font-bold text-[#11153F]">{title}</span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label={title}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
          enabled ? 'bg-[#FFD43A]' : 'bg-gray-300'
        } ${lockedOn ? 'opacity-80' : ''}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

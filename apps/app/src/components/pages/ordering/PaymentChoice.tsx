import CtaButton from '@/components/common/buttons/CtaButton';
import { useTranslation } from 'react-i18next';

interface PaymentChoiceProps {
  remitEnabled: boolean;
  easyPayEnabled: boolean;
  onEasyPay: () => void;
  onRemit: () => void;
}

export default function PaymentChoice({
  remitEnabled,
  easyPayEnabled,
  onEasyPay,
  onRemit,
}: PaymentChoiceProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col justify-center gap-3 px-4 pb-10">
      {easyPayEnabled && (
        <CtaButton
          text={t('customer.pg.easy')}
          onClick={onEasyPay}
          radius="_2xl"
        />
      )}
      {remitEnabled && (
        <CtaButton
          text={t('customer.pg.remit')}
          onClick={onRemit}
          color="gray"
          radius="_2xl"
        />
      )}
    </div>
  );
}

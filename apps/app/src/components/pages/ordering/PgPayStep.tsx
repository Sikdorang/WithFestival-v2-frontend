import CtaButton from '@/components/common/buttons/CtaButton';
import { useTranslation } from 'react-i18next';

interface PgPayStepProps {
  totalAmount: number;
  onPay: () => void;
  isLoading?: boolean;
}

export default function PgPayStep({
  totalAmount,
  onPay,
  isLoading = false,
}: PgPayStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto pb-28">
      <div className="flex w-full flex-col gap-2 px-4 text-center">
        <p className="text-b-2 text-gray-400">{t('customer.pg.amountLabel')}</p>
        <p className="text-t-1">
          {t('customer.pg.amount', { amount: totalAmount.toLocaleString() })}
        </p>
        <p className="text-b-2 mt-2 text-gray-500">{t('customer.pg.easy')}</p>
      </div>

      <footer className="fixed right-0 bottom-0 left-0 z-10 bg-white p-4">
        <CtaButton
          text={isLoading ? t('customer.pg.paying') : t('customer.pg.pay')}
          onClick={onPay}
          isLoading={isLoading}
          disabled={isLoading}
          radius="_2xl"
        />
      </footer>
    </div>
  );
}

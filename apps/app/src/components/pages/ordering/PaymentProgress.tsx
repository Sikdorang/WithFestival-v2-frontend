import { useTranslation } from 'react-i18next';

interface PaymentProgressProps {
  step: 'remit' | 'depositor' | 'complete';
}

export default function PaymentProgress({ step }: PaymentProgressProps) {
  if (step === 'complete') return null;

  const isDepositorStep = step === 'depositor';
  const { t } = useTranslation();
  return (
    <div className="flex w-full items-start justify-center pt-2">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-primary-300 flex h-[24px] w-[24px] items-center justify-center rounded-full text-[14px] font-semibold text-black">
          1
        </div>
        <span className="text-gray-500-90 text-[13px] font-medium">
          {t('customer.ordering.progress.step1')}
        </span>
      </div>

      <div
        className={`mx-3 mt-[12px] h-[2px] w-[90px] transition-colors duration-300 ${
          isDepositorStep ? 'bg-gray-500-50' : 'bg-gray-500-10'
        }`}
      />

      <div className="flex flex-col items-center gap-2">
        <div
          className={`flex h-[24px] w-[24px] items-center justify-center rounded-full text-[14px] font-semibold transition-colors duration-300 ${
            isDepositorStep
              ? 'bg-primary-300 text-black'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          2
        </div>
        <span
          className={`text-[13px] font-medium transition-colors duration-300 ${
            isDepositorStep ? 'text-gray-500-90' : 'text-gray-500-30'
          }`}
        >
          {t('customer.ordering.progress.step2')}
        </span>
      </div>
    </div>
  );
}

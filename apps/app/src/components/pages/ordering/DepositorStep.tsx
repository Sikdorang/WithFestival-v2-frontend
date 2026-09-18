import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import { useKeyboardScroll } from '@/hooks/common/useKeyboardScroll';
import { useLogs } from '@/hooks/common/useLogs';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface DepositorStepProps {
  onSubmit: () => void;
  depositorName: string;
  setDepositorName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  isLoading?: boolean;
}

export default function DepositorStep({
  onSubmit,
  depositorName,
  setDepositorName,
  phoneNumber,
  setPhoneNumber,
  isLoading = false,
}: DepositorStepProps) {
  const { targetRef, handleFocus, handleBlur } = useKeyboardScroll();
  const { t } = useTranslation();
  const { sendLog } = useLogs();
  const isProceeding = useRef(false);
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isProceeding.current) {
        sendLog('customer.ordering.dropoff.depositor', userData.userId);
      }
    };

    const handlePageHide = () => {
      if (!isProceeding.current) {
        sendLog('customer.ordering.dropoff.depositor', userData.userId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [sendLog, userData.userId]);

  useEffect(() => {
    return () => {
      if (!isProceeding.current) {
        sendLog('customer.ordering.dropoff.depositor', userData.userId);
      }
    };
  }, [sendLog, userData.userId]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawNumbers = e.target.value.replace(/[^0-9]/g, '');
    let formatted = rawNumbers;

    if (rawNumbers.length > 3 && rawNumbers.length <= 7) {
      formatted = `${rawNumbers.slice(0, 3)}-${rawNumbers.slice(3)}`;
    } else if (rawNumbers.length > 7) {
      formatted = `${rawNumbers.slice(0, 3)}-${rawNumbers.slice(3, 7)}-${rawNumbers.slice(7, 11)}`;
    }

    setPhoneNumber(formatted);
  };

  const isSubmitDisabled =
    depositorName.trim() === '' || phoneNumber.length !== 13 || isLoading;

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-15 text-center">
      <div
        ref={targetRef}
        className="flex w-full flex-col items-center gap-4 px-8"
      >
        <div className="text-t-1 mb-2">
          {t('customer.depositor.title1')}
          <br />
          {t('customer.depositor.title2')}
        </div>
        <TextInput
          label={t('customer.depositor.nameLabel')}
          placeholder={t('customer.depositor.namePlaceholder')}
          value={depositorName}
          onChange={(e) => setDepositorName(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          limitHide
        />
        <TextInput
          label={t('customer.depositor.phoneLabel')}
          placeholder={t('customer.depositor.phonePlaceholder')}
          value={phoneNumber}
          onChange={handlePhoneChange}
          limitHide
          type="tel"
          maxLength={13}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center gap-4 bg-white p-4">
        <CtaButton
          text={
            isLoading
              ? t('customer.depositor.loading')
              : t('customer.depositor.submit')
          }
          onClick={() => {
            isProceeding.current = true;
            onSubmit();
          }}
          disabled={isSubmitDisabled}
          isLoading={isLoading}
          radius="_2xl"
        />
      </footer>
    </div>
  );
}

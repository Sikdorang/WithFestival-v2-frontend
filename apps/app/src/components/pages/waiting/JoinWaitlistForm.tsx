import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import Banner from '@/components/pages/waiting/Banner';
import JoinWaitlistFinish from '@/components/pages/waiting/JoinWaitlistFinish';
import {
  createWaitlistSchema,
  formatPhoneInput,
} from '@/features/waiting/lib/waitlist-schema';
import { useStore } from '@/hooks/useStore';
import { useWaiting } from '@/hooks/useWaiting';
import {
  createInFlightLock,
  LEADING_SUBMIT_OPTIONS,
  SUBMIT_GUARD_MS,
} from '@/shared/lib/idempotency';
import { IWaitingListItem } from '@/types/global';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import NoticeView from '../board/NoticeView';

export default function JoinWaitlistForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const submitLockRef = useRef(createInFlightLock());
  const { createWaiting, fetchActiveWaitingCount, activeWaitingCount } =
    useWaiting();
  const { name: boothName, notice, getStorePublicInfo } = useStore();
  const location = useLocation();
  const userData =
    location.state?.userData ||
    JSON.parse(sessionStorage.getItem('userData') || '{}');
  const storeId = userData?.userId || userData?.id;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const waitlistSchema = useMemo(
    () =>
      createWaitlistSchema({
        nameRequired: t('customer.waiting.validation.nameRequired'),
        phoneInvalid: t('customer.waiting.validation.phoneInvalid'),
        partySizeInvalid: t('customer.waiting.validation.partySizeInvalid'),
      }),
    [t],
  );

  useEffect(() => {
    if (storeId) {
      getStorePublicInfo(Number(storeId));
      fetchActiveWaitingCount(Number(storeId));
    }
  }, [storeId]);

  const [isFinishJoinWaitlist, setIsFinishJoinWaitlist] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '010-',
    partySize: '',
  });
  const [waitingResult, setWaitingResult] = useState<IWaitingListItem>();

  useEffect(() => {
    const validationData = {
      ...formData,
      partySize: Number(formData.partySize),
    };

    const result = waitlistSchema.safeParse(validationData);
    setIsFormValid(result.success);
  }, [formData]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      phone: formatPhoneInput(e.target.value),
    }));
  };

  const handleSubmit = useDebouncedCallback(
    async () => {
      if (!storeId || !submitLockRef.current.tryAcquire()) return;

      setIsLoading(true);
      try {
        const result = await createWaiting(Number(storeId), {
          name: formData.name,
          phoneNumber: formData.phone,
          partySize: Number(formData.partySize),
        });

        if (result) {
          setWaitingResult(result);
          setIsFinishJoinWaitlist(true);
        }
      } finally {
        setIsLoading(false);
        submitLockRef.current.release();
      }
    },
    SUBMIT_GUARD_MS,
    LEADING_SUBMIT_OPTIONS,
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (isFinishJoinWaitlist) {
    return (
      <JoinWaitlistFinish
        boothName={boothName}
        waitingListNumber={activeWaitingCount}
        waitingNumber={waitingResult?.id ?? 0}
        name={formData.name}
        phone={formData.phone}
        partySize={Number(formData.partySize)}
        notice={notice}
      />
    );
  }

  return (
    <>
      <main className="flex flex-col items-center justify-center gap-6 p-4">
        <Banner
          boothName={boothName}
          waitingListLength={activeWaitingCount}
          isFinishJoinWaitlist={false}
        />

        <NoticeView notice={notice} />

        <TextInput
          label={t('customer.waiting.form.nameLabel')}
          placeholder={t('customer.waiting.form.namePlaceholder')}
          limitHide
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextInput
          label={t('customer.waiting.form.phoneLabel')}
          placeholder={t('customer.waiting.form.phonePlaceholder')}
          limitHide
          value={formData.phone}
          onChange={handlePhoneChange}
        />
        <TextInput
          label={t('customer.waiting.form.partySizeLabel')}
          placeholder={t('customer.waiting.form.partySizePlaceholder')}
          type="number"
          limitHide
          value={formData.partySize}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, partySize: e.target.value }))
          }
        />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 p-4">
        <CtaButton
          text={t('customer.waiting.form.submitButton')}
          radius="_2xl"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          isLoading={isLoading}
        />
      </footer>
    </>
  );
}

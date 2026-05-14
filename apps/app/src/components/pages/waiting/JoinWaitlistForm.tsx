import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import Banner from '@/components/pages/waiting/Banner';
import JoinWaitlistFinish from '@/components/pages/waiting/JoinWaitlistFinish';
import { useStore } from '@/hooks/useStore';
import { useWaiting } from '@/hooks/useWaiting';
import { IWaitingListItem } from '@/types/global';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import NoticeView from '../board/NoticeView';

const waitlistSchema = z.object({
  name: z.string().min(1, '예약자 이름은 필수입니다.'),
  phone: z
    .string()
    .regex(/^010-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다.'),
  partySize: z.number().gt(0, '입장 인원은 1명 이상이어야 합니다.'),
});

export default function JoinWaitlistForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { createWaiting, fetchActiveWaitingCount, activeWaitingCount } =
    useWaiting();
  const { name: boothName, notice, getStorePublicInfo } = useStore();
  const location = useLocation();
  const userData =
    location.state?.userData ||
    JSON.parse(sessionStorage.getItem('userData') || '{}');
  const storeId = userData?.userId || userData?.id;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    const cleaned = e.target.value.replace(/\D/g, '');
    const truncated = cleaned.slice(0, 11);
    let formatted = truncated;

    if (truncated.length > 7) {
      formatted = `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
    } else if (truncated.length > 3) {
      formatted = `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
    }

    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async () => {
    if (!storeId || isLoading) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
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
        timerRef.current = null;
      }
    }, 300);
  };

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
          label="예약자 이름"
          placeholder="예약하시는 분 이름을 입력해주세요."
          limitHide
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextInput
          label="전화번호"
          placeholder="예약자 연락처를 입력해주세요."
          limitHide
          value={formData.phone}
          onChange={handlePhoneChange}
        />
        <TextInput
          label="입장 인원"
          placeholder="총 인원을 입력해주세요."
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
          text="웨이팅 등록하기"
          radius="_2xl"
          onClick={handleSubmit}
          disabled={!isFormValid}
        />
      </footer>
    </>
  );
}

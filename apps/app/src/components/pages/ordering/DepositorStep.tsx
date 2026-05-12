import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';

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
      <div className="flex w-full flex-col items-center gap-4 px-8">
        <div className="text-t-1 mb-2">
          입금하신 분의
          <br />
          이름과 전화번호를 입력해주세요
        </div>
        <TextInput
          label="입금자명"
          placeholder="입금자명을 입력해주세요."
          value={depositorName}
          onChange={(e) => setDepositorName(e.target.value)}
          limitHide
        />
        <TextInput
          label="전화번호"
          placeholder="010-0000-0000"
          value={phoneNumber}
          onChange={handlePhoneChange}
          limitHide
          type="tel"
          maxLength={13}
        />
      </div>

      <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center gap-4 bg-white p-4">
        <CtaButton
          text={isLoading ? '주문 처리 중...' : '입력 완료'}
          onClick={() => {
            onSubmit();
          }}
          disabled={isSubmitDisabled}
          radius="_2xl"
        />
      </footer>
    </div>
  );
}

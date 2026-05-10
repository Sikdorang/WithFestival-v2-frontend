import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';

interface DepositorStepProps {
  onSubmit: () => void;
  depositorName: string;
  setDepositorName: (name: string) => void;
  isLoading?: boolean;
}

export default function DepositorStep({
  onSubmit,
  depositorName,
  setDepositorName,
  isLoading = false,
}: DepositorStepProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-15 text-center">
      <div className="flex w-full flex-col items-center gap-4 px-8">
        <div className="text-t-1 mb-2">
          입금하신 분의
          <br />
          이름을 입력해주세요!
        </div>
        <TextInput
          placeholder="입금자명을 입력해주세요."
          value={depositorName}
          onChange={(e) => setDepositorName(e.target.value)}
          limitHide
        />
      </div>

      <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center gap-4 bg-white p-4">
        <CtaButton
          text={isLoading ? '주문 처리 중...' : '입력 완료'}
          onClick={() => {
            onSubmit();
          }}
          disabled={depositorName.trim() === '' || isLoading}
          radius="_2xl"
        />
      </footer>
    </div>
  );
}

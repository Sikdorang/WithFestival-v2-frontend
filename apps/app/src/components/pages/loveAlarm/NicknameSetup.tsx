import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import { useState } from 'react';

interface NicknameSetupProps {
  onSubmit: (name: string) => void;
  isLoading?: boolean;
}

export default function NicknameSetup({
  onSubmit,
  isLoading = false,
}: NicknameSetupProps) {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 pb-20">
      <h1 className="mb-2 text-xl font-bold text-gray-900">반가워요! 🌸</h1>
      <p className="mb-10 text-center text-gray-500">
        오늘 축제에서 사용할 닉네임을 만들고
        <br />
        마음에 드는 테이블에 슬쩍 시그널을 보내볼까요?
      </p>

      <div className="mb-4 w-full">
        <TextInput
          placeholder={'닉네임 입력'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          limitHide
          disabled={isLoading}
        />
      </div>

      <CtaButton
        onClick={() => input && onSubmit(input)}
        disabled={!input || isLoading}
        text={isLoading ? '설정 중...' : '시작하기'}
        radius="_2xl"
      />
    </div>
  );
}

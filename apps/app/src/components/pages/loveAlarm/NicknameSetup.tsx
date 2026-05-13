import CherryBlossom from '@/assets/icons/ic_clock.svg?react';
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
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
        <CherryBlossom className="h-12 w-12" />
      </div>

      <h1 className="mb-2 text-xl font-bold text-gray-900">
        '좋아하면 울리는'에 오신 것을 환영합니다!
      </h1>
      <p className="mb-10 text-center text-gray-500">
        닉네임을 설정하고
        <br />
        다른 테이블과 설레는 소통을 시작해보세요
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

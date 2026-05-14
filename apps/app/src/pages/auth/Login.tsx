import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import { Banner } from '@/components/pages/login/Banner';
import { ROUTES } from '@/constants/routes';
import { useKeyboardScroll } from '@/hooks/common/useKeyboardScroll';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuthStore();
  const [code, setCode] = useState('');

  const { targetRef, handleFocus, handleBlur } = useKeyboardScroll();

  useEffect(() => {
    if (isLoggedIn) navigate(ROUTES.MANAGE_WAITING);
  }, [isLoggedIn, navigate]);

  return (
    <BaseResponsiveLayout>
      <div className="flex h-screen w-full flex-col items-center justify-center overflow-y-auto pb-10">
        <div className="flex h-full w-full max-w-sm min-w-sm flex-col items-center justify-center gap-8 px-6 py-40">
          <Banner />

          <div ref={targetRef} className="w-full">
            <TextInput
              label="인증 번호"
              placeholder="인증 번호를 입력해주세요"
              maxLength={20}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              limitHide
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <CtaButton text="로그인" radius="_2xl" onClick={() => login(code)} />
        </div>
      </div>
    </BaseResponsiveLayout>
  );
}

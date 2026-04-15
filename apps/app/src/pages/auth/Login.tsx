import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import { Banner } from '@/components/pages/login/Banner';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuthStore();

  const [code, setCode] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigate(ROUTES.MANAGE_WAITING);
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    await login(code);
  };

  return (
    <BaseResponsiveLayout>
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="flex h-full w-full max-w-sm min-w-sm flex-col items-center justify-center gap-8 px-6 py-40">
          <Banner />

          <TextInput
            label="인증 번호"
            placeholder="인증 번호를 입력해주세요"
            maxLength={20}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            limitHide
          />

          <CtaButton text="로그인" radius="_2xl" onClick={handleLogin} />
        </div>
      </div>
    </BaseResponsiveLayout>
  );
}

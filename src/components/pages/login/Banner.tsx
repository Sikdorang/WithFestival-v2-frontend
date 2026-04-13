import LogoImage from '@/assets/images/img_logo.svg?react';

export function Banner() {
  return (
    <div className="mb-14 flex items-center justify-center gap-3">
      <LogoImage />
      <div className="text-b-2 text-gray-400">관리자 로그인</div>
    </div>
  );
}

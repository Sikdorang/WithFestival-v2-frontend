import LogoImage from '@/assets/images/img_logo.svg?react';

export default function TopBar() {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-col gap-4 bg-white px-6 pt-4">
      <div className="flex w-full items-center">
        <LogoImage name="logo" />
      </div>
    </div>
  );
}

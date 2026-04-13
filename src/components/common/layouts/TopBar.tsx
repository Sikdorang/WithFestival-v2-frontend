import LogoImage from '@/assets/images/img_logo.svg?react';

export default function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex w-full justify-center">
      <div className="flex w-fit w-full items-center gap-2 rounded-b-sm bg-white px-4 py-3">
        <LogoImage name="logo" />
      </div>
    </header>
  );
}

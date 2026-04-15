import LogoImage from '@/assets/images/img_logo.svg?react';

interface Props {
  title: string;
  value: number;
}

export default function WaitingTopBar({ title, value }: Props) {
  return (
    <div className="sticky top-0 z-50 flex w-full flex-col gap-4 bg-white px-6 pt-4 pb-2 shadow-sm">
      <div className="flex w-full items-center">
        <LogoImage name="logo" />
      </div>

      <h1 className="text-st-2 flex gap-2 text-black">
        <div>{title}</div>
        <span className="text-primary-300">{value}</span>
      </h1>
    </div>
  );
}

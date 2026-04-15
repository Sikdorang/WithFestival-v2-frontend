import { type PropsWithChildren } from 'react';

export default function BaseResponsiveLayout({ children }: PropsWithChildren) {
  return <div className="min-w-xs mx-auto min-h-screen w-full scrollbar-hide::-webkit-scrollbar scrollbar-hide">{children}</div>;
}

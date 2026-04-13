import { ReactNode } from 'react';

interface Props {
  title?: string;
  center?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  secondRight?: ReactNode;
  onCenterPress?: () => void;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function Navigator({
  title = '',
  center,
  left,
  right,
  secondRight,
  onCenterPress,
  onLeftPress,
  onRightPress,
}: Props) {
  return (
    <div className="grid w-full grid-cols-3 items-center px-4 py-3">
      <div onClick={onLeftPress} className="justify-self-start p-1">
        {left || <div></div>}
      </div>

      <div onClick={onCenterPress} className="text-center">
        {center || <div className="text-lg font-extrabold">{title}</div>}
      </div>

      <div onClick={onRightPress} className="justify-self-end p-1">
        <div className="flex items-center gap-6">
          {right || <div></div>}
          {secondRight && (secondRight || <div></div>)}
        </div>
      </div>
    </div>
  );
}

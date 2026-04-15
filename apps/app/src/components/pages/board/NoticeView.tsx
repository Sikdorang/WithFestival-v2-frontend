import NoticeIcon from '@/assets/icons/ic_megaphone.svg?react';
import MoreIcon from '@/assets/icons/ic_arrow_down.svg?react';
import { useState } from 'react';

interface Props {
  notice: string;
}

export default function NoticeView({ notice }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!notice) {
    return null;
  }

  const noticeLines = notice.split('\n');

  return (
    <div className="mt-4 w-full rounded-xl bg-gray-50 p-4">
      <div
        className="flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <NoticeIcon />
          <h3 className="text-st-2 text-black">공지사항</h3>
        </div>
        <MoreIcon
          className={`cursor-pointer text-gray-600 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div className="text-b-2 mt-3 text-gray-400">
          {noticeLines.map((line, index) => (
            <div key={index} className="flex items-start">
              <span className="mr-2">・</span>
              <span className="flex-1">{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

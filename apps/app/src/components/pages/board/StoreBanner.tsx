import CtaButton from '@/components/common/buttons/CtaButton';
import LanguageSelector from '@/components/common/buttons/LanguageSelector';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeView from './NoticeView';
import RequestModal from './RequestModal';

interface Props {
  boothName: string;
  isPreview: boolean;
  tableId?: string | number;
  notice: string;
}

export default function StoreBanner({
  boothName,
  isPreview,
  tableId,
  notice,
}: Props) {
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType] = useState<'message' | 'call'>('message');

  const renderStatusText = () => {
    if (isPreview) return '메뉴판 미리보기';
    if (tableId === 'w') return '웨이팅 고객';
    if (tableId === 0 || tableId === '0') return '포장 주문';
    return `테이블 번호 ${tableId}`;
  };

  return (
    <div>
      <RequestModal
        open={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        type={requestType}
      />
      <div className="flex items-center justify-between">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full justify-between">
            <div>
              <div className="text-b-2 text-gray-300">{boothName}</div>
              <div className="text-st-2 text-black">{renderStatusText()}</div>
            </div>
            <div className="mr-2 flex items-center gap-4">
              <CtaButton
                width="fit"
                color="red"
                text="좋아하면 울리는"
                size="small"
                onClick={() => {
                  navigate(ROUTES.LOVE_ALARM);
                }}
              />
              <LanguageSelector />
            </div>
          </div>
          {isPreview && (
            <div className="text-c-1 flex text-gray-200">
              웨이팅을 기다리며 메뉴를 미리 볼 수 있어요.
            </div>
          )}
        </div>
      </div>

      <NoticeView notice={notice} />
    </div>
  );
}

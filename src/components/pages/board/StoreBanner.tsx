import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../../common/buttons/CtaButton';
import NoticeView from './NoticeView';
import RequestModal from './RequestModal';

interface Props {
  boothName: string;
  isPreview: boolean;
  tableNumber?: number;
  notice: string;
}

export default function StoreBanner({
  boothName,
  isPreview,
  tableNumber,
  notice,
}: Props) {
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<'message' | 'call'>('message');

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
              <div className="text-st-2 text-black">
                {isPreview ? '메뉴판 미리보기' : `테이블 번호 ${tableNumber}`}
              </div>
            </div>
            <CtaButton
              width="fit"
              color="red"
              text="좋아하면 울리는"
              size="small"
              onClick={() => navigate('/alarm')}
            />
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

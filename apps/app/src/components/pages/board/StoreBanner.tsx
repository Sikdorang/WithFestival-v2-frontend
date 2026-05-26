import LanguageSelector from '@/components/common/buttons/LanguageSelector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import CtaButton from '../../common/buttons/CtaButton';
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
  const { t } = useTranslation();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType] = useState<'message' | 'call'>('message');

  const renderStatusText = () => {
    if (isPreview) return t('customer.storeBanner.status.preview');
    if (tableId === 'w') return t('customer.storeBanner.status.waiting');
    if (tableId === 9999 || tableId === '9999')
      return t('customer.storeBanner.status.takeout');

    return t('customer.storeBanner.status.table', { tableId });
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
                text="번호팅"
                size="small"
                onClick={() => {
                  navigate(ROUTES.BLIND_PHONENUMBER_DATE);
                }}
              />
              <LanguageSelector />
            </div>
          </div>
          {isPreview && (
            <div className="text-c-1 flex text-gray-200">
              {t('customer.storeBanner.previewMessage')}
            </div>
          )}
        </div>
      </div>

      <NoticeView notice={notice} />
    </div>
  );
}

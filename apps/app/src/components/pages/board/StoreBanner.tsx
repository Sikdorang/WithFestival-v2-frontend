import LanguageSelector from '@/components/common/buttons/LanguageSelector';
import { useLogs } from '@/hooks/common/useLogs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import CtaButton from '../../common/buttons/CtaButton';
import NoticeView from './NoticeView';
import RequestModal from './RequestModal';

interface Props {
  storeId: number;
  boothName: string;
  isPreview: boolean;
  tableId?: string | number;
  notice: string;
  noticeEn?: string;
  noticeZh?: string;
  noticeJa?: string;
}

export default function StoreBanner({
  storeId,
  boothName,
  isPreview,
  tableId,
  notice,
  noticeEn,
  noticeZh,
  noticeJa,
}: Props) {
  const { t, i18n } = useTranslation();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType] = useState<'message' | 'call'>('message');
  const naviage = useNavigate();

  const [currentLang, setCurrentLang] = useState(i18n.language);
  const { sendLog } = useLogs();

  const prevLangRef = useRef(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);

    if (prevLangRef.current !== i18n.language) {
      sendLog(`customer.board.change.language.${i18n.language}`, storeId);
      prevLangRef.current = i18n.language;
    }
  }, [i18n.language, sendLog, storeId]);

  const renderStatusText = () => {
    if (isPreview) return t('customer.storeBanner.status.preview');
    if (tableId === 'w') return t('customer.storeBanner.status.waiting');
    if (tableId === 9999 || tableId === '9999')
      return t('customer.storeBanner.status.takeout');

    return t('customer.storeBanner.status.table', { tableId });
  };

  const currentNotice = useMemo(() => {
    const lang = currentLang.toLowerCase();

    if (lang.startsWith('en') && noticeEn) return noticeEn;
    if (lang.startsWith('zh') && noticeZh) return noticeZh;
    if (lang.startsWith('ja') && noticeJa) return noticeJa;

    return notice;
  }, [currentLang, notice, noticeEn, noticeZh, noticeJa]);

  const handleBlindDateClick = () => {
    sendLog('customer.board.click.blindDate', storeId);
    naviage(ROUTES.BLIND_PHONENUMBER_DATE);
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
              <div className="relative">
                <CtaButton
                  text={t('customer.storeBanner.blindDate')}
                  color="lightRed"
                  width="fit"
                  size="small"
                  onClick={handleBlindDateClick}
                />
              </div>

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

      <NoticeView notice={currentNotice} />
    </div>
  );
}

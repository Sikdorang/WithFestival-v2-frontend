import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import Banner from '@/components/pages/waiting/Banner';
import { ROUTES } from '@/constants/routes';
import { KEYS } from '@/constants/storage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import NoticeView from '../board/NoticeView';

interface Props {
  waitingNumber: number;
  boothName: string;
  name: string;
  phone: string;
  partySize: number;
  waitingListNumber: number;
  notice: string;
}

export default function JoinWaitlistFinish({
  waitingNumber,
  boothName,
  name,
  phone,
  partySize,
  waitingListNumber,
  notice,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePreview = () => {
    localStorage.setItem(KEYS.IS_PREVIEW, '1');
    navigate(ROUTES.MENU_BOARD);
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center gap-6 p-4">
        <Banner
          boothName={boothName}
          waitingListLength={waitingListNumber + 1}
          isFinishJoinWaitlist={true}
        />
        <NoticeView notice={notice} />
        <TextInput
          label={t('customer.waiting.finish.waitingNumberLabel')}
          placeholder={t('customer.waiting.finish.waitingNumberPlaceholder')}
          limitHide
          value={waitingNumber}
          disabled
        />
        <TextInput
          label={t('customer.waiting.form.nameLabel')}
          placeholder={t('customer.waiting.form.namePlaceholder')}
          limitHide
          value={name}
          disabled
        />
        <TextInput
          label={t('customer.waiting.form.phoneLabel')}
          placeholder={t('customer.waiting.form.phonePlaceholder')}
          limitHide
          value={phone}
          disabled
        />
        <TextInput
          label={t('customer.waiting.form.partySizeLabel')}
          placeholder={t('customer.waiting.form.partySizePlaceholder')}
          type="number"
          limitHide
          value={partySize}
          disabled
        />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 p-4">
        <CtaButton
          text={t('customer.waiting.finish.previewMenuButton')}
          radius="_2xl"
          onClick={handlePreview}
        />
      </footer>
    </>
  );
}

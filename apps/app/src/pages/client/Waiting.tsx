import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import JoinWaitlistForm from '@/components/pages/waiting/JoinWaitlistForm';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Waiting() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title={t('customer.waiting.title')}
      />
      <JoinWaitlistForm />
      <BottomSpace />
    </BaseResponsiveLayout>
  );
}

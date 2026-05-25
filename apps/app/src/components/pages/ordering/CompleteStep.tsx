import CheckAnimation from '@/assets/lotties/lottie_check.json';
import CtaButton from '@/components/common/buttons/CtaButton';
import { ROUTES } from '@/constants/routes';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function CompleteStep() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-35 text-center">
      <div className="flex w-full flex-col items-center px-8">
        <Lottie
          animationData={CheckAnimation}
          loop={false}
          style={{ width: 64, height: 64 }}
        />
        <div className="text-t-1 mb-1">{t('customer.complete.title')}</div>
        <div className="text-b-1">
          {t('customer.complete.desc1')}
          <br />
          {t('customer.complete.desc2')}
        </div>
      </div>
      <footer className="fixed right-0 bottom-0 left-0 z-10 flex flex-col items-center gap-4 bg-white p-4">
        <CtaButton
          text={t('customer.complete.goHome')}
          color="yellow"
          onClick={() => navigate(ROUTES.MENU_BOARD)}
          radius="_2xl"
        />
      </footer>
    </div>
  );
}

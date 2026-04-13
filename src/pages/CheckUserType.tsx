import LoadingView from '@/components/common/exceptions/LoadingView';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import { ROUTES } from '@/constants/routes';
import { decryptJson } from '@/utils/crypto';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KEYS } from '../constants/storage';

export default function CheckUserType() {
  const navigate = useNavigate();
  const { encryptedParam } = useParams();

  useEffect(() => {
    const processPath = () => {
      if (!encryptedParam) {
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      try {
        const decodedParam = decodeURIComponent(encryptedParam);
        const decryptedData = decryptJson(decodedParam);

        if (!decryptedData || !decryptedData.userId) {
          navigate('/not-found', { replace: true });
          return;
        }

        sessionStorage.setItem('userData', JSON.stringify(decryptedData));

        if ('tableId' in decryptedData) {
          localStorage.setItem(KEYS.IS_PREVIEW, '0');
          navigate(ROUTES.MENU_BOARD, {
            replace: true,
            state: { userData: decryptedData },
          });
        } else {
          navigate(ROUTES.WAITING, {
            replace: true,
            state: { userData: decryptedData },
          });
        }
      } catch (error) {
        navigate('/not-found', { replace: true });
      }
    };

    const timer = setTimeout(processPath, 500);
    return () => clearTimeout(timer);
  }, [navigate, encryptedParam]);

  return (
    <BaseResponsiveLayout>
      <div className="flex h-screen items-center justify-center">
        <LoadingView />
      </div>
    </BaseResponsiveLayout>
  );
}

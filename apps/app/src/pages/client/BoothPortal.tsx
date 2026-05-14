import StoreIcon from '@/assets/icons/ic_store.svg?react';
import LanguageSelector from '@/components/common/buttons/LanguageSelector';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import TopBar from '@/components/common/layouts/TopBar';
import { getBoothLinks } from '@/constants/BoothPortal';
import { useLogs } from '@/hooks/common/useLogs';
import { useStore } from '@/hooks/useStore';
import { encryptJson } from '@/utils/crypto';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BoothPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { sendBoothPortalClickLog } = useLogs();

  const userData =
    location.state?.userData ||
    JSON.parse(sessionStorage.getItem('userData') || '{}');

  const storeId = userData?.userId;

  const {
    name,
    event,
    waitingsEnabled,
    reservationEnabled,
    getStorePublicInfo,
  } = useStore();

  useEffect(() => {
    if (storeId) {
      getStorePublicInfo(Number(storeId));
    }
  }, [storeId]);

  const visibleLinks = getBoothLinks({
    waitingsEnabled,
    reservationEnabled,
    t,
  }).filter((link) => link.enabled);

  const handleLinkClick = (link: any) => {
    sendBoothPortalClickLog(link.id);

    if (link.id === 'takeout') {
      const data = { userId: String(storeId), tableId: 0 };
      const encrypted = encryptJson(data);
      const encoded = encrypted ? encodeURIComponent(encrypted) : '';

      navigate(`/check/${encoded}`);
      return;
    }

    if (link.path.startsWith('http')) {
      window.open(link.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.path);
    }
  };

  return (
    <BaseResponsiveLayout>
      <div className="relative w-full">
        <TopBar />
        <div className="absolute top-1/2 right-2 z-50 -translate-y-1/2">
          <LanguageSelector />
        </div>
      </div>

      <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-12">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF9E6]">
            <StoreIcon width={36} height={36} className="text-[#FFBF0B]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-gray-500-90 text-xl font-semibold">
              {name || t('customer.portal.noName')}
            </h1>
            <p className="text-gray-500-60 font-regualar text-[15px]">
              {event || t('customer.portal.noEvent')}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {visibleLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="bg-gray-500-3 flex w-full items-center gap-4 rounded-[1.25rem] p-5 text-left transition-all active:scale-[0.98] active:bg-gray-100"
            >
              <div
                className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${link.iconBg} ${link.iconColor}`}
              >
                {link.icon}
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500-90 text-[17px] font-bold">
                  {link.title}
                </span>
                <span className="text-gray-500-70 text-[14px] font-medium">
                  {link.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BaseResponsiveLayout>
  );
}

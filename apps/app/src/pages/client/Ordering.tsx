import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import Navigator from '@/components/common/layouts/Navigator';
import CompleteStep from '@/components/pages/ordering/CompleteStep';
import DepositorStep from '@/components/pages/ordering/DepositorStep';
import OrderingMenuList from '@/components/pages/ordering/OrderingMenuList';
import PaymentChoice from '@/components/pages/ordering/PaymentChoice';
import PaymentProgress from '@/components/pages/ordering/PaymentProgress';
import PgPayStep from '@/components/pages/ordering/PgPayStep';
import RemitStep from '@/components/pages/ordering/RemitStep';
import { ROUTES } from '@/constants/routes';
import { useCustomerMenuQuery } from '@/hooks/useMenuQuery';
import { useOrder } from '@/hooks/useOrder';
import { useOrderStore } from '@/stores/orderStore';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  LEADING_SUBMIT_OPTIONS,
  SUBMIT_GUARD_MS,
} from '@/shared/lib/idempotency';
import {
  getPaymentMethodSettings,
  type PaymentMethodSettings,
} from '@/shared/lib/payment-methods';
import { useDebouncedCallback } from 'use-debounce';

type PayStep = 'choose' | 'pg' | 'remit' | 'depositor' | 'complete';

function openingStep(settings: PaymentMethodSettings): PayStep {
  if (settings.easyPayEnabled && settings.remitEnabled) return 'choose';
  if (settings.easyPayEnabled) return 'pg';
  return 'remit';
}

const PREVIEW_ORDER_ITEMS = [
  {
    id: 1,
    name: '매콤달콤 떡볶이',
    price: 4500,
    quantity: 1,
    image: '',
  },
  {
    id: 2,
    name: '모짜렐라 치즈피자',
    price: 7000,
    quantity: 1,
    image: '',
  },
];

function readStoredUser() {
  try {
    const stored = sessionStorage.getItem('userData');
    return stored && stored !== 'undefined' ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function isPgPreviewRequest() {
  if (new URLSearchParams(window.location.search).get('pay') !== 'pg') {
    return false;
  }
  const stored = readStoredUser();
  return stored?.userId === undefined;
}

export default function Ordering() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isPgPreview = isPgPreviewRequest();
  if (isPgPreview && useOrderStore.getState().orderItems.length === 0) {
    PREVIEW_ORDER_ITEMS.forEach((item) =>
      useOrderStore.getState().addItem(item),
    );
  }

  const userData = useMemo(() => {
    if (location.state?.userData) return location.state.userData;
    const stored = readStoredUser();
    if (stored?.userId !== undefined) return stored;
    if (isPgPreview) return { userId: 'preview', tableId: '3' };
    return {};
  }, [location.state?.userData, isPgPreview]);
  const navigate = useNavigate();
  const { orderItems } = useOrderStore();
  const { createOrder, isLoading: isCreatingOrder } = useOrder();

  const storeId = userData?.userId || userData?.id;
  const { data: menus } = useCustomerMenuQuery(
    isPgPreview ? undefined : storeId,
    !isPgPreview,
  );

  const localizedOrderItems = useMemo(() => {
    return orderItems.map((item) => {
      const rawMenu = menus?.find((m: any) => m.id === item.id);
      if (!rawMenu) return item;

      let localizedName = rawMenu.name;
      const lang = i18n.language;

      if (lang === 'en') localizedName = rawMenu.nameEn || rawMenu.name;
      else if (lang === 'zh') localizedName = rawMenu.nameZh || rawMenu.name;
      else if (lang === 'ja') localizedName = rawMenu.nameJa || rawMenu.name;

      return {
        ...item,
        name: localizedName,
      };
    });
  }, [orderItems, menus, i18n.language]);

  const paymentStoreId = isPgPreview ? 'preview' : userData.userId;
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodSettings>(
    () => getPaymentMethodSettings(paymentStoreId ?? 'preview'),
  );

  useEffect(() => {
    if (paymentStoreId === undefined) return;
    setPaymentMethods(getPaymentMethodSettings(paymentStoreId));
  }, [paymentStoreId]);
  const [isModalOpen, setIsModalOpen] = useState(isPgPreview);
  const [modalStep, setModalStep] = useState<PayStep>(() =>
    openingStep(getPaymentMethodSettings('preview')),
  );
  const [depositorName, setDepositorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const totalAmount = localizedOrderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleFinalSubmit = useDebouncedCallback(
    async () => {
      if (isCreatingOrder) return;
      const isSuccess = await createOrder(depositorName, phoneNumber);

      if (isSuccess) {
        setModalStep('complete');
        setDepositorName('');
        setPhoneNumber('');
      }
    },
    SUBMIT_GUARD_MS,
    LEADING_SUBMIT_OPTIONS,
  );

  const handlePgPay = async () => {
    if (userData.userId === 'preview') {
      setModalStep('complete');
      return;
    }

    const isSuccess = await createOrder('간편결제', '');
    if (isSuccess) setModalStep('complete');
  };

  if (userData.userId === undefined) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return (
    <Dialog.Root
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (open) {
          const next = getPaymentMethodSettings(paymentStoreId ?? 'preview');
          setPaymentMethods(next);
          setModalStep(openingStep(next));
        }
      }}
    >
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(ROUTES.MENU_BOARD)}
        center={<div className="text-st-1">{t('customer.ordering.title')}</div>}
      />

      <div className="relative min-h-screen bg-white px-4">
        <main className="pb-24">
          <h2 className="text-st-2 mt-6 mb-2">
            {t('customer.ordering.orderHistory')}
          </h2>
          <OrderingMenuList items={localizedOrderItems} />
          <BottomSpace />
        </main>
      </div>

      {orderItems.length > 0 && (
        <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center gap-4 bg-white p-4">
          <span className="text-st-2 text-black">
            {t('customer.ordering.totalAmount', {
              amount: totalAmount.toLocaleString(),
            })}
          </span>

          <Dialog.Trigger asChild>
            <button className="bg-primary-300 text-b-1 flex-1 rounded-2xl py-4 text-center text-black">
              {t('customer.ordering.payButton')}
            </button>
          </Dialog.Trigger>
        </footer>
      )}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-white">
          <Dialog.Title className="sr-only">
            {t('customer.ordering.srRemitOrDeposit')}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('customer.ordering.srRemitOrDeposit')}
          </Dialog.Description>
          {modalStep === 'complete' ? (
            <Navigator
              center={
                <div className="text-st-1">
                  {t('customer.ordering.completeTitle')}
                </div>
              }
            />
          ) : (
            <Navigator
              left={<GoBackIcon />}
              onLeftPress={() => {
                if (modalStep === 'depositor') setModalStep('remit');
                else if (
                  (modalStep === 'remit' || modalStep === 'pg') &&
                  paymentMethods.remitEnabled &&
                  paymentMethods.easyPayEnabled
                ) {
                  setModalStep('choose');
                } else setIsModalOpen(false);
              }}
              center={
                <div className="text-st-1">
                  {modalStep === 'pg' || modalStep === 'choose'
                    ? t('customer.ordering.pgTitle')
                    : modalStep === 'remit'
                      ? t('customer.ordering.remitTitle')
                      : t('customer.ordering.depositTitle')}
                </div>
              }
            />
          )}
          {(modalStep === 'remit' || modalStep === 'depositor') && (
            <PaymentProgress step={modalStep} />
          )}
          {modalStep === 'choose' ? (
            <PaymentChoice
              remitEnabled={paymentMethods.remitEnabled}
              easyPayEnabled={paymentMethods.easyPayEnabled}
              onEasyPay={() => setModalStep('pg')}
              onRemit={() => setModalStep('remit')}
            />
          ) : modalStep === 'pg' ? (
            <PgPayStep
              totalAmount={totalAmount}
              onPay={handlePgPay}
              isLoading={isCreatingOrder}
            />
          ) : modalStep === 'remit' ? (
            <RemitStep
              totalAmount={totalAmount}
              onNext={() => setModalStep('depositor')}
            />
          ) : modalStep === 'depositor' ? (
            <DepositorStep
              onSubmit={handleFinalSubmit}
              depositorName={depositorName}
              setDepositorName={setDepositorName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              isLoading={isCreatingOrder}
            />
          ) : (
            <CompleteStep />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

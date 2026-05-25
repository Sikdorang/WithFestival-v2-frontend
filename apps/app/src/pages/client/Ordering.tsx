import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import Navigator from '@/components/common/layouts/Navigator';
import CompleteStep from '@/components/pages/ordering/CompleteStep';
import DepositorStep from '@/components/pages/ordering/DepositorStep';
import OrderingMenuList from '@/components/pages/ordering/OrderingMenuList';
import PaymentProgress from '@/components/pages/ordering/PaymentProgress';
import RemitStep from '@/components/pages/ordering/RemitStep';
import { ROUTES } from '@/constants/routes';
import { useOrder } from '@/hooks/useOrder';
import { useOrderStore } from '@/stores/orderStore';
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

export default function Ordering() {
  const location = useLocation();
  const { t } = useTranslation();

  const userData = useMemo(() => {
    if (location.state?.userData) return location.state.userData;
    try {
      const stored = sessionStorage.getItem('userData');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, [location.state?.userData]);
  const navigate = useNavigate();
  const { orderItems } = useOrderStore();
  const { createOrder } = useOrder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<
    'remit' | 'depositor' | 'complete'
  >('remit');
  const [depositorName, setDepositorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleFinalSubmit = useDebouncedCallback(async () => {
    const isSuccess = await createOrder(depositorName, phoneNumber);

    if (isSuccess) {
      setModalStep('complete');
      setDepositorName('');
      setPhoneNumber('');
    }
  }, 300);

  if (userData.userId === undefined) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
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
          <OrderingMenuList items={orderItems} />
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
              {t('customer.ordering.remitButton')}
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
                else setIsModalOpen(false);
              }}
              center={
                <div className="text-st-1">
                  {modalStep === 'remit'
                    ? t('customer.ordering.remitTitle')
                    : t('customer.ordering.depositTitle')}
                </div>
              }
            />
          )}
          <PaymentProgress step={modalStep} />
          {modalStep === 'remit' ? (
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
            />
          ) : (
            <CompleteStep />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

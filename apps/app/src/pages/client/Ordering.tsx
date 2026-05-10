import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import Navigator from '@/components/common/layouts/Navigator';
import CompleteStep from '@/components/pages/ordering/CompleteStep';
import DepositorStep from '@/components/pages/ordering/DepositorStep';
import OrderingMenuList from '@/components/pages/ordering/OrderingMenuList';
import RemitStep from '@/components/pages/ordering/RemitStep';
import { ROUTES } from '@/constants/routes';
import { useOrder } from '@/hooks/useOrder';
import { useOrderStore } from '@/stores/orderStore';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Ordering() {
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const navigate = useNavigate();
  const { orderItems } = useOrderStore();
  const { createOrder, isLoading } = useOrder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<
    'remit' | 'depositor' | 'complete'
  >('remit');
  const [depositorName, setDepositorName] = useState('');

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleFinalSubmit = async () => {
    const isSuccess = await createOrder(depositorName);
    if (isSuccess) {
      setModalStep('complete');
      setDepositorName('');
    }
  };

  if (userData.userId === undefined) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="relative min-h-screen bg-white px-4">
        <Navigator
          left={<GoBackIcon />}
          onLeftPress={() => navigate(ROUTES.MENU_BOARD)}
          center={<div className="text-st-1">주문하기</div>}
        />

        <main className="pb-24">
          <h2 className="text-st-2 mt-6 mb-2">주문 내역</h2>
          <OrderingMenuList items={orderItems} />
          <BottomSpace />
        </main>
      </div>

      {orderItems.length > 0 && (
        <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center gap-4 bg-white p-4">
          <span className="text-st-2 text-black">
            총 {totalAmount.toLocaleString()}원
          </span>

          <Dialog.Trigger asChild>
            <button className="bg-primary-300 text-b-1 flex-1 rounded-2xl py-4 text-center text-black">
              송금하기
            </button>
          </Dialog.Trigger>
        </footer>
      )}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-white">
          <Dialog.Title className="sr-only">
            송금하기 또는 입금자명 입력
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            송금하기 또는 입금자명 입력
          </Dialog.Description>
          {modalStep === 'complete' ? (
            <Navigator center={<div className="text-st-1">주문 완료</div>} />
          ) : (
            <Navigator
              left={<GoBackIcon />}
              onLeftPress={() => {
                if (modalStep === 'depositor') setModalStep('remit');
                else setIsModalOpen(false);
              }}
              center={
                <div className="text-st-1">
                  {modalStep === 'remit' ? '송금하기' : '입금자명 입력'}
                </div>
              }
            />
          )}

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
            />
          ) : (
            <CompleteStep />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

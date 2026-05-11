import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { OrderSummary } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '../../../constants/message';
import CtaButton from '../../common/buttons/CtaButton';
import OrderDetail from './OrderDetail';

interface Props {
  order: OrderSummary;
  setOrderSent: (orderId: number) => void;
  setOrderCooked: (orderId: number) => void;
  deleteOrder: (orderId: number) => void;
}

export function OrderCard({
  order,
  setOrderSent,
  setOrderCooked,
  deleteOrder,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notification = new Audio('/sounds/effect_notification_2.mp3');

  const orderItems = order.items || [];
  const tableNum = order.tableId || '-';

  const depositorName = order.customerName || '알 수 없음';

  const timeString = order.createdAt || '';
  const formattedTime = timeString
    ? new Date(timeString).toLocaleString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const isPaid = order.paymentStatus === 'PAID';

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="space-y-3 rounded-lg bg-white p-4">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="mb-2 flex items-center gap-1">
              <span className="bg-gray-500-10 text-gray-500-90 rounded-md px-1.5 py-1 text-[12px]">
                테이블 번호 {tableNum}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500-30 text-[12px]">
                주문번호 {String(order.id).padStart(3, '0')}
              </span>
              <span className="text-gray-500-30 text-[12px]">·</span>
              <span className="text-gray-500-30 text-[12px]">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-b border-gray-200 py-3">
          <div className="flex justify-between">
            <p className="text-c-1 text-gray-400">메뉴명</p>
            <p className="text-c-1 text-gray-400">수량</p>
          </div>

          {orderItems.map((item: any, index: number) => {
            const quantity = item.quantity ?? item.count ?? 0;
            const itemName = item.menu.name || '메뉴명 없음';

            const itemTotal = (item.price || 0) * quantity;

            return (
              <div
                key={`${order.id}-${item.id || index}`}
                className="flex justify-between"
              >
                <p className="text-gray-500-90 text-[14px] font-bold">
                  {itemName}
                </p>
                <div className="text-right">
                  <span className="text-gray-500-90 text-[14px] font-bold">
                    {quantity}개
                  </span>
                  <p className="text-gray-500-50 text-[12px] font-bold">
                    {itemTotal.toLocaleString()}원
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between font-bold text-black">
          <p>입금자명: {depositorName}</p>
          <div className="text-right">
            <p>{(order.totalPrice || 0).toLocaleString()}원</p>
            <span className="text-sm font-medium text-gray-400"></span>
          </div>
        </div>

        {isPaid ? (
          <div className="mt-6 flex flex-col gap-2">
            <button
              className="flex-1 rounded-xl bg-[#F5C754] py-4 text-[14px] text-gray-900 transition-colors active:bg-yellow-500"
              onClick={() => {
                setOrderCooked(order.id);
                toast.success(SUCCESS_MESSAGES.orderCookingComplete);
              }}
            >
              조리 완료
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 pt-2">
              <DeleteConfirmModal
                title={'주문을 취소할까요 ?'}
                description={'주문 취소 후에는 복구할 수 없어요.'}
                cancelButtonText={'돌아가기'}
                confirmButtonText={'주문 취소하기'}
                onConfirm={() => {
                  deleteOrder(order.id);
                  toast.success(SUCCESS_MESSAGES.orderCancelSuccess);
                }}
              >
                <CtaButton
                  text="취소하기"
                  color="red"
                  size="small"
                  width="fit"
                  className="shrink-0 text-[0.85rem] whitespace-nowrap"
                />
              </DeleteConfirmModal>

              <CtaButton
                text="입금 확인"
                onClick={() => {
                  toast.success('입금이 확인되었습니다. 조리를 시작하세요 !');
                  notification.play();
                  setOrderSent(order.id);
                }}
                size="small"
                className="text-[0.85rem]"
              />
            </div>
          </div>
        )}

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <OrderDetail
              order={order}
              onClose={() => {
                setIsModalOpen(false);
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}

import StatusCheckIcon from '@/components/common/icons/StatusCheckIcon';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { OrderSummary } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '../../../constants/message';
import CtaButton from '../../common/buttons/CtaButton';
import OrderDetail from './OrderDetail';

interface Props {
  order: OrderSummary;
  setOrderSent: (orderId: number) => void;
  setOrderCooked: (orderId: number) => void;
  deleteOrder: (orderId: number) => void;
  toggleItemCompleted?: (itemId: number) => void;
}

export function OrderCard({
  order,
  setOrderSent,
  setOrderCooked,
  toggleItemCompleted,
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

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Mobi/i.test(window.navigator.userAgent);
  }, []);

  const formattedPhone = useMemo(
    () => order.phoneNumber?.replace(/-/g, '') || '',
    [order.phoneNumber],
  );

  const groupedItems = useMemo(() => {
    const groups = new Map<string | number, any>();

    orderItems.forEach((item: any) => {
      const key = item.menuId ?? item.menu?.id ?? item.menu?.name ?? 'unknown';
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          menuName: item.menu?.name || '메뉴명 없음',
          totalQuantity: 0,
          totalPrice: 0,
          items: [],
        });
      }

      const group = groups.get(key);
      const quantity = item.quantity ?? item.count ?? 1;

      group.totalQuantity += quantity;
      group.totalPrice += (item.price || 0) * quantity;
      group.items.push(item);
    });

    return Array.from(groups.values());
  }, [orderItems]);

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

        <div className="space-y-4 border-y border-gray-200 py-4">
          <div className="mb-1 flex justify-between">
            <p className="text-[12px] text-gray-400">메뉴명</p>
            <p className="text-[12px] text-gray-400">수량</p>
          </div>

          {groupedItems.map((group, index) => {
            const isSingle = group.items.length === 1;

            if (isSingle) {
              const item = group.items[0];
              const isServed = item.completed;
              const itemId = item.id;

              return (
                <div
                  key={`group-${group.key}-${itemId}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {isPaid && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (toggleItemCompleted) toggleItemCompleted(itemId);
                        }}
                        className="flex shrink-0 items-center justify-center focus:outline-none"
                      >
                        <StatusCheckIcon
                          variant={isServed ? 'selected' : 'default'}
                        />
                      </button>
                    )}
                    <p
                      className={`text-[15px] font-bold transition-all ${isServed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                    >
                      {group.menuName}
                    </p>
                  </div>
                  <div
                    className={`text-right transition-all ${isServed ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <span
                      className={`text-[15px] font-bold ${isServed ? 'text-gray-400' : 'text-gray-800'}`}
                    >
                      {group.totalQuantity}개
                    </span>
                    <p className="text-[13px] font-bold text-gray-400">
                      {group.totalPrice.toLocaleString()}원
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`group-${group.key}-${index}`}
                className="flex flex-col gap-2 pt-2"
              >
                <div className="mb-1 flex items-start justify-between">
                  <p className="text-[16px] font-bold text-gray-800">
                    {group.menuName}
                  </p>
                  <div className="text-right">
                    <span className="text-[16px] font-bold text-gray-800">
                      {group.totalQuantity}개
                    </span>
                    <p className="text-[13px] font-bold text-gray-400">
                      {group.totalPrice.toLocaleString()}원
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {group.items.map((subItem: any, idx: number) => {
                    const isServed = subItem.completed;
                    return (
                      <div
                        key={subItem.id || idx}
                        className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3"
                      >
                        {isPaid && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (toggleItemCompleted)
                                toggleItemCompleted(subItem.id);
                            }}
                            className="flex shrink-0 items-center justify-center focus:outline-none"
                          >
                            <StatusCheckIcon
                              variant={isServed ? 'selected' : 'default'}
                            />
                          </button>
                        )}
                        <p
                          className={`text-[15px] font-bold transition-all ${isServed ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                        >
                          {group.menuName} {String(idx + 1).padStart(2, '0')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-2 font-bold text-black">
          <p>입금자명: {depositorName}</p>
          <div className="text-right">
            <p>{(order.totalPrice || 0).toLocaleString()}원</p>
            <span className="text-sm font-medium text-gray-400"></span>
          </div>
        </div>

        <div className="font-regular text-gray-500-50 flex items-center justify-between text-[14px]">
          <p>전화번호</p>
          <div className="text-gray-500-90 text-right">
            {order.phoneNumber ? (
              <a
                href={isMobile ? `tel:${formattedPhone}` : undefined}
                className="text-gray-500-90 text-[14px] font-semibold underline underline-offset-4"
                onClick={(e) => e.stopPropagation()}
              >
                {order.phoneNumber}
              </a>
            ) : (
              <span className="text-sm text-gray-400">번호 없음</span>
            )}
            <span className="text-sm font-medium text-gray-400"></span>
          </div>
        </div>

        {isPaid ? (
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex gap-3 pt-2">
              <DeleteConfirmModal
                title={'주문을 취소할까요 ?'}
                description={'주문 취소 후에는 복구할 수 없어요.'}
                cancelButtonText={'돌아가기'}
                confirmButtonText={'주문 취소하기'}
                onConfirm={() => {
                  deleteOrder(order.id);
                }}
              >
                <CtaButton
                  text="취소하기"
                  color="lightRed"
                  size="small"
                  width="fit"
                  className="shrink-0 text-[0.85rem] whitespace-nowrap"
                />
              </DeleteConfirmModal>

              <CtaButton
                text="조리 완료 처리"
                onClick={() => {
                  setOrderCooked(order.id);
                  toast.success(SUCCESS_MESSAGES.orderCookingComplete);
                }}
                size="small"
                className="text-[0.85rem]"
              />
            </div>
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
                }}
              >
                <CtaButton
                  text="취소하기"
                  color="lightRed"
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

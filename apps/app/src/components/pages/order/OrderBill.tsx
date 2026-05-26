import { OrderSummary } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo } from 'react';

interface Props {
  order: OrderSummary | any;
}

export function OrderBill({ order }: Props) {
  const orderItems = order.items || order.orderUsers || [];

  // 💡 취소 상태 확인 플래그
  const isCanceled = order.status === 'CANCELED';

  const timeString = order.createdAt || order.time || '';
  const formattedTime = timeString
    ? new Date(timeString).toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const depositorName =
    order.customerName || order.depositorName || order.name || '알 수 없음';

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Mobi/i.test(window.navigator.userAgent);
  }, []);

  const formattedPhone = useMemo(
    () => order.phoneNumber?.replace(/-/g, '') || '',
    [order.phoneNumber],
  );

  const totalQuantity = orderItems.reduce(
    (acc: number, item: any) => acc + (item.quantity ?? item.count ?? 0),
    0,
  );

  const tableNum = order.tableId || order.tableNumber;
  const isTakeout = String(tableNum) === '9999';

  return (
    <Dialog.Root open={true} onOpenChange={() => {}}>
      <div className="w-full space-y-3 rounded-lg bg-white p-4">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-b-2 text-black">주문번호</span>
              <span className="text-b-2 text-black">
                {String(order.id).padStart(3, '0')}
              </span>
            </div>
            {isCanceled && (
              <span className="text-b-2 text-red-500">취소된 주문</span>
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-b-2 text-gray-400">테이블 번호</span>

              <span
                className={`text-b-2 inline-flex self-start rounded-lg px-3 py-1 text-white ${
                  isCanceled ? 'bg-red-500' : 'bg-black'
                }`}
              >
                {isTakeout ? '포장주문' : `${tableNum}번`}
              </span>
            </div>

            <div className="flex flex-col items-center justify-end">
              <span className="text-gray-400">{formattedTime}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-b border-gray-200 py-3">
          <p className="text-c-1 text-gray-400">주문내역</p>

          {orderItems.map((item: any, index: number) => {
            const quantity = item.quantity ?? item.count ?? 0;
            const itemName = item.menu?.name ?? item.name ?? '메뉴명 없음';
            const itemTotal = item.price * quantity;

            return (
              <div
                key={`${order.id}-${item.id || index}`}
                className="flex justify-between"
              >
                <p
                  className={`text-gray-black ${
                    isCanceled ? 'text-gray-500 line-through' : ''
                  }`}
                >
                  {itemName}
                </p>
                <div className="text-right">
                  <p className="text-gray-black">
                    {itemTotal.toLocaleString()}원
                  </p>
                  <span className="text-sm text-gray-400">{quantity}개</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between font-bold text-black">
          <p>총 금액</p>
          <div className="text-right">
            <p>{(order.totalPrice || 0).toLocaleString()}원</p>

            <span className="text-sm font-medium text-gray-400">
              총 {totalQuantity}개
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-gray-100 px-7 py-3">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-400">입금자명</span>
            <p className="text-gray-black">{depositorName}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-400">전화번호</span>
            {order.phoneNumber ? (
              <a
                href={isMobile ? `tel:${formattedPhone}` : undefined}
                className="text-gray-black underline underline-offset-4"
                onClick={(e) => e.stopPropagation()}
              >
                {order.phoneNumber}
              </a>
            ) : (
              <span className="text-sm text-gray-400">번호 없음</span>
            )}
          </div>
        </div>
      </div>
    </Dialog.Root>
  );
}

import { OrderSummary } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
interface Props {
  order: OrderSummary;
}

export function OrderBill({ order }: Props) {
  return (
    <Dialog.Root open={true} onOpenChange={() => {}}>
      <div className="w-full space-y-3 rounded-lg bg-white p-4">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-1">
            <span className="text-b-2 text-black">주문번호</span>
            <span className="text-b-2 text-black">
              {String(order.id).padStart(3, '0')}
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-b-2 text-gray-400">테이블 번호</span>
              <span className="text-b-2 inline-flex self-start rounded-lg bg-black px-3 py-1 text-white">
                {order.tableNumber}번
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-400">{order.time}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-b border-gray-200 py-3">
          <p className="text-c-1 text-gray-400">주문내역</p>
          {order.orderUsers.map((item) => (
            <div
              key={`${order.id}-${item.id}`}
              className="flex justify-between"
            >
              <p className="text-gray-black">{item.menu} </p>
              <div className="text-right">
                <p className="text-gray-black">
                  {(item.price * item.count).toLocaleString()}원
                </p>
                <span className="text-sm text-gray-300">{item.count}개</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-black">
          <p>총 금액</p>
          <div className="text-right">
            <p>{order.totalPrice.toLocaleString()}원</p>
            <span className="text-sm font-medium text-gray-400"></span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 rounded-xl bg-gray-100 p-3 px-8">
            <span className="text-sm text-gray-400">입금자명</span>
            <p className="text-gray-black">{order.name}</p>
          </div>
        </div>
      </div>
    </Dialog.Root>
  );
}

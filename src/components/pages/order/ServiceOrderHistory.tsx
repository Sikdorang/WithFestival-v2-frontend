import { OrderSummary } from '@/types/global';
import * as Dialog from '@radix-ui/react-dialog';
interface Props {
  order: OrderSummary;
}

export default function ServiceOrderHistory({ order }: Props) {
  return (
    <Dialog.Root open={true} onOpenChange={() => {}}>
      <div className="w-full space-y-3 rounded-lg bg-white p-4">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-1">
            <span className="text-b-2 text-black">직원 호출</span>
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

        <div className="flex flex-col gap-1">
          <span className="text-c-1 text-gray-400">요청 내역</span>
          <span className="text-b-1">{order.orderUsers[0].menu}</span>
        </div>
      </div>
    </Dialog.Root>
  );
}

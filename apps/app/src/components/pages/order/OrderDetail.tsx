import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import Navigator from '@/components/common/layouts/Navigator';
import { OrderSummary } from '@/types/global';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '../../../constants/message';

interface OrderDetailProps {
  order: OrderSummary | null;
  onClose: () => void;
}

export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  if (!order) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Navigator
        left={<GoBackIcon />}
        center={<div className="text-st-1">주문 상세</div>}
        onLeftPress={onClose}
      />

      <main className="flex-grow p-4">
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

        <div className="mt-4">
          <h3 className="text-b-2 text-gray-500">주문내역</h3>
          <div className="mt-2 flex flex-col">
            {order.orderUsers.map((item) => (
              <div key={item.id} className="flex justify-between py-3">
                <div>
                  <p className="text-b-1">{item.menu}</p>
                </div>
                <p className="text-b-1 text-right font-semibold">
                  {item.price.toLocaleString()}원
                  <p className="text-c-1 text-gray-400">{item.count}개</p>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between border-t-2 border-gray-200 pt-3">
          <span className="text-b-1">총 금액</span>
          <div>
            <p className="text-st-1 text-right text-black">
              {order.totalPrice.toLocaleString()}원
            </p>
            <p className="text-c-1 text-right text-gray-400">
              총 {order.orderUsers.reduce((acc, item) => acc + item.count, 0)}개
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full p-4">
        <CtaButton
          text="조리 완료"
          onClick={() => {
            onClose();
            toast.success(SUCCESS_MESSAGES.orderCookingComplete);
          }}
          radius="_2xl"
        />
      </footer>
    </div>
  );
}

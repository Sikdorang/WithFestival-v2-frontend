import { OrderSummary } from '@/types/global';
import { SUCCESS_MESSAGES } from '@/constants/message';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';

interface Props {
  order: OrderSummary;
  setOrderSent: (orderId: number) => void;
  setOrderCooked: (orderId: number) => void;
  deleteOrder: (orderId: number) => void;
}

export default function ServiceOrderCard({
  order,
  deleteOrder,
  setOrderSent,
  setOrderCooked,
}: Props) {
  const requestMessage = order.orderUsers[0]?.menu || '요청사항 없음';

  const notification = new Audio('/sounds/effect_notification_2.mp3');

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-red-100 p-4 shadow-md">
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

      <div className="text-b-1">{requestMessage}</div>

      {order.send ? (
        <div className="flex flex-col gap-2">
          <button
            className="bg-primary-300 rounded-2xl py-3 text-black"
            onClick={() => {
              setOrderCooked(order.id);
              toast.success(SUCCESS_MESSAGES.serviceRequestCompleteSuccess);
            }}
          >
            요청 완료
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <DeleteConfirmModal
              title={'호출을 취소할까요 ?'}
              description={'호출 취소 후에는 복구할 수 없어요.'}
              cancelButtonText={'돌아가기'}
              confirmButtonText={'호출 취소하기'}
              onConfirm={() => {
                deleteOrder(order.id);
                toast.success(SUCCESS_MESSAGES.serviceRequestCancelSuccess);
              }}
            >
              <button className="w-full rounded-2xl bg-red-500 py-3 font-bold text-white">
                취소
              </button>
            </DeleteConfirmModal>
            <button
              className="bg-primary-300 rounded-2xl py-3 font-bold text-black"
              onClick={() => {
                toast.success('요청이 확인되었습니다 !');
                notification.play();
                setOrderSent(order.id);
              }}
            >
              요청 확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

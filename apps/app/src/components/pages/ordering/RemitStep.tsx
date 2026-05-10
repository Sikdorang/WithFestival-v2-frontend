import CopyIcon from '@/assets/icons/ic_copy.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface RemitStepProps {
  totalAmount: number;
  onNext: () => void;
}

export default function RemitStep({ totalAmount, onNext }: RemitStepProps) {
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const { getStorePublicInfo, account } = useStore();

  useEffect(() => {
    getStorePublicInfo(userData.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-15 text-center">
      <div className="flex flex-col gap-8">
        <div className="text-t-1">
          {totalAmount.toLocaleString()}원을
          <br />
          입금해주세요!
        </div>
        <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-gray-100 px-15 py-5">
          <span className="text-b-2 bg-primary-300-80 text-gray-500-80 rounded-sm px-1.5 py-1">
            계좌번호
          </span>
          <div className="flex items-center gap-2">
            <span className="text-b-1 text-gray-700">{account}</span>
            <CopyIcon
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(account || '');
                toast.success(SUCCESS_MESSAGES.accountCopySuccess);
              }}
            />
          </div>
        </div>
      </div>
      <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center gap-4 bg-white p-4">
        <DeleteConfirmModal
          title={'송금을 완료하셨나요 ?'}
          description={'송금하지 않고 넘어가면 주문이 취소될 수 있어요 !'}
          cancelButtonText={'돌아가기'}
          confirmButtonText={'완료했어요 !'}
          onConfirm={onNext}
        >
          <CtaButton text="송금 완료" radius="_2xl" />
        </DeleteConfirmModal>
      </footer>
    </div>
  );
}

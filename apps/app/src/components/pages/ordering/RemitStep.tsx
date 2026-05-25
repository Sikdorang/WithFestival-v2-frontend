import CopyIcon from '@/assets/icons/ic_copy.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import TextInput from '@/components/common/inputs/TextInput';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { useKeyboardScroll } from '@/hooks/common/useKeyboardScroll';
import { useCoupon } from '@/hooks/useCoupon';
import { useStore } from '@/hooks/useStore';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface RemitStepProps {
  totalAmount: number;
  onNext: () => void;
}

export default function RemitStep({ totalAmount, onNext }: RemitStepProps) {
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const { getStorePublicInfo, account } = useStore();
  const { validateCoupon } = useCoupon();
  const { targetRef, handleFocus, handleBlur } =
    useKeyboardScroll<HTMLDivElement>();

  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    getStorePublicInfo(userData.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleCoupon = async () => {
    if (isCouponApplied) {
      setIsCouponApplied(false);
      setDiscountAmount(0);
      setCouponCode('');
      toast.success('쿠폰 적용이 해제되었습니다.');
      return;
    }

    const trimmedCode = couponCode.trim();
    if (!trimmedCode) {
      toast.error('쿠폰 번호를 입력해주세요.');
      return;
    }

    const response = await validateCoupon(userData.userId, trimmedCode);

    if (response && response.valid) {
      setIsCouponApplied(true);
      setDiscountAmount(response.discountPrice || 0);
      toast.success(
        `쿠폰이 적용되어 ${response.discountPrice?.toLocaleString()}원이 할인됩니다.`,
      );
    } else {
      toast.error('유효하지 않거나 이미 사용된 쿠폰입니다.');
    }
  };

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto pb-15 text-center">
      <div className="flex w-full flex-col gap-8 px-4">
        <div className="text-t-1">
          {isCouponApplied && (
            <span className="mb-1 block text-sm text-gray-400 line-through">
              기존 {totalAmount.toLocaleString()}원
            </span>
          )}
          {finalAmount.toLocaleString()}원을
          <br />
          입금해주세요!
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-100 px-4 py-5">
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

        <div ref={targetRef} className="flex w-full flex-col gap-2 text-left">
          <div className="flex w-full items-end gap-2">
            <div className="flex-1">
              <TextInput
                label="쿠폰 번호"
                limitHide
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="쿠폰 번호를 입력하세요"
                disabled={isCouponApplied}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div className="flex flex-col justify-end">
              <CtaButton
                onClick={handleToggleCoupon}
                text={isCouponApplied ? '해제' : '적용'}
                color={isCouponApplied ? 'white' : 'gray'}
                width="fit"
                size="medium"
                radius="xl"
                className={`whitespace-nowrap ${isCouponApplied ? 'border border-gray-300 !text-gray-700' : ''}`}
              />
            </div>
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

      <Dialog.Root open={showNotice} onOpenChange={setShowNotice}>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 bg-black/45" />

          <Dialog.Content
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="data-[state=closed]:animate-slide-down data-[state=open]:animate-slide-up fixed inset-x-0 bottom-0 z-50 flex flex-col gap-6 rounded-t-[2rem] bg-white px-6 pt-10 pb-8 shadow-xl outline-none"
          >
            <Dialog.Title className="sr-only">
              주의사항: 입금자명 입력 안내
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              송금 완료 후 입금자명을 입력해야 주문이 완료됩니다.
            </Dialog.Description>

            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xl font-bold text-gray-800">
                주문하기 전에 한번만 읽어주세요 !
              </h3>
              <p className="text-[15px] leading-relaxed text-gray-600">
                송금을 완료하신 후, 반드시 다음 화면에서{' '}
                <span className="font-bold text-black">입금자명</span>까지 모두
                입력해주셔야 정상적으로 주문 접수가 완료됩니다.
              </p>
            </div>

            <CtaButton
              text="확인했어요"
              onClick={() => setShowNotice(false)}
              radius="_2xl"
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

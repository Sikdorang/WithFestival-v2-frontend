import CopyIcon from '@/assets/icons/ic_copy.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { useCoupon } from '@/hooks/useCoupon';
import { useStore } from '@/hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import scrollIntoView from 'scroll-into-view-if-needed';
import TextInput from '../../common/inputs/TextInput';

interface RemitStepProps {
  totalAmount: number;
  onNext: () => void;
}

export default function RemitStep({ totalAmount, onNext }: RemitStepProps) {
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const couponAreaRef = useRef<HTMLDivElement>(null);
  const { getStorePublicInfo, account } = useStore();

  const { validateCoupon } = useCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    getStorePublicInfo(userData.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputFocus = () => {
    setTimeout(() => {
      if (couponAreaRef.current) {
        scrollIntoView(couponAreaRef.current, {
          scrollMode: 'if-needed',
          block: 'center',
          behavior: 'smooth',
        });
      }
    }, 350);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

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

        <div
          ref={couponAreaRef}
          className="flex w-full flex-col gap-2 text-left"
        >
          <div className="flex w-full items-end gap-2">
            <div className="flex-1">
              <TextInput
                label="쿠폰 번호"
                limitHide
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="쿠폰 번호를 입력하세요"
                disabled={isCouponApplied}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
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
    </div>
  );
}

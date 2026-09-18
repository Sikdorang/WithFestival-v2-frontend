'use client';

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import TrashIcon from '@/assets/icons/ic_cancel.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import { TabButton } from '@/components/common/buttons/TabButton'; // 💡 TabButton import 추가 (경로는 프로젝트 환경에 맞게 수정 필요)
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { useCoupon } from '@/hooks/useCoupon';
import {
  createInFlightLock,
  LEADING_SUBMIT_OPTIONS,
  SUBMIT_GUARD_MS,
} from '@/shared/lib/idempotency';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

export default function ManageCoupon() {
  const navigate = useNavigate();
  const {
    coupons,
    fetchCoupons,
    toggleCouponUsed,
    createCoupon,
    deleteCoupon,
    isLoading,
  } = useCoupon();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const createLockRef = useRef(createInFlightLock());

  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'AMOUNT' | 'PERCENT'>('AMOUNT');
  const [newDiscount, setNewDiscount] = useState('');
  const [newHolder, setNewHolder] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const filteredCoupons = useMemo(() => {
    if (!searchQuery.trim()) return coupons;
    const lowerQuery = searchQuery.toLowerCase();
    return coupons.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(lowerQuery) ||
        (coupon.holder && coupon.holder.toLowerCase().includes(lowerQuery)),
    );
  }, [coupons, searchQuery]);

  const handleCreateSubmit = useDebouncedCallback(
    async () => {
      if (!newCode.trim() || !newDiscount) {
        toast.error('쿠폰 번호와 할인 값을 입력해주세요.');
        return;
      }

      const discountVal = Number(newDiscount);

      if (newType === 'PERCENT' && (discountVal <= 0 || discountVal > 100)) {
        toast.error('할인 비율은 1에서 100 사이여야 합니다.');
        return;
      }

      if (!createLockRef.current.tryAcquire()) return;
      setIsCreating(true);
      try {
        const success = await createCoupon({
          code: newCode.trim(),
          type: newType,
          discountPrice: discountVal,
          holder: newHolder.trim() || null,
        });

        if (success) {
          setIsCreateModalOpen(false);
          setNewCode('');
          setNewType('AMOUNT');
          setNewDiscount('');
          setNewHolder('');
        }
      } finally {
        setIsCreating(false);
        createLockRef.current.release();
      }
    },
    SUBMIT_GUARD_MS,
    LEADING_SUBMIT_OPTIONS,
  );

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="쿠폰 관리"
      />

      <main className="flex min-h-screen flex-col bg-gray-50">
        <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
          <TextInput
            label="쿠폰 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="쿠폰 번호, 사용자 이름"
            limitHide
          />
        </div>

        <div className="flex flex-col gap-3 p-4 pb-24">
          {isLoading && coupons.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              쿠폰 목록을 불러오는 중입니다...
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="pt-20">
              <EmptyPlaceHolder
                image={undefined}
                text="검색 결과가 없거나 등록된 쿠폰이 없습니다."
              />
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`relative flex flex-col gap-3 rounded-2xl p-5 shadow-sm transition-all duration-300 ${
                  coupon.used ? 'bg-gray-100 opacity-70' : 'bg-white'
                }`}
              >
                <div className="absolute top-7 right-6">
                  <DeleteConfirmModal
                    title="쿠폰을 삭제하시겠어요?"
                    description="삭제된 쿠폰은 복구할 수 없습니다."
                    cancelButtonText="취소"
                    confirmButtonText="삭제"
                    onConfirm={() => deleteCoupon(coupon.id)}
                  >
                    <button className="text-gray-300 transition-colors hover:text-red-500">
                      <TrashIcon width={16} height={16} />
                    </button>
                  </DeleteConfirmModal>
                </div>

                <div className="flex items-center justify-between">
                  <div className="mr-14 flex flex-1 flex-col gap-1.5 pt-1">
                    <span
                      className={`text-lg font-bold ${
                        coupon.used ? 'text-gray-400' : 'text-primary-500'
                      }`}
                    >
                      {coupon.type === 'PERCENT'
                        ? `${coupon.discountPrice}% 할인`
                        : `${coupon.discountPrice.toLocaleString()}원 할인`}
                    </span>

                    <span
                      className={`text-sm font-semibold break-all ${
                        coupon.used
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {coupon.code}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                    coupon.used ? 'bg-gray-200/50' : 'bg-gray-50'
                  }`}
                >
                  <span className="text-gray-500">소지자:</span>
                  <span
                    className={`font-medium ${
                      coupon.used ? 'text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {coupon.holder || '지정되지 않음'}
                  </span>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-1.5">
                  <div className="text-sm text-gray-400">사용 처리</div>
                  <button
                    onClick={() => toggleCouponUsed(coupon.id, coupon.used)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
                      coupon.used ? 'bg-primary-300' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                        coupon.used ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="fixed right-4 bottom-10 z-10">
        <CtaButton
          text="쿠폰 추가"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3"
          width="fit"
          size="small"
        />
      </div>

      <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl outline-none">
            <Dialog.Title className="text-gray-500-90 text-lg font-semibold">
              쿠폰 생성
            </Dialog.Title>
            <div className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <TextInput
                  label="쿠폰 번호"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="예: FEST2026-NEW"
                  limitHide
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-b-2 block text-gray-400">
                  할인 유형
                </label>
                <div className="flex justify-center">
                  <TabButton
                    options={['정액 할인', '비율 할인 (%)']}
                    selectedIndex={newType === 'AMOUNT' ? 0 : 1}
                    onChange={(index) => {
                      setNewType(index === 0 ? 'AMOUNT' : 'PERCENT');
                      setNewDiscount('');
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <TextInput
                  label={newType === 'AMOUNT' ? '할인 금액' : '할인 비율 (%)'}
                  value={newDiscount}
                  type="number"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (newType === 'PERCENT' && Number(val) > 100) return;
                    setNewDiscount(val);
                  }}
                  placeholder={newType === 'AMOUNT' ? '예: 3000' : '예: 10'}
                  limitHide
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <TextInput
                  label="소지자 (선택)"
                  value={newHolder}
                  onChange={(e) => setNewHolder(e.target.value)}
                  placeholder="예: 김철수 010-1234-5678"
                  limitHide
                />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <CtaButton
                text="취소"
                color="gray"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreating}
              />
              <CtaButton
                text="생성"
                color="black"
                onClick={handleCreateSubmit}
                disabled={isCreating || isLoading}
                isLoading={isCreating}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BaseResponsiveLayout>
  );
}

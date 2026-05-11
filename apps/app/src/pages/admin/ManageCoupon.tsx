'use client';

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { useCoupon } from '@/hooks/useCoupon';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/common/inputs/TextInput';

export default function ManageCoupon() {
  const navigate = useNavigate();
  const { coupons, fetchCoupons, toggleCouponUsed, createCoupon, isLoading } =
    useCoupon();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 생성 폼 상태
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newHolder, setNewHolder] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // 검색 필터링 로직 (쿠폰 번호 또는 사용자 이름)
  const filteredCoupons = useMemo(() => {
    if (!searchQuery.trim()) return coupons;
    const lowerQuery = searchQuery.toLowerCase();
    return coupons.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(lowerQuery) ||
        (coupon.holder && coupon.holder.toLowerCase().includes(lowerQuery)),
    );
  }, [coupons, searchQuery]);

  // 쿠폰 생성 핸들러
  const handleCreateSubmit = async () => {
    if (!newCode.trim() || !newDiscount) {
      toast.error('쿠폰 번호와 할인 금액을 입력해주세요.');
      return;
    }

    const success = await createCoupon({
      code: newCode.trim(),
      discountPrice: Number(newDiscount),
      holder: newHolder.trim() || null,
    });

    if (success) {
      setIsCreateModalOpen(false);
      setNewCode('');
      setNewDiscount('');
      setNewHolder('');
    }
  };

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

        {/* 쿠폰 목록 스크롤 영역 */}
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
                // 💡 사용 여부에 따른 배경색 및 투명도 변경
                className={`flex flex-col gap-3 rounded-2xl p-5 shadow-sm transition-all duration-300 ${
                  coupon.used ? 'bg-gray-100 opacity-70' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    {/* 💡 사용 완료 시 텍스트 회색 처리 및 취소선 */}
                    <span
                      className={`text-lg font-bold ${
                        coupon.used
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {coupon.code}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        coupon.used ? 'text-gray-400' : 'text-primary-500'
                      }`}
                    >
                      {coupon.discountPrice.toLocaleString()}원 할인
                    </span>
                  </div>
                  {/* 사용 여부 토글 버튼 */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-400">
                      {coupon.used ? '사용 완료' : '미사용'}
                    </span>
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
                {/* 사용자 정보 영역 */}
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
              </div>
            ))
          )}
        </div>
      </main>

      {/* 하단 고정 생성 버튼 */}
      <div className="fixed right-4 bottom-10 z-10">
        <CtaButton
          text="쿠폰 추가"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3"
          width="fit"
          size="small"
        />
      </div>

      {/* 쿠폰 생성 모달 (Radix UI) */}
      <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl outline-none">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              새 쿠폰 생성
            </Dialog.Title>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  쿠폰 번호 (필수)
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="예: FEST2026-NEW"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  할인 금액 (필수)
                </label>
                <input
                  type="number"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder="예: 3000"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  소지자 (선택)
                </label>
                <input
                  type="text"
                  value={newHolder}
                  onChange={(e) => setNewHolder(e.target.value)}
                  placeholder="예: 김철수 010-1234-5678"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <CtaButton
                text="취소"
                color="gray"
                onClick={() => setIsCreateModalOpen(false)}
              />
              <CtaButton
                text="생성"
                color="black"
                onClick={handleCreateSubmit}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BaseResponsiveLayout>
  );
}

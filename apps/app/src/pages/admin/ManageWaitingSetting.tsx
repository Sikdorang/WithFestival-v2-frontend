'use client';

import CtaButton from '@/components/common/buttons/CtaButton';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import TopBar from '@/components/common/layouts/TopBar';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import toast from 'react-hot-toast';
import TextArea from '../../components/common/inputs/TextArea';

export default function ManageWaitingSetting() {
  const [isWaitEnabled, setIsWaitEnabled] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [notifyStep, setNotifyStep] = useState<number>(0);
  const [messageContent, setMessageContent] = useState<string>(
    '곧 입장 차례입니다! 부스 앞으로 와주세요.',
  );

  const handleToggleWait = () => {
    setIsWaitEnabled((prev) => !prev);
    toast.success(
      isWaitEnabled
        ? '웨이팅 접수가 중단되었습니다.'
        : '웨이팅 접수가 시작되었습니다.',
    );
  };

  const handleSaveSettings = () => {
    toast.success('웨이팅 알림 설정이 저장되었습니다.');
    setIsMessageModalOpen(false);
  };

  return (
    <BaseResponsiveLayout>
      <TopBar />

      <main className="flex min-h-screen flex-col gap-4 bg-white px-4 pt-4">
        {/* 설정 그룹 */}
        <div className="flex flex-col gap-2">
          {/* 웨이팅 활성화 토글 */}
          <div className="z-10 flex items-center justify-between rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(17,21,63,0.04)]">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-[#11153F]">
                웨이팅 기능 활성화
              </span>
              <span className="text-xs text-gray-400">
                비활성화 시 방문객이 웨이팅을 걸 수 없습니다.
              </span>
            </div>
            <button
              onClick={handleToggleWait}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
                isWaitEnabled ? 'bg-[#FFD43A]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  isWaitEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 웨이팅 알림 메시지 설정 버튼 */}
          <button
            onClick={() => setIsMessageModalOpen(true)}
            disabled={!isWaitEnabled}
            className={`z-10 flex w-full items-center justify-between rounded-xl bg-white p-5 text-left shadow-[0_2px_8px_rgba(17,21,63,0.04)] transition-all active:bg-gray-50 ${
              !isWaitEnabled ? 'pointer-events-none opacity-40 grayscale' : ''
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-[#11153F]">
                웨이팅 알림 메시지 설정
              </span>
              <span className="text-xs text-gray-400">
                {notifyStep === 0 ? '내 차례 직전' : `${notifyStep}명 전`}에
                알림이 전송됩니다.
              </span>
            </div>
            <span className="text-xl font-light text-gray-300">›</span>
          </button>
        </div>

        <div
          className={`mt-2 flex flex-col gap-4 ${!isWaitEnabled ? 'pointer-events-none opacity-40 grayscale' : ''}`}
        >
          <div className="flex items-center gap-3 rounded-xl bg-[#F0F5FF] p-4 text-[#11153F]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1C58D9] text-sm font-bold text-white">
              !
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold">
                1팀이 빠지는 데 평균 5분이 걸려요
              </span>
              <span className="text-xs text-[#1C58D9]/70">
                최근 테이블 회전율 기준으로 계산된 시간입니다.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 설정 모달 */}
      <Dialog.Root
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[2rem] bg-white outline-none">
            <div className="flex items-center justify-between p-6 pb-4">
              <span className="text-xl font-bold text-[#11153F]">
                웨이팅 메시지 설정
              </span>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-8 px-6 pb-24">
              {/* 호출 타이밍 선택 */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#11153F]">
                  언제 메시지를 보낼까요?
                </label>
                <div className="flex w-full gap-2">
                  {[0, 1, 2].map((step) => (
                    <button
                      key={step}
                      onClick={() => setNotifyStep(step)}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition-colors ${
                        notifyStep === step
                          ? 'bg-[#11153F] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {step === 0 ? '직전(다음 차례)' : `${step}명 전`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 메시지 내용 */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#11153F]">
                  메시지 내용
                </label>

                <TextArea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  limitHide
                />
              </div>
            </div>

            <div className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4">
              <CtaButton
                text="저장하기"
                onClick={handleSaveSettings}
                className="w-full"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BaseResponsiveLayout>
  );
}

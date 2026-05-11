import ManageBooth from '@/components/pages/store/ManageBooth';
import { useStore } from '@/hooks/useStore';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';

export default function StoreInformation() {
  const { name, account, getMyStoreInfo } = useStore();
  const [showManageBooth, setShowManageBooth] = useState(false);

  useEffect(() => {
    getMyStoreInfo();
  }, []);

  return (
    <Dialog.Root open={showManageBooth} onOpenChange={setShowManageBooth}>
      <div>
        <div className="bg-gray-500-3 mb-4 rounded-xl p-5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191F28]">부스 기본 정보</h2>
            <button
              onClick={() => setShowManageBooth(true)}
              className="bg-gray-500-5 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-[#4E5968] transition-colors active:bg-[#E5E8EB]"
            >
              관리하기
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-[#8B95A1]">
                부스이름
              </span>
              <span className="text-[16px] font-medium text-[#333D4B]">
                {name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-[#8B95A1]">
                계좌번호
              </span>
              <span className="text-[16px] font-medium text-[#333D4B]">
                {account}
              </span>
            </div>
          </div>
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <ManageBooth
              onClose={() => {
                getMyStoreInfo();
                setShowManageBooth(false);
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { useReserve } from '@/hooks/useReserve';
import { useReserveForm } from '@/hooks/useReserveForm';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ManageReserveDetail() {
  const navigate = useNavigate();
  const { slotId } = useParams();
  const isNewSlot = slotId === '0';

  const [isEditingMode, setIsEditingMode] = useState(isNewSlot);
  const { deleteSlot } = useReserve();

  // 예약 도메인에 맞춘 커스텀 훅 가정
  const { formData, handleChange, saveSlot } = useReserveForm(slotId);

  const handleSave = async () => {
    await saveSlot(isNewSlot);
    if (isNewSlot) navigate(-1);
    else setIsEditingMode(false);
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title={isNewSlot ? '예약 시간 추가' : '예약 시간 상세'}
      />

      <main className="flex flex-grow flex-col bg-white px-4 pt-5">
        {isEditingMode ? (
          // ——— [편집 모드 / 추가 모드] ———
          <div className="flex flex-col gap-4">
            <TextInput
              type="time"
              label="시작 시간"
              value={formData.startTime}
              limitHide
              onChange={(e) => handleChange('startTime', e.target.value)}
            />
            <TextInput
              type="time"
              label="종료 시간"
              value={formData.endTime}
              limitHide
              onChange={(e) => handleChange('endTime', e.target.value)}
            />
            <TextInput
              type="number"
              label="수용 가능 테이블 수"
              placeholder="예: 5"
              value={formData.maxTables?.toString()}
              limitHide
              onChange={(e) => handleChange('maxTables', e.target.value)}
            />
          </div>
        ) : (
          // --- [조회 모드] ---
          <div className="flex flex-col gap-1 gap-5 rounded-2xl bg-white p-6">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                시작 시간
              </p>
              <h1 className="text-2xl font-bold text-[#11153F]">
                {formData.startTime}
              </h1>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                종료 시간
              </p>
              <h1 className="text-2xl font-bold text-[#11153F]">
                {formData.endTime}
              </h1>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                최대 수용 가능 테이블
              </p>
              <h1 className="text-2xl font-bold text-[#11153F]">
                {formData.maxTables}개
              </h1>
            </div>
          </div>
        )}
        <BottomSpace />
      </main>

      {/* --- Footer 로직 --- */}
      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 border-t border-gray-100 bg-white p-4">
        {isNewSlot ? (
          <>
            <CtaButton
              text="취소"
              color="gray"
              width="fit"
              onClick={() => navigate(-1)}
            />
            <CtaButton
              text="시간 추가하기"
              onClick={handleSave}
              className="flex-1"
              disabled={
                !formData.startTime || !formData.endTime || !formData.maxTables
              }
            />
          </>
        ) : (
          <>
            <DeleteConfirmModal
              title={'예약 시간을 삭제할까요?'}
              description={
                '삭제 후에는 복구할 수 없으며 기존 예약자 데이터에 영향을 줄 수 있습니다.'
              }
              cancelButtonText={'취소'}
              confirmButtonText={'삭제하기'}
              onConfirm={() => {
                if (!slotId) return;
                deleteSlot(slotId);
                navigate(-1);
              }}
            >
              <CtaButton text="삭제" radius="xl" color="red" width="fit" />
            </DeleteConfirmModal>
            <CtaButton
              text={isEditingMode ? '저장완료' : '수정하기'}
              onClick={() =>
                isEditingMode ? handleSave() : setIsEditingMode(true)
              }
              className="flex-1"
            />
          </>
        )}
      </footer>
    </BaseResponsiveLayout>
  );
}

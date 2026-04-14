import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CtaButton from '../components/common/buttons/CtaButton';
import DeleteConfirmModal from '../components/common/modals/DeleteConfirmModal';
import { ROUTES } from '../constants/routes';
import { useMission } from '../hooks/useMission';
import { useMissionForm } from '../hooks/useMissionForm'; // 미션 전용 폼 훅

const IMAGE_PREFIX = import.meta.env.VITE_IMAGE_PREFIX;

export default function ManageMissionDetail() {
  const navigate = useNavigate();
  const missionId = Number(useParams().missionId);
  const isNewMission = missionId === 0;

  const [isEditingMode, setIsEditingMode] = useState(isNewMission);
  const { deleteMission } = useMission();
  const {
    formData,
    imageState,
    fileInputRef,
    handleChange,
    handleImageChange,
    clearImage,
    saveMission,
  } = useMissionForm(missionId);

  const currentImageUrl =
    imageState.preview ||
    (imageState.original ? `${IMAGE_PREFIX}${imageState.original}` : null);

  const handleSave = async () => {
    await saveMission(isNewMission);
    if (isNewMission) navigate(ROUTES.STORE);
    else setIsEditingMode(false);
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title={isNewMission ? '미션 추가' : '미션 상세'}
      />

      <main className="flex flex-grow flex-col px-4 pt-5">
        {isEditingMode ? (
          <div className="flex flex-col gap-4">
            <TextInput
              label="미션명"
              placeholder="예: 스태프와 가위바위보"
              value={formData.title}
              limitHide
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <TextInput
              label="상세 설명"
              placeholder="미션 달성 방법을 입력해주세요."
              value={formData.description}
              limitHide
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <TextInput
              label="보상"
              placeholder="예: 음료수 1캔 무료"
              limitHide
              value={formData.reward}
              onChange={(e) => handleChange('reward', e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <h1 className="text-st-2 text-black">{formData.title}</h1>
            {formData.description && (
              <p className="text-b-1 text-gray-500">{formData.description}</p>
            )}
            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-400">달성 보상</p>
              <p className="text-st-2 text-primary-300">{formData.reward}</p>
            </div>
          </div>
        )}
        <BottomSpace />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 bg-white p-4">
        {isNewMission ? (
          <>
            <CtaButton
              text="취소"
              color="gray"
              width="fit"
              onClick={() => navigate(-1)}
            />
            <CtaButton
              text="미션 생성하기"
              onClick={handleSave}
              className="flex-1"
            />
          </>
        ) : (
          <>
            <DeleteConfirmModal
              title={'미션을 삭제할까요?'}
              description={'삭제된 미션은 복구할 수 없어요.'}
              cancelButtonText={'취소'}
              confirmButtonText={'삭제하기'}
              onConfirm={() => {
                deleteMission(missionId);
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

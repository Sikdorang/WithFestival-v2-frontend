import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import ImageUploader from '@/components/common/inputs/ImageUploader';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import DeleteConfirmModal from '@/components/common/modals/DeleteConfirmModal';
import { ROUTES } from '@/constants/routes';
import { useMenu } from '@/hooks/useMenu';
import { useMenuForm } from '@/hooks/useMenuForm';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const IMAGE_PREFIX = import.meta.env.VITE_IMAGE_PREFIX;

export default function ManageMenuDetail() {
  const navigate = useNavigate();
  const menuId = Number(useParams().menuId);
  const isNewMenu = menuId === 0;

  const [isEditingMode, setIsEditingMode] = useState(isNewMenu);
  const { deleteMenu } = useMenu();
  const {
    formData,
    imageState,
    fileInputRef,
    handleChange,
    handleImageChange,
    clearImage,
    saveMenu,
  } = useMenuForm(menuId);

  const currentImageUrl =
    imageState.preview ||
    (imageState.original ? `${IMAGE_PREFIX}${imageState.original}` : null);

  const handleSave = async () => {
    await saveMenu(isNewMenu);
    if (isNewMenu) navigate(ROUTES.STORE);
    else setIsEditingMode(false);
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title={isNewMenu ? '메뉴 추가' : '메뉴 상세'}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <main className="flex flex-grow flex-col px-4 pt-5">
        <div className="mb-8 flex w-full flex-col items-center">
          <ImageUploader
            imageUrl={currentImageUrl}
            isEditing={isEditingMode}
            onUploadClick={() => fileInputRef.current?.click()}
            onClear={clearImage}
          />
        </div>

        {isEditingMode ? (
          // ——— [편집 모드 / 추가 모드] ———
          <div className="flex flex-col gap-4">
            <TextInput
              label="메뉴"
              value={formData.menu}
              limitHide
              onChange={(e) => handleChange('menu', e.target.value)}
            />
            <TextInput
              label="설명"
              value={formData.description}
              limitHide
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <TextInput
              label="가격"
              placeholder="메뉴 가격을 입력해주세요."
              limitHide
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
            <TextInput
              label="마진율"
              placeholder="메뉴 마진율을 입력해주세요."
              limitHide
              value={formData.margin}
              onChange={(e) => handleChange('margin', e.target.value)}
            />
          </div>
        ) : (
          // --- [조회 모드] ---
          <div className="flex flex-col gap-1">
            <h1 className="text-st-2 text-black">{formData.menu}</h1>
            {formData.description && (
              <p className="text-b-1 text-gray-500">{formData.description}</p>
            )}
            <p className="text-st-2 mt-2 text-black">
              {Number(formData.price).toLocaleString()}원
            </p>
          </div>
        )}
        <BottomSpace />
      </main>

      {/* --- Footer 로직 --- */}
      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 p-4">
        {isNewMenu ? (
          <>
            <CtaButton
              text="취소"
              color="gray"
              width="fit"
              onClick={() => navigate(-1)}
            />
            <CtaButton
              text="메뉴 추가하기"
              onClick={handleSave}
              className="flex-1"
            />
          </>
        ) : (
          <>
            <DeleteConfirmModal
              title={'메뉴 삭제를 할까요 ?'}
              description={'메뉴 삭제 후에는 복구할 수 없어요.'}
              cancelButtonText={'취소'}
              confirmButtonText={'삭제하기'}
              onConfirm={() => {
                deleteMenu(menuId);
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

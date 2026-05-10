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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ManageMenuDetail() {
  const navigate = useNavigate();
  const menuId = Number(useParams().menuId);

  const {
    menus,
    deleteMenu,
    setMenuSoldOut,
    setMenuAvailable,
    isLoading: isMenuLoading,
  } = useMenu();

  const {
    formData,
    imageState,
    fileInputRef,
    isNewMenu,
    isSaving,
    handleChange,
    handleImageChange,
    clearImage,
    saveMenu,
  } = useMenuForm(menuId);

  const [isEditingMode, setIsEditingMode] = useState(isNewMenu);

  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    if (!isNewMenu) {
      const existingMenu = menus.find((m) => m.id === menuId);
      if (existingMenu) {
        setIsSoldOut(
          (existingMenu as any).isSoldOut ??
            (existingMenu as any).soldOut ??
            false,
        );
      }
    }
  }, [menus, menuId, isNewMenu]);

  const currentImageUrl =
    imageState.preview ||
    (imageState.original ? `${imageState.original}` : null);

  const isSaveDisabled = !formData.name || !formData.price || isSaving;

  const handleToggleSoldOut = async () => {
    const targetSoldOut = !isSoldOut;

    setIsSoldOut(targetSoldOut);

    const success = targetSoldOut
      ? await setMenuSoldOut(menuId)
      : await setMenuAvailable(menuId);

    if (!success) {
      setIsSoldOut(!targetSoldOut);
    }
  };

  const handleSave = async () => {
    const success = await saveMenu();
    if (success) {
      if (isNewMenu) navigate(ROUTES.STORE);
      else setIsEditingMode(false);
    }
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
        accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
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
              value={formData.name}
              limitHide
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <TextInput
              label="설명"
              value={formData.description}
              limitHide
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <TextInput
              label="가격"
              type="number"
              placeholder="메뉴 가격을 입력해주세요."
              limitHide
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
            <TextInput
              label="마진율"
              type="number"
              placeholder="메뉴 마진율을 입력해주세요."
              limitHide
              value={formData.marginRate}
              onChange={(e) => handleChange('marginRate', e.target.value)}
            />

            {!isNewMenu && (
              <div className="flex items-center justify-between rounded-xl bg-white p-5">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500-90 text-sm font-semibold">
                    품절 여부
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSoldOut}
                  disabled={isMenuLoading}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
                    isSoldOut ? 'bg-primary-300' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                      isSoldOut ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        ) : (
          // --- [조회 모드] ---
          <div className="flex flex-col gap-1">
            <h1 className="text-st-2 text-black">{formData.name}</h1>
            {formData.description && (
              <p className="text-b-1 text-gray-500">{formData.description}</p>
            )}
            <p className="text-st-2 mt-2 text-black">
              {Number(formData.price).toLocaleString()}원
            </p>
            <p className="text-st-2 text-primary-300 mt-2">
              <span className="font-medium">
                {isSoldOut ? ' 품절' : ' 판매 중'}
              </span>
            </p>
          </div>
        )}
        <BottomSpace />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 border-t border-gray-100 bg-white p-4">
        {isNewMenu ? (
          <>
            <CtaButton
              text="취소"
              color="gray"
              width="fit"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            />
            <CtaButton
              text="메뉴 추가하기"
              onClick={handleSave}
              className="flex-1"
              disabled={isSaveDisabled}
            />
          </>
        ) : (
          <>
            {!isEditingMode && (
              <DeleteConfirmModal
                title={'메뉴 삭제를 할까요 ?'}
                description={'메뉴 삭제 후에는 복구할 수 없어요.'}
                cancelButtonText={'취소'}
                confirmButtonText={'삭제하기'}
                onConfirm={() => {
                  deleteMenu(menuId);
                }}
              >
                <CtaButton
                  text="삭제"
                  radius="xl"
                  color="red"
                  width="fit"
                  disabled={isMenuLoading || isSaving}
                />
              </DeleteConfirmModal>
            )}
            <CtaButton
              text={isEditingMode ? '저장완료' : '수정하기'}
              onClick={() =>
                isEditingMode ? handleSave() : setIsEditingMode(true)
              }
              className="flex-1"
              disabled={isEditingMode && isSaveDisabled}
            />
          </>
        )}
      </footer>
    </BaseResponsiveLayout>
  );
}

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CancelIcon from '@/assets/icons/ic_circle_cancel.svg?react';
import CameraIcon from '@/assets/images/img_camera.svg?react';
import EmptyImage from '@/assets/images/img_empty_image.svg?react';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CtaButton from '../components/common/buttons/CtaButton';
import DeleteConfirmModal from '../components/common/modals/DeleteConfirmModal';
import { ROUTES } from '../constants/routes';
import { useMenu } from '../hooks/useMenu';

const IMAGE_PREFIX = import.meta.env.VITE_IMAGE_PREFIX;

export default function ManageMenuDetail() {
  const navigate = useNavigate();
  const {
    menus,
    createMenu,
    deleteMenuImage,
    fetchMenu,
    deleteMenu,
    updateMenu,
    updateMenuImage,
  } = useMenu();

  const menuId = Number(useParams().menuId);
  const isEditMode = menuId !== 0;
  const [isEditingMode, setIsEditingMode] = useState(false);

  const [menu, setMenu] = useState<string>(
    menus.find((menu) => menu.id === menuId)?.menu ?? '',
  );
  const [description, setDescription] = useState<string>(
    menus.find((menu) => menu.id === menuId)?.description ?? '',
  );
  const [price, setPrice] = useState<number | string>(
    menus.find((menu) => menu.id === menuId)?.price ?? '',
  );
  const [image, setImage] = useState<string | null>(
    menus.find((menu) => menu.id === menuId)?.image ?? null,
  );
  const [margin, setMargin] = useState<number | string>(
    menus.find((menu) => menu.id === menuId)?.margin ?? '',
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentImageUrl = () => {
    if (imagePreview) {
      return imagePreview;
    }
    if (image) {
      return `${IMAGE_PREFIX}${image}`;
    }
    return null;
  };

  const currentImage = getCurrentImageUrl();

  const handleUpdateMenu = async () => {
    await updateMenu(menuId, {
      menu,
      description,
      price: Number(price),
      margin: Number(margin),
    });

    if (imageFile) {
      await updateMenuImage(menuId, imageFile);
    }

    await fetchMenu();

    setIsEditingMode(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const success = await deleteMenuImage(menuId);
    if (success) {
      setImagePreview(null);
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateMenu = async () => {
    const newMenu = await createMenu({
      menu,
      description,
      price: Number(price),
      margin: Number(margin),
    });

    if (newMenu && imageFile) {
      await updateMenuImage(newMenu.id, imageFile);
    }
    navigate(ROUTES.STORE);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    setMenu(menus.find((menu) => menu.id === menuId)?.menu ?? '');
    setDescription(menus.find((menu) => menu.id === menuId)?.description ?? '');
    setPrice(menus.find((menu) => menu.id === menuId)?.price ?? '');
    setImage(menus.find((menu) => menu.id === menuId)?.image ?? null);
    setMargin(menus.find((menu) => menu.id === menuId)?.margin ?? '');
  }, [menus]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 사용자가 입력 필드를 완전히 비울 수 있도록 허용
    if (value === '') {
      setMargin('');
      return;
    }

    // 숫자 이외의 문자는 입력되지 않도록 방지
    if (!/^\d*$/.test(value)) {
      return;
    }

    const numValue = parseInt(value, 10);

    // 0 ~ 100 사이의 값으로 보정
    if (numValue > 100) {
      setMargin(100); // 100을 초과하면 100으로 고정
    } else {
      // 0 미만은 입력될 수 없으므로, 그 외의 경우는 그대로 설정
      // (parseInt가 '05' 같은 값을 5로 바꿔주므로 바로 state에 넣어도 안전)
      setMargin(numValue);
    }
  };

  const handlePriceBlur = () => {
    const numericValue = Number(price) || 0;
    setPrice(numericValue);
  };

  const handleMarginBlur = () => {
    if (margin === '') {
      setMargin(0);
    }
  };

  if (isEditMode) {
    return (
      <BaseResponsiveLayout>
        <Navigator
          left={<GoBackIcon />}
          onLeftPress={() => navigate(-1)}
          title="메뉴 상세"
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <main className="flex flex-grow flex-col">
          <div className="mb-2 flex w-full flex-col items-center gap-2 px-8">
            <div className="relative flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-gray-200 transition-all duration-200 hover:bg-gray-100">
              {isEditingMode ? (
                currentImage ? (
                  <>
                    <img
                      src={currentImage}
                      alt="미리보기"
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                    <CtaButton
                      onClick={handleButtonClick}
                      className="absolute right-4 bottom-4 shadow-md"
                      color="white"
                      width="fit"
                      size="small"
                      radius="xl"
                      text="이미지 변경"
                    />
                    <button
                      onClick={handleDeleteImage}
                      className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                      aria-label="이미지 삭제"
                    >
                      <CancelIcon />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleButtonClick}
                    className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl hover:bg-gray-100"
                  >
                    <CameraIcon className="h-12 w-12 text-gray-300" />
                    <span className="text-b-2 text-gray-400">이미지 추가</span>
                  </button>
                )
              ) : image ? (
                <img
                  src={`${IMAGE_PREFIX}${image}`}
                  alt="메뉴 이미지"
                  className="flex aspect-square w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 text-gray-400">
                  <EmptyImage className="h-30 w-30" />
                </div>
              )}
            </div>
          </div>
          {!isEditingMode ? (
            <>
              <h1 className="text-st-2 px-10">{menu}</h1>

              <p className="text-b-1 mb-2 px-10 text-gray-400">{description}</p>

              <p className="text-st-2 px-10 text-black">
                {Number(price).toLocaleString()}원
              </p>

              <p className="text-c-1 mt-4 px-10 text-gray-400">
                마진은 손님 메뉴판에 표시되지 않습니다
              </p>
              <p className="text-b-1 px-10">마진 {margin}%</p>
            </>
          ) : (
            <div className="flex flex-col gap-2 px-8">
              <TextInput
                label="메뉴"
                placeholder="메뉴 이름을 입력해주세요."
                limitHide
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
              />
              <TextInput
                label="설명"
                placeholder="메뉴 설명을 입력해주세요."
                limitHide
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextInput
                label="가격"
                placeholder="메뉴 가격을 입력해주세요."
                limitHide
                value={price}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
              />
              <TextInput
                label="마진율"
                placeholder="메뉴 마진율을 입력해주세요."
                limitHide
                value={margin}
                onChange={handleMarginChange}
                onBlur={handleMarginBlur}
              />
            </div>
          )}
          <BottomSpace />
        </main>

        <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 p-4">
          <DeleteConfirmModal
            title={'메뉴 삭제를 할까요 ?'}
            description={'메뉴 삭제 후에는 복구할 수 없어요.'}
            cancelButtonText={'취소'}
            confirmButtonText={'삭제하기'}
            onConfirm={() => {
              deleteMenu(menuId);
            }}
          >
            <CtaButton text="삭제하기" radius="xl" color="red" width="fit" />
          </DeleteConfirmModal>

          <div className="flex-1">
            <CtaButton
              text={isEditingMode ? '수정완료' : '수정하기'}
              radius="xl"
              onClick={() => {
                if (isEditingMode) {
                  setIsEditingMode(false);
                  handleUpdateMenu();
                } else {
                  setIsEditingMode(true);
                }
              }}
            />
          </div>
        </footer>
      </BaseResponsiveLayout>
    );
  }

  return (
    <BaseResponsiveLayout>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <Navigator
        left={<GoBackIcon />}
        center={<div className="text-st-2">메뉴 추가</div>}
        onLeftPress={() => navigate(-1)}
      />

      <main className="flex-grow space-y-6 p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex max-w-sm flex-col items-center justify-center gap-2 rounded-3xl border-2 border-gray-200 px-6 py-2 transition-all duration-200 hover:bg-gray-100">
            {imagePreview ? (
              <>
                <img
                  src={`${imagePreview}`}
                  alt="미리보기"
                  className="h-full w-full rounded-2xl object-cover"
                />
                <CtaButton
                  onClick={handleButtonClick}
                  className="absolute right-4 bottom-4 shadow-md"
                  color="white"
                  width="fit"
                  size="small"
                  radius="xl"
                  text="이미지 변경"
                />
                <button
                  onClick={handleImageCancel}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full"
                >
                  <CancelIcon />
                </button>
              </>
            ) : (
              <button
                onClick={handleButtonClick}
                className="flex h-full w-full flex-col items-center justify-center gap-2 hover:bg-gray-100"
              >
                <CameraIcon className="text-gray-300" />
                <span className="text-gray-400">0/1</span>
              </button>
            )}
          </div>
        </div>

        <TextInput
          label="메뉴"
          placeholder="메뉴 이름을 입력해주세요."
          limitHide
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
        />
        <TextInput
          label="설명"
          placeholder="메뉴 설명을 입력해주세요."
          limitHide
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextInput
          label="가격"
          placeholder="메뉴 가격을 입력해주세요."
          limitHide
          value={price}
          onChange={handlePriceChange}
          onBlur={handlePriceBlur}
        />
        <TextInput
          label="마진율"
          placeholder="메뉴 마진율을 입력해주세요."
          limitHide
          value={margin}
          onChange={handleMarginChange}
          onBlur={handleMarginBlur}
        />
        <BottomSpace />
      </main>

      <footer className="fixed right-0 bottom-0 left-0 flex justify-end gap-2 p-4">
        <div>
          <CtaButton
            text="취소"
            radius="xl"
            onClick={() => navigate(-1)}
            color="white"
            width="fit"
          />
        </div>

        <div className="flex-1">
          <CtaButton
            text="메뉴 추가하기"
            radius="xl"
            onClick={handleCreateMenu}
          />
        </div>
      </footer>
    </BaseResponsiveLayout>
  );
}

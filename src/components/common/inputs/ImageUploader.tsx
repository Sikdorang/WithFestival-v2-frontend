import CancelIcon from '@/assets/icons/ic_circle_cancel.svg?react';
import CameraIcon from '@/assets/images/img_camera.svg?react';
import EmptyImage from '@/assets/images/img_empty_image.svg?react';
import CtaButton from '../buttons/CtaButton';

interface Props {
  imageUrl: string | null;
  isEditing: boolean;
  onUploadClick: () => void;
  onClear: () => void;
}

export default function ImageUploader({
  imageUrl,
  isEditing,
  onUploadClick,
  onClear,
}: Props) {
  // 1. 조회 모드일 때
  if (!isEditing) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-transparent">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="메뉴 이미지"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-gray-100">
            <EmptyImage />
          </div>
        )}
      </div>
    );
  }

  // 2. 편집/추가 모드일 때
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-gray-200 transition-all duration-200 hover:bg-gray-100">
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="미리보기"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          <CtaButton
            onClick={onUploadClick}
            className="absolute right-4 bottom-4 shadow-md"
            color="white"
            size="small"
            radius="xl"
            text="이미지 변경"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          >
            <CancelIcon />
          </button>
        </>
      ) : (
        // aspect-square -> aspect-[4/3] 로 변경
        <button
          onClick={onUploadClick}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl hover:bg-gray-100"
        >
          <CameraIcon className="h-12 w-12 text-gray-300" />
          <span className="text-b-2 text-gray-400">이미지 추가</span>
        </button>
      )}
    </div>
  );
}

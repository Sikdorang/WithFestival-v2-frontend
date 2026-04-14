import EmptyImage from '@/assets/images/img_empty_image.svg?react';

const IMAGE_PREFIX = import.meta.env.VITE_IMAGE_PREFIX;

export default function MenuItem({
  name,
  price,
  image,
  onClick,
}: {
  name: string;
  price: number;
  image: string;
  onClick: () => void;
}) {
  return (
    <div
      className="flex w-full cursor-pointer items-start justify-between border-b border-gray-50 py-5 transition-colors active:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col gap-1 pr-4">
        <span className="text-[15px] font-medium text-[#8B95A1]">{name}</span>
        <span className="text-[18px] font-bold text-[#191F28]">
          {price.toLocaleString()}원
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#F2F4F6]">
          {image ? (
            <img
              src={`${IMAGE_PREFIX}${image}`}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <EmptyImage className="h-12 w-12 text-gray-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

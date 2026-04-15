"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function FestivalCarousel({
  title,
  data,
}: {
  title: string;
  data: any[];
}) {
  // 💡 Embla 훅 사용
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-16 w-full">
      {/* 제목 가운데 정렬 */}
      <h2 className="mb-6 text-center text-2xl font-bold text-[#11153F] md:text-3xl">
        {title}
      </h2>

      {/* 🌟 Embla Viewport */}
      <div
        className="overflow-hidden px-4 cursor-grab active:cursor-grabbing md:px-8"
        ref={emblaRef}
      >
        {/* 🌟 Embla Container */}
        <div className="flex gap-6">
          {/* 🌟 Embla Slide */}
          {data.map((fest) => (
            <div
              key={fest.id}
              className="group relative flex h-64 flex-[0_0_80%] shrink-0 flex-col overflow-hidden rounded-2xl bg-gray-200 shadow-sm transition-transform hover:-translate-y-1 md:h-80 md:flex-[0_0_calc(33.333%-16px)]"
            >
              {/* 💡 Next/Image 적용 영역 (마우스 드래그 충돌 방지용 pointer-events-none) */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src={fest.imgUrl}
                  alt={fest.name}
                  fill
                  priority // 메인 배너 역할을 하므로 LCP 최적화를 위해 추가를 권장합니다.
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 33vw"
                />
              </div>

              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 pointer-events-none group-hover:from-black/90" />

              {/* 텍스트 콘텐츠 */}
              <div className="relative z-20 mt-auto flex flex-col p-6 text-white pointer-events-none">
                <span className="mb-1 text-sm font-bold text-[#FFD43A] drop-shadow-md md:text-base">
                  {fest.univ}
                </span>
                <span className="mb-2 truncate text-xl font-bold drop-shadow-md md:text-2xl">
                  {fest.name}
                </span>
                <span className="text-xs font-medium text-gray-200 drop-shadow-md md:text-sm">
                  {fest.dates}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

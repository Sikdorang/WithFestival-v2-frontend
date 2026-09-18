"use client";

import { useState } from "react";

type Logo = {
  name: string;
  src?: string;
  scale?: number;
};

const LOGOS: Logo[] = [
  {
    name: "한양대학교",
    src: "/logos/hanyang.svg",
  },
  {
    name: "광운대학교",
    src: "/logos/kwangwoon.svg",
  },
  {
    name: "경희대학교",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOkaXdGRCHM6nHG7GCC3c2asWz4f1UvKrGQQ&s",
  },
  {
    name: "한성대학교",
    src: "https://www.hansung.ac.kr/sites/hansung/images/sub/img-ui-mark1.png",
  },
  {
    name: "숭실대학교",
    // No durable public logo asset in /public; text badge until one is added
  },
];

export default function LogoMarquee() {
  // Duplicate once so -50% → 0% loops seamlessly while scrolling right
  const loop = [...LOGOS, ...LOGOS];

  return (
    <section
      aria-label="협력 대학교 로고"
      className="relative w-full bg-white py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <div
          className="group relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          }}
        >
          <div className="logo-marquee-track">
            {loop.map((logo, i) => (
              <LogoItem key={`${logo.name}-${i}`} logo={logo} />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium tracking-[-0.01em] text-[#9b9da3] md:text-base">
          많은 대학교에서 축제랑을 사용했어요
        </p>
      </div>
    </section>
  );
}

function LogoItem({ logo }: { logo: Logo }) {
  const [broken, setBroken] = useState(false);

  if (!logo.src || broken) {
    return (
      <div className="flex h-10 w-32 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f3] text-xs font-medium text-[#9b9da3] md:h-12 md:w-40 md:text-sm">
        {logo.name}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external/partner marks; next/image not required here
    <img
      src={logo.src}
      alt={logo.name}
      onError={() => setBroken(true)}
      style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
      className="h-10 w-auto shrink-0 object-contain md:h-12"
    />
  );
}

"use client";

type Logo = {
  name: string;
  src: string;
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
    // 기존 gstatic 썸네일은 광운대 로고였음 → 경희대 시그니처로 교체
    src: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbjsDsi%2FbtqxXJM3JKe%2FAAAAAAAAAAAAAAAAAAAAAOVaIPr5GDZysS4XpCiaQb-Ae2GN8g8_Nk_rkGT_szYg%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Do%252F7JfDGM3%252Fc02GgLJg8oMFADJCA%253D",
  },
  {
    name: "한성대학교",
    src: "https://www.hansung.ac.kr/sites/hansung/images/sub/img-ui-mark1.png",
  },
  {
    name: "숭실대학교",
    src: "/logos/soongsil.svg",
  },
];

export default function LogoMarquee() {
  // Two identical halves so translateX(-50%) loops seamlessly
  const loop = [...LOGOS, ...LOGOS];

  return (
    <section
      aria-label="협력 대학교 로고"
      className="relative w-full bg-white py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="logo-marquee">
          <div className="logo-marquee__track">
            {loop.map((logo, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- partner marks; next/image not required
              <img
                key={`${logo.name}-${i}`}
                src={logo.src}
                alt={logo.name}
                draggable={false}
                style={
                  logo.scale ? { transform: `scale(${logo.scale})` } : undefined
                }
                className="h-10 w-auto shrink-0 object-contain md:h-12"
              />
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

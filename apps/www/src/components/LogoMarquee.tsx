"use client";

type Logo = {
  name: string;
  src?: string;
  scale?: number;
};

const LOGOS: Logo[] = [
  {
    name: "한양대학교",
    src: "https://ircv.hanyang.ac.kr/images/logopic/logo-hanyang.png",
  },
  {
    name: "협력 기업",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOkaXdGRCHM6nHG7GCC3c2asWz4f1UvKrGQQ&s",
  },
  {
    name: "협력 기업",
    src: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbjsDsi%2FbtqxXJM3JKe%2FAAAAAAAAAAAAAAAAAAAAAOVaIPr5GDZysS4XpCiaQb-Ae2GN8g8_Nk_rkGT_szYg%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3Do%252F7JfDGM3%252Fc02GgLJg8oMFADJCA%253D",
  },
  {
    name: "한성대학교",
    src: "https://www.hansung.ac.kr/sites/hansung/images/sub/img-ui-mark1.png",
  },
  {
    name: "숭실대학교",
    src: "https://blog.kakaocdn.net/dna/cF7Xzm/btsJVEL2N72/AAAAAAAAAAAAAAAAAAAAAOMxChVnDU3H1kOHjqFom6NFAvHq8eKeA3GZvOV7DtFE/%EC%88%AD%EC%8B%A4%EB%8C%80%ED%95%99%EA%B5%90_%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98_%EA%B0%80%EB%A1%9C_PNG.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=bPBc0UVqsuS9oo%2BEDBIlctEI75c%3D&attach=1&knm=img.png",
    scale: 0.7,
  },
];

export default function LogoMarquee() {
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
          <div className="marquee-track flex w-max items-center gap-12 md:gap-16">
            {loop.map((logo, i) => (
              <LogoItem key={`${logo.name}-${i}`} logo={logo} />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium tracking-[-0.01em] text-[#9b9da3] md:text-base">
          많은 대학교에서 축제랑을 사용했어요
        </p>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function LogoItem({ logo }: { logo: Logo }) {
  if (logo.src) {
    return (
      <img
        src={logo.src}
        alt={logo.name}
        style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
        className="h-10 w-auto shrink-0 object-contain md:h-12"
      />
    );
  }

  return (
    <div className="flex h-10 w-32 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f3] text-xs font-medium text-[#9b9da3] md:h-12 md:w-40 md:text-sm">
      {logo.name}
    </div>
  );
}

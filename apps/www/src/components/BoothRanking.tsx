"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const RANKING_DATA = [
  {
    rank: 1,
    name: "주점은 어우야",
    university: "광운대",
    affiliation: "인공지능융합대학 총학생회",
    revenue: "1,542,000",
    logoUrl: "/icons/univ/kwangwoon.png",
  },
  {
    rank: 2,
    name: "일렉트로닉 파전",
    university: "한양대",
    affiliation: "중앙 댄스동아리 꾼",
    revenue: "1,410,000",
    logoUrl: "/icons/univ/hanyang.png",
  },
  {
    rank: 3,
    name: "경영인의 밤",
    university: "서울과기대",
    affiliation: "상경대학 연합",
    revenue: "1,285,000",
    logoUrl: "/icons/univ/seoul_national_science.png",
  },
  {
    rank: 4,
    name: "건축학개론 주막",
    university: "홍익대",
    affiliation: "건축도시대학 총학생회",
    revenue: "1,120,000",
    logoUrl: "/logos/hongik.png",
  },
  {
    rank: 5,
    name: "체대생의 불막창",
    university: "고려대",
    affiliation: "사범대학 체육교육과 학생회",
    revenue: "1,095,000",
    logoUrl: "/logos/korea.png",
  },
  {
    rank: 6,
    name: "화끈한 화학과",
    university: "서강대",
    affiliation: "자연과학부 연합",
    revenue: "980,000",
    logoUrl: "/logos/sogang.png",
  },
  {
    rank: 7,
    name: "미대오빠 칵테일",
    university: "서울대",
    affiliation: "미술대학 조소과 학생회",
    revenue: "840,000",
    logoUrl: "/logos/snu.png",
  },
];

export default function BoothRankingPage() {
  const topThree = RANKING_DATA.slice(0, 3);
  const others = RANKING_DATA.slice(3);

  const podiumOrder = [topThree[1], topThree[0], topThree[2]];

  return (
    <main className="min-h-screen bg-white px-4 py-20 pb-24 md:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-primary-300 md:text-4xl">
          실시간 대학 부스 랭킹
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          지금 가장 핫한 대학 부스는?
        </p>
      </div>

      {/* 🌟 명예의 전당 (Top 3 시상대) */}
      <div className="mx-auto mb-16 flex max-w-3xl items-end justify-center gap-2 md:gap-6">
        {podiumOrder.map((booth, index) => {
          const isFirst = index === 1;
          const isSecond = index === 0;
          const heightClass = isFirst
            ? "h-48 md:h-56"
            : isSecond
              ? "h-36 md:h-44"
              : "h-28 md:h-36";
          const bgColor = isFirst ? "bg-[#FFD43A]" : "bg-white";
          const textColor = isFirst ? "text-[#11153F]" : "text-gray-800";

          return (
            <motion.div
              key={booth.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: isFirst ? 0.2 : isSecond ? 0.4 : 0.6,
                type: "spring",
              }}
              className="flex flex-1 flex-col items-center"
            >
              {/* 대학교 로고 & 매출액 */}
              <div className="mb-3 flex flex-col items-center">
                <div className="relative mb-2 h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm md:h-16 md:w-16">
                  <Image
                    src={booth.logoUrl}
                    alt={booth.university}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 48px, 64px"
                  />
                </div>
                <span className="mt-1 text-xs font-bold text-gray-600 md:text-sm">
                  {booth.revenue}원
                </span>
              </div>

              {/* 시상대 블록 */}
              <div
                className={`flex w-full flex-col items-center justify-start rounded-t-2xl border border-gray-100 p-3 shadow-lg ${heightClass} ${bgColor}`}
              >
                <span className={`text-2xl font-black opacity-30 ${textColor}`}>
                  {booth.rank}
                </span>

                {/* 부스 이름 및 소속 */}
                <div className="mt-2 flex flex-col items-center justify-center">
                  <span
                    className={`text-center text-sm font-bold leading-tight md:text-base ${textColor}`}
                  >
                    {booth.name}
                  </span>
                  <span
                    className={`mt-1 break-keep text-center text-[10px] font-medium md:text-xs ${isFirst ? "text-[#11153F]/70" : "text-gray-500"}`}
                  >
                    {booth.university} {booth.affiliation}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🌟 4위 이하 리스트 */}
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-3"
        >
          {others.map((booth) => (
            <div
              key={booth.name}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(17,21,63,0.04)] transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 font-black text-gray-400">
                  {booth.rank}
                </div>

                {/* 리스트 내 대학교 로고 */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                  <Image
                    src={booth.logoUrl}
                    alt={booth.university}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                {/* 부스 이름 및 소속 */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#11153F] md:text-base">
                    {booth.name}
                  </span>
                  <span className="mt-0.5 text-xs text-gray-500 md:text-sm">
                    {booth.university} {booth.affiliation}
                  </span>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-[#FFD43A] md:text-base">
                {booth.revenue}원
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

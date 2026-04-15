"use client";

import { motion } from "framer-motion";

export default function About() {
  // 🌟 애니메이션 설계도 (Variants)
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
      },
    },
  };

  return (
    <section
      id="about"
      className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-white py-24 md:py-32"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="text-center z-10 px-6 max-w-7xl mx-auto"
      >
        {/* 타이틀 영역 */}
        <div className="overflow-hidden mb-5">
          <motion.h2
            variants={item}
            className="text-3xl md:text-5xl font-bold text-[#11153F] tracking-tighter"
          >
            복잡한 축제 운영은 <span className="text-[#FFBF0B]">가볍게</span>,
          </motion.h2>
        </div>

        <div className="overflow-hidden mb-12">
          <motion.h2
            variants={item}
            className="text-3xl md:text-5xl font-bold text-[#11153F] tracking-tighter"
          >
            참여의 즐거움은 더 크게.
          </motion.h2>
        </div>

        {/* 서브 텍스트 */}
        <motion.p
          variants={item}
          className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed whitespace-pre-line"
        >
          축제랑은 총학생회와 축제 기획단의 끝없는 고민과 밤샘에서 출발했습니다.
          <br />
          실시간 부스 웨이팅부터 방문객의 텐션을 올리는 실시간 랭킹 보드까지.
          <br />
          가장 스마트한 운영 솔루션으로 모두가 온전히 즐길 수 있는 진짜 축제를
          만듭니다.
        </motion.p>
      </motion.div>

      {/* 배경 장식 (축제랑 옐로우 톤의 은은한 글로우) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD43A]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}

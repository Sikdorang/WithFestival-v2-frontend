"use client";

import { motion } from "framer-motion";

export default function Hero() {
  // 🌟 애니메이션 설계도 (Variants)
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    // 💡 축제랑 배경 컬러(#F8F9FB) 적용
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center z-10 px-6"
      >
        {/* 타이틀 영역 */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            variants={item}
            // 💡 딥 네이비(#11153F) 텍스트 컬러 적용
            className="text-5xl md:text-8xl font-bold tracking-tighter text-[#11153F]"
          >
            축제를 <span className="text-[#FFD43A]">더 재미있게,</span>
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-12">
          <motion.h1
            variants={item}
            className="text-5xl md:text-8xl font-bold tracking-tighter text-[#11153F]"
          >
            추억이 더 <span className="text-[#FFD43A]">빛이나도록 !</span>
          </motion.h1>
        </div>

        {/* 서브 텍스트 */}
        <motion.p
          variants={item}
          className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed"
        >
          실시간 부스 예약부터 주문, 인터랙티브 테이블 게임까지.
          <br />
          축제랑과 더 행복한 대학 생활의 추억을 함께해요.
        </motion.p>
      </motion.div>

      {/* 배경 장식 (축제랑 옐로우 톤의 은은한 백그라운드 글로우) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD43A]/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}

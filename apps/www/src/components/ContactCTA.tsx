"use client";

import { motion } from "framer-motion";

export default function ContactCTA() {
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
      id="contact-cta"
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
            성공적인 축제의 시작,
          </motion.h2>
        </div>

        <div className="overflow-hidden mb-12">
          <motion.h2
            variants={item}
            className="text-3xl md:text-5xl font-bold text-[#11153F] tracking-tighter"
          >
            <span className="text-[#FFBF0B]">축제랑</span>과 함께 완성하세요.
          </motion.h2>
        </div>

        {/* 서브 텍스트 */}
        <motion.p
          variants={item}
          className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed whitespace-pre-line"
        >
          도입 견적부터 맞춤형 기능 개발 상담까지.
          <br />
          기획단의 무거운 짐을 덜고 추억을 만들어드립니다 !
          <br />
          지금 바로 문의하고 가장 스마트한 축제를 준비해 보세요.
        </motion.p>

        {/* 액션 버튼 */}
        <motion.div variants={item}>
          <a
            href="mailto:info@u.lento25@gmail.com"
            className="inline-flex items-center justify-center rounded-2xl bg-[#11153F] px-10 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 md:text-lg"
          >
            도입 문의하기
          </a>
        </motion.div>
      </motion.div>

      {/* 배경 장식 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD43A]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
}

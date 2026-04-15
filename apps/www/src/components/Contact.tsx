"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "u.lento25@gmail.com";

  // 이메일 복사 함수
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-16">
        {/* 🌟 명확하고 신뢰감을 주는 헤드라인 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-[#11153F] mb-6 tracking-tighter"
        >
          성공적인 축제를 위한 첫걸음, <br className="md:hidden" />
          <span className="text-[#FFBF0B]">축제랑이 함께합니다.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg text-gray-600 break-keep leading-relaxed"
        >
          솔루션 도입 견적부터 맞춤형 기능 개발, 제휴 제안까지
          <br className="hidden md:block" />
          궁금한 점을 남겨주시면 담당자가 빠르게 안내해 드리겠습니다.
        </motion.p>
      </div>

      {/* 🌟 이메일 카드 섹션 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        // 브랜드 시그니처 컬러를 활용한 카드 디자인
        className="bg-[#FFF9E6] rounded-3xl p-8 md:p-12 border border-[#FFD43A]/30 text-center relative overflow-hidden shadow-sm"
      >
        <div className="relative z-10">
          <p className="text-sm font-bold text-[#FFBF0B] mb-2 uppercase tracking-widest">
            Official Email
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#11153F] mb-8 selection:bg-[#FFD43A]/50">
            {email}
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* 메일 보내기 버튼 (딥 네이비로 무게감 부여) */}
            <a
              href={`mailto:${email}`}
              className="px-8 py-4 bg-[#11153F] text-white rounded-2xl text-sm md:text-base font-bold hover:bg-[#11153F]/80 transition-all shadow-md"
            >
              메일 보내기
            </a>

            {/* 주소 복사하기 버튼 */}
            <button
              onClick={handleCopy}
              className={`px-8 py-4 rounded-2xl text-sm md:text-base font-bold border-2 transition-all flex items-center justify-center gap-2
                ${
                  copied
                    ? // 복사 완료 시 초록색 대신 딥 네이비로 긍정 피드백
                      "bg-[#11153F] border-[#11153F] text-white"
                    : "bg-white border-gray-200 text-gray-800 hover:border-[#11153F] hover:text-[#11153F]"
                }`}
            >
              {copied ? "복사 완료! ✨" : "이메일 주소 복사"}
            </button>
          </div>
        </div>

        {/* 배경 장식 원 (축제랑 옐로우) */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFD43A]/30 rounded-full blur-3xl -z-0 pointer-events-none" />
      </motion.div>

      {/* 🌟 추가 안내 사항 (B2B 성격에 맞는 폼 안내) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-sm md:text-base text-gray-500 space-y-2"
      >
        <p>평균적으로 영업일 기준 1~2일 내에 답변을 드리고 있습니다.</p>
        <p>
          문의 시{" "}
          <strong className="text-gray-700">소속(학교/학과)과 연락처</strong>를
          남겨주시면 더욱 정확하고 빠른 상담이 가능합니다.
        </p>
      </motion.div>
    </div>
  );
}

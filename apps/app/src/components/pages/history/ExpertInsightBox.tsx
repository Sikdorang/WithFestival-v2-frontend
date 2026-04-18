'use client';

import { motion } from 'framer-motion';

interface ExpertInsightProps {
  insightMessage?: React.ReactNode;
  tags?: string[];
}

export default function ExpertInsightBox({
  insightMessage = (
    <>
      현재 <strong>7~9시 웨이팅 이탈</strong>이 발생하고 있어요.
      <br />
      조리가 빠른 <strong>간편 안주</strong>를 추천해 테이블 회전율을
      높여보세요.
    </>
  ),
  tags = ['웨이팅 이탈률 분석', '회전율 개선'],
}: ExpertInsightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full max-w-2xl overflow-hidden rounded-3xl bg-[#F0F5FF] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] md:p-8"
    >
      <div className="flex flex-col gap-4">
        {/* 🌟 헤더 영역 */}
        <div className="flex items-center gap-2 text-[#1C58D9]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E1EAFE]">
            <span className="text-lg">💡</span>
          </div>
          <span className="text-sm font-extrabold tracking-tight md:text-base">
            부스 전문가 한마디
          </span>
        </div>

        {/* 📝 짧아진 메세지 영역 */}
        <p className="text-base leading-relaxed font-medium break-keep text-[#11153F] md:text-lg">
          {insightMessage}
        </p>

        {/* 🏷️ 데이터 근거 태그 */}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#1C58D9] shadow-sm"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

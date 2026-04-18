"use client";

import { motion } from "framer-motion";
// import Image from "next/image"; // 실제 이미지 적용 시 주석 해제

// 💡 새로운 4가지 기능으로 업데이트된 모킹 데이터
const FEATURES = [
  {
    id: "qr-order",
    title: "QR 메뉴판으로 주문 관리",
    description:
      "테이블에 비치된 QR코드 하나로 방문객이 직접 메뉴를 확인하고 주문해요. 바쁜 축제 현장에서 주문 누락과 대기 시간을 확 줄여줍니다.",
    bgColor: "bg-[#F8F9FB]",
    iconPlaceholder: "📱 QR 메뉴판 일러스트",
  },
  {
    id: "digital-reservation",
    title: "손쉬운 디지털 예약 관리",
    description:
      "번거로운 종이 명부 대신 스마트폰으로 웨이팅을 관리하세요. 입장 순서가 되면 고객의 메시지로 바로 알려드려요!",
    bgColor: "bg-primary-300-10",
    iconPlaceholder: "🗓️ 웨이팅 명부 일러스트",
  },
  {
    id: "love-alarm",
    title: "좋아하면 울리는 기능",
    description:
      "마음에 드는 테이블에 호감을 표현하거나, 합석을 제안해 보세요. 캠퍼스 축제만의 두근거리는 낭만과 재미를 더해줄거에요.",
    bgColor: "bg-primary-300-10", // 로맨틱/재미 요소를 강조하기 위해 따뜻한 옐로우 톤 적용
    iconPlaceholder: "🔔 하트 알림 일러스트",
  },
  {
    id: "ai-management",
    title: "AI 자동 메뉴판 & 부스 관리",
    description:
      "판매할 메뉴 이름만 입력하면 AI가 먹음직스러운 설명과 메뉴판을 자동으로 완성해 줘요. 복잡한 부스 세팅도 1분이면 끝납니다.",
    bgColor: "bg-[#F8F9FB]",
    iconPlaceholder: "✨ AI 대시보드 일러스트",
  },
];

export default function FeaturePromotion() {
  return (
    <section className="w-full bg-white px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* 🌟 타이틀 영역 */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#11153F] md:text-4xl lg:text-5xl">
            이런 축제, 이런 행사에
            <br className="hidden md:block" /> 딱이에요
          </h2>
        </div>

        {/* 🌟 카드 그리드 영역 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[32px] ${feature.bgColor} p-8 md:min-h-[400px] md:p-10`}
            >
              {/* 텍스트 콘텐츠 */}
              <div className="relative z-10 flex flex-col">
                <h3 className="mb-3 text-2xl font-bold text-[#11153F] md:text-3xl">
                  {feature.title}
                </h3>
                <p className="max-w-[85%] break-keep text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                  {feature.description}
                </p>
              </div>

              {/* 일러스트/이미지 영역 (우측 하단 배치) */}
              <div className="absolute -bottom-8 -right-8 flex h-56 w-56 items-center justify-center rounded-tl-3xl md:h-72 md:w-72">
                {/* 💡 실제 디자인 에셋이 준비되면 아래 코드로 교체하세요.
                  <Image 
                    src={`/images/features/${feature.id}.png`} 
                    alt={feature.title} 
                    fill 
                    className="object-contain drop-shadow-xl" 
                  /> 
                */}
                <div className="flex h-full w-full items-center justify-center bg-gray-200/50 text-sm font-bold text-gray-400 rounded-tl-[32px]">
                  {feature.iconPlaceholder}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

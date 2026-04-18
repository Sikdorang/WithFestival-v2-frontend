"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// 💡 익명화 및 정제된 도입 사례 데이터
const CASES = [
  {
    id: "case-1",
    univ: "K대학교",
    eventName: "가을 축제 주점",
    date: "2025. 09",
    title: "수백 명의 인파 속에서도 흔들림 없는 주문 처리",
    description:
      "방문객은 자리에 앉아 QR코드로 메뉴를 담고 이체합니다. 운영진은 태블릿 하나로 주문과 이체 내역을 확인하고 즉시 조리를 시작하죠. 특히 '번호팅' 같은 주점만의 특별한 이벤트를 메뉴판에 녹여내어 방문객들의 폭발적인 호응을 얻었습니다.",
    tags: ["QR 전자메뉴판", "번호팅 이벤트 연동", "실시간 조리 관리"],
    imageUrl: "/images/cases/img_festival_2.png",
  },
  {
    id: "case-2",
    univ: "G대학교",
    eventName: "동아리의 밤 연합 부스",
    date: "2025. 09",
    title: "여러 단체가 모여도 정산과 관리는 하나처럼 매끄럽게",
    description:
      "산악부 등 여러 동아리가 연합하여 운영하는 복잡한 환경. 수기 장부나 종이 메뉴판 없이 스마트폰만으로 주문을 완벽하게 통제했습니다. 선불 이체 확인부터 서빙 알림까지, 최소한의 인력으로 운영 효율을 극대화한 성공적인 사례입니다.",
    tags: ["연합 부스 운영", "선불 결제 자동화", "페이퍼리스"],
    imageUrl: "/images/cases/img_festival_1.jpeg",
  },
];

export default function FestivalCaseStudy() {
  return (
    <section className="w-full bg-white px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* 🌟 헤더 영역 */}
        <div className="mb-16 text-center md:mb-24">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#11153F] md:text-5xl">
            이미 다른 대학에서
            <br className="hidden md:block" />
            <span className="text-[#FFBF0B]">놀라운 변화</span>를 경험했어요
          </h2>
        </div>

        {/* 🌟 도입 사례 리스트 (지그재그 카드 레이아웃) */}
        <div className="flex flex-col gap-16 md:gap-24">
          {CASES.map((item, index) => {
            // 💡 짝수/홀수 인덱스에 따라 좌우 반전 여부 결정
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                // 모바일은 flex-col(위아래), 데스크톱은 짝/홀수에 따라 flex-row 또는 flex-row-reverse(좌우 반전)
                className={`flex flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* 📸 대형 이미지 영역 */}
                <div className="relative h-64 w-full shrink-0 bg-gray-200 md:h-auto md:w-1/2">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.univ} ${item.eventName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  <div className="absolute left-6 top-6 rounded-full bg-black/40 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-md">
                    {item.date}
                  </div>
                </div>

                {/* 📝 텍스트 콘텐츠 영역 */}
                <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#FFBF0B] md:text-base">
                    <span>{item.univ}</span>
                    <span className="h-3 w-[1px] bg-gray-300" />
                    <span>{item.eventName}</span>
                  </div>

                  <h3 className="mb-4 break-keep text-2xl font-bold leading-tight text-[#11153F] md:text-3xl lg:text-4xl">
                    {item.title}
                  </h3>

                  <p className="mb-8 break-keep text-base leading-relaxed text-gray-500 md:text-lg">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-xl border border-gray-100 bg-[#F8F9FB] px-3 py-1.5 text-sm font-bold text-gray-600"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

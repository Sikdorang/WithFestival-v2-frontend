"use client";

import { motion } from "framer-motion";

export default function FrequentAskedQuestions() {
  const faqs = [
    // 1. 서비스 도입 및 운영 관련
    {
      q: "축제랑은 어떤 서비스인가요?",
      a: "축제랑은 대학 축제의 부스 예약, 실시간 웨이팅, 주문 내역 관리부터 방문객들의 텐션을 높이는 실시간 부스 랭킹까지 제공하는 '올인원 스마트 축제 운영 솔루션'입니다.",
    },
    {
      q: "총학생회나 축제 기획단만 도입할 수 있나요?",
      a: "아닙니다. 총학생회 차원의 전체 축제 도입은 물론, 개별 학과 주점이나 동아리 부스 단위로도 서비스 도입 및 사용이 가능합니다.",
    },
    {
      q: "부스 운영을 위한 기기(포스기, 태블릿)가 별도로 필요한가요?",
      a: "아니요, 별도의 장비 렌탈 없이 운영진이 기존에 보유하신 스마트폰이나 태블릿 웹 브라우저만으로도 완벽하게 관리자 기능을 이용하실 수 있습니다.",
    },

    // 2. 방문객(B2C) 이용 관련
    {
      q: "부스 방문객들도 앱을 설치해야 하나요?",
      a: "방문객은 별도의 앱 설치가 전혀 필요 없습니다. 부스 입구 또는 테이블에 비치된 QR 코드를 스마트폰 카메라로 스캔하면 모바일 웹에서 즉시 웨이팅 등록 및 주문이 가능합니다.",
    },
    {
      q: "실시간 대박 부스 랭킹은 어떻게 산정되나요?",
      a: "각 부스의 포스(POS) 시스템 또는 모바일 주문에서 발생하는 '실시간 누적 주문액(매출)'을 기준으로 자동 집계되며, 일정 시간 단위로 랭킹 보드에 투명하게 반영됩니다.",
    },

    // 3. 결제 및 기타
    {
      q: "서비스 도입 비용은 어떻게 되나요?",
      a: "도입 규모(단일 부스, 학과 연합, 전체 축제 등)와 필요 기능에 따라 유연한 맞춤형 요금제가 적용됩니다. 상단의 '도입 문의하기'를 통해 연락해주시면 예산에 맞춘 최적의 견적을 안내해 드립니다.",
    },
    {
      q: "축제 중 시스템에 문제가 생기면 어떻게 하나요?",
      a: "축제 기간 동안에는 긴급 대응 CS팀이 상시 대기하며, 문제 발생 시 즉각적인 원격 지원을 통해 운영에 차질이 없도록 밀착 지원합니다.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      {/* 🌟 헤더 영역 */}
      <div className="text-center mt-4 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-[#11153F] mb-4 tracking-tighter"
        >
          FAQ
        </motion.h2>
      </div>

      {/* 🌟 FAQ 아코디언 리스트 */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details key={index} className="group border-b border-gray-200 pb-4">
            <summary className="flex justify-between items-center cursor-pointer list-none pt-4 pb-2 px-2">
              <span className="text-st-2 text-gray-800 transition-colors group-open:text-[#11153F] group-open:font-bold">
                {faq.q}
              </span>
              <span className="text-gray-400 transition-transform duration-300 group-open:rotate-180 group-open:text-[#FFBF0B]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>

            {/* 답변 영역 */}
            <div className="bg-[#F8F9FB] border border-gray-100 p-5 rounded-xl mt-3 ml-2 mr-2">
              <p className="text-b-2 text-gray-600 leading-relaxed whitespace-pre-line">
                {faq.a}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* 🌟 하단 법적/운영 고지사항 */}
      <div className="mt-16 p-6 bg-[#FFF9E6] border border-[#FFD43A]/30 rounded-xl">
        <p className="text-c-1 text-[#11153F]/80 leading-relaxed">
          <span className="text-[#FFBF0B] font-bold text-sm mr-1">
            ※ 유의사항:
          </span>
          축제랑은 대학 축제 운영을 돕는 스마트 플랫폼입니다. 각 부스 내에서
          발생하는 주류 판매, 위생 관리 및 실 결제 과정에 대한 법적 권한과
          책임은 해당 부스를 운영하는 주체(학과, 학생회 등)에게 있습니다.
        </p>
      </div>
    </div>
  );
}

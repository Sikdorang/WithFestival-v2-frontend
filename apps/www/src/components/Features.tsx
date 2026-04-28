"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon";
import { cn } from "@/lib/utils";

type FeatureRowProps = {
  eyebrowIcon: string;
  eyebrow: string;
  title: string;
  description: string;
  mock: React.ReactNode;
  reverse?: boolean;
};

export default function Features() {
  return (
    <section className="relative w-full bg-[#f7f8fa] py-24 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 md:h-40"
        style={{
          background:
            "linear-gradient(to bottom, #ffffff 0%, rgba(247,248,250,0) 100%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-3 md:gap-4">
          <span className="text-base font-bold tracking-[-0.01em] text-[#ffb60b] md:text-xl">
            주문
          </span>
          <h2 className="text-[26px] font-bold leading-[1.55] tracking-[-0.01em] text-[#292a2e] md:text-[40px]">
            간편하고 체계적으로,
            <br />
            주문을 더욱 편리하게 받아볼까요?
          </h2>
        </div>

        <div className="mt-24 flex flex-col gap-24 md:mt-40 md:gap-40">
          <FeatureRow
            eyebrowIcon="check_circle"
            eyebrow="입금확인"
            title={`등록한 계좌에 입금자명과 금액을${"\n"}확인하고 입금확인을 눌러요`}
            description="주문이 들어오면 입금자명과 금액을 한 번에 확인하고 버튼을 눌러주세요. 운영진 모두에게 입금 상태가 즉시 동기화돼요."
            mock={<MockDepositConfirm />}
          />
          <FeatureRow
            eyebrowIcon="restaurant"
            eyebrow="조리 완료"
            title={`송금이 확인되면${"\n"}바로 조리를 시작해요`}
            description="입금 확인을 누른 메뉴는 송금 완료로 넘어와요. 조리를 완료했다면 조리 완료 버튼을 눌러주세요."
            mock={<MockOrderFlow />}
            reverse
          />
        </div>

        <div className="mt-32 md:mt-48">
          <div className="flex flex-col items-center gap-3 text-center md:gap-4">
            <span className="text-base font-bold tracking-[-0.01em] text-[#ffb60b] md:text-xl">
              관리하기
            </span>
            <h3 className="text-[26px] font-bold leading-[1.55] tracking-[-0.01em] text-[#292a2e] md:text-[36px]">
              부스를 관리하고
              <br />
              메뉴를 등록해봐요
            </h3>
          </div>

          <div className="relative mt-12 flex justify-center md:mt-20">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 6, ease: "easeOut" }}
              className="absolute top-[180px] hidden max-w-[180px] text-base font-semibold leading-[1.7] text-[#5f616a] lg:block"
              style={{ right: "calc(50% + 240px)" }}
            >
              메뉴추가 버튼을 통해
              <br />
              메뉴를 등록하고 편집해봐요
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              className="absolute top-[60px] hidden max-w-[200px] text-base font-semibold leading-[1.7] text-[#5f616a] lg:block"
              style={{ left: "calc(50% + 240px)" }}
            >
              부스 기본정보에
              <br />
              부스 이름, 계좌번호 등
              <br />
              필요한 정보를 입력해요
            </motion.p>
            <PhoneMockup>
              <MockStoreManagement />
            </PhoneMockup>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center gap-5 md:mt-32 md:gap-6">
          <div className="flex items-end gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-[#c4c6cc] md:h-2.5 md:w-2.5"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <p className="text-base leading-[1.7] text-[#7b7d85] md:text-xl">
            더 많은 기능들이 축제랑에 존재해요
          </p>
        </div>

        <div className="mt-24 flex flex-col items-center text-center md:mt-32">
          <img
            src="/cta-illustration.svg"
            alt=""
            aria-hidden
            className="mb-0 w-full max-w-[240px] md:mb-2 md:max-w-[340px]"
          />
          <h3 className="text-[26px] font-bold leading-[1.25] tracking-[-0.01em] text-[#292a2e] md:text-[40px] md:leading-[1.2]">
            주점 운영도
            <br />
            축제랑과 함께,
          </h3>
          <p className="mt-3 text-base leading-[1.55] text-[#5f616a] md:mt-4 md:text-lg">
            대학 축제 주점을 시작하시나요?
            <br />
            주점의 시작부터 관리까지
            <br />
            축제랑이 함께 도와드릴게요.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  eyebrowIcon,
  eyebrow,
  title,
  description,
  mock,
  reverse,
}: FeatureRowProps) {
  return (
    <div
      className={`grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-20 ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      <div className="flex flex-col gap-4 [direction:ltr] md:gap-5">
        <span className="flex items-center gap-1.5 text-sm font-bold tracking-[-0.01em] text-[#ffb60b] md:text-base">
          <Icon name={eyebrowIcon} size={18} weight={700} filled />
          {eyebrow}
        </span>
        <h3 className="whitespace-pre-line text-[26px] font-bold leading-[1.55] tracking-[-0.02em] text-[#36383e] md:text-[36px]">
          {title}
        </h3>
        <p className="max-w-md text-sm leading-[1.7] text-[#5f616a] md:text-base">
          {description}
        </p>
      </div>
      <div className="flex justify-center [direction:ltr]">{mock}</div>
    </div>
  );
}

function MockDepositConfirm() {
  return (
    <div className="flex w-full max-w-sm flex-col items-stretch gap-5">
      <div className="self-center">
        <div className="relative inline-flex rounded-2xl bg-[#e5e7eb] p-1">
          <span className="absolute top-1 left-1 h-10 w-32 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]" />
          <span className="relative z-10 flex h-10 w-32 items-center justify-center text-sm font-semibold text-[#292a2e]">
            송금 전
          </span>
          <span className="relative z-10 flex h-10 w-32 items-center justify-center text-sm text-[#9b9da3]">
            송금 완료
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-7 shadow-[0_12px_40px_rgba(54,56,62,0.08)]">
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-[#f0f1f3] px-3 py-1.5 text-sm font-semibold text-[#292a2e]">
          테이블 번호 1
        </span>
        <span className="text-sm text-[#9b9da3]">
          주문번호 001 · 2026-04-10 17:46
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-[#9b9da3]">
        <span>메뉴명</span>
        <span>수량</span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <span className="text-base font-bold text-[#292a2e]">
            매콤달콤 떡볶이
          </span>
          <div className="text-right">
            <div className="text-base font-bold text-[#292a2e]">1개</div>
            <div className="text-sm text-[#9b9da3]">4,500원</div>
          </div>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-base font-bold text-[#292a2e]">
            모짜렐라 듬뿍 치즈피자
          </span>
          <div className="text-right">
            <div className="text-base font-bold text-[#292a2e]">1개</div>
            <div className="text-sm text-[#9b9da3]">7,000원</div>
          </div>
        </div>
      </div>

      <div className="my-6 h-px bg-[#e5e6e8]" />

      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-[#292a2e]">
          입금자명: 김축제
        </span>
        <span className="text-base font-bold text-[#292a2e]">11,500원</span>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className="rounded-2xl bg-[#fde8e8] px-6 py-3.5 text-sm font-semibold text-[#dc2626]"
        >
          취소하기
        </button>
        <div className="relative flex-1">
          <motion.button
            type="button"
            className="w-full rounded-2xl bg-[#ffd761] px-6 py-3.5 text-sm font-semibold text-[#292a2e]"
            animate={{
              scale: [1, 0.94, 1],
              backgroundColor: ["#ffd761", "#f0b90b", "#ffd761"],
            }}
            transition={{
              duration: 1.4,
              times: [0, 0.45, 0.9],
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeInOut",
            }}
          >
            입금 확인
          </motion.button>

          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            animate={{
              scale: [0, 0.7, 1.4],
              opacity: [0, 0.65, 0],
            }}
            transition={{
              duration: 1.4,
              times: [0.2, 0.45, 1],
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeOut",
            }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#292a2e] shadow-[0_0_0_3px_rgba(255,255,255,0.7)]"
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.4,
              times: [0.25, 0.4, 0.55, 0.75],
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeOut",
            }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

function MockOrderFlow() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      timers.push(setTimeout(() => setStep(1), 1800));
      timers.push(setTimeout(() => setStep(2), 2400));
      timers.push(setTimeout(() => setStep(3), 4200));
      timers.push(setTimeout(() => setStep(0), 5800));
      timers.push(setTimeout(run, 6300));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  const sentDone = step >= 1;
  const showCard = step >= 2;
  const showSegmentTouch = step === 0;
  const showCookTouch = step === 2;
  const cookPress = step === 3;

  return (
    <div className="flex w-full max-w-sm flex-col items-stretch gap-5">
      <div className="relative self-center">
        <div className="relative inline-flex rounded-2xl bg-[#e5e7eb] p-1">
          <motion.div
            className="absolute top-1 left-1 h-10 w-32 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            animate={{ x: sentDone ? 128 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          />
          <span
            className={`relative z-10 flex h-10 w-32 items-center justify-center text-sm transition-colors ${
              sentDone ? "text-[#9b9da3]" : "font-semibold text-[#292a2e]"
            }`}
          >
            송금 전
          </span>
          <span
            className={`relative z-10 flex h-10 w-32 items-center justify-center text-sm transition-colors ${
              sentDone ? "font-semibold text-[#292a2e]" : "text-[#9b9da3]"
            }`}
          >
            송금 완료
          </span>
        </div>

        {showSegmentTouch && (
          <TouchPoint className="right-[68px] top-1/2" />
        )}
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: showCard ? 1 : 0, y: showCard ? 0 : 16 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-3xl bg-white p-7 shadow-[0_12px_40px_rgba(54,56,62,0.08)]"
      >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-[#f0f1f3] px-3 py-1.5 text-sm font-semibold text-[#292a2e]">
                테이블 번호 1
              </span>
              <span className="text-sm text-[#9b9da3]">
                주문번호 001 · 2026-04-10 17:46
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-[#9b9da3]">
              <span>메뉴명</span>
              <span>수량</span>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <span className="text-base font-bold text-[#292a2e]">
                  매콤달콤 떡볶이
                </span>
                <div className="text-right">
                  <div className="text-base font-bold text-[#292a2e]">1개</div>
                  <div className="text-sm text-[#9b9da3]">4,500원</div>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-base font-bold text-[#292a2e]">
                  모짜렐라 듬뿍 치즈피자
                </span>
                <div className="text-right">
                  <div className="text-base font-bold text-[#292a2e]">1개</div>
                  <div className="text-sm text-[#9b9da3]">7,000원</div>
                </div>
              </div>
            </div>

            <div className="my-6 h-px bg-[#e5e6e8]" />

            <div className="flex justify-end">
              <span className="text-base font-bold text-[#292a2e]">
                11,500원
              </span>
            </div>

            <div className="relative mt-6">
              <motion.button
                type="button"
                className="w-full rounded-2xl bg-[#ffd761] px-6 py-3.5 text-sm font-semibold text-[#292a2e]"
                animate={
                  cookPress
                    ? {
                        scale: [1, 0.94, 1],
                        backgroundColor: ["#ffd761", "#f0b90b", "#ffd761"],
                      }
                    : { scale: 1, backgroundColor: "#ffd761" }
                }
                transition={{
                  duration: 1,
                  times: [0, 0.45, 0.9],
                  ease: "easeInOut",
                }}
              >
                조리 완료
              </motion.button>
              {showCookTouch && (
                <TouchPoint className="left-1/2 top-1/2" />
              )}
            </div>
      </motion.div>
    </div>
  );
}

function TouchPoint({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{ scale: [0, 0.7, 1.4], opacity: [0, 0.65, 0] }}
        transition={{
          duration: 1.2,
          times: [0.15, 0.45, 1],
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#292a2e] shadow-[0_0_0_3px_rgba(255,255,255,0.7)]"
        animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.2,
          times: [0.2, 0.4, 0.55, 0.75],
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

function PhoneMockup({
  children,
  widthClass = "w-[320px]",
}: {
  children: React.ReactNode;
  widthClass?: string;
}) {
  return (
    <div className={cn("relative @container", widthClass)}>
      <div className="aspect-[320/665]" />
      <div
        className="absolute left-0 top-0 w-[320px] origin-top-left"
        style={{ transform: "scale(calc(100cqi / 320px))" }}
      >
        <div className="rounded-[52px] bg-white p-3 shadow-[0_50px_120px_rgba(54,56,62,0.18)] ring-1 ring-[#eaecef]">
          <div className="relative aspect-[375/812] overflow-hidden rounded-[42px] bg-white">
            <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const STORE_SCREENS = [
  "/screens/store-1.svg",
  "/screens/store-2.svg",
  "/screens/store-3.svg",
  "/screens/store-1.svg",
  "/screens/store-4.svg",
  "/screens/store-5.svg",
];

function MockStoreManagement() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      timers.push(setTimeout(() => setStep(1), 2000));
      timers.push(setTimeout(() => setStep(2), 4500));
      timers.push(setTimeout(() => setStep(3), 6000));
      timers.push(setTimeout(() => setStep(4), 8000));
      timers.push(setTimeout(() => setStep(5), 9500));
      timers.push(setTimeout(() => setStep(0), 14500));
      timers.push(setTimeout(run, 15000));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  const showManageTouch = step === 0;
  const showMenuAddTouch = step === 3;

  return (
    <>
      {STORE_SCREENS.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: idx === step ? 1 : 0 }}
        />
      ))}

      {showManageTouch && <TouchPoint className="left-[82%] top-[16%]" />}
      {showMenuAddTouch && <TouchPoint className="left-[83%] top-[88%]" />}
    </>
  );
}



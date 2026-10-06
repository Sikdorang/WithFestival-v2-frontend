"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Icon from "./Icon";

const QR_CELLS = [
  1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1,
  1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1,
  1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1,
  1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1,
  0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0,
  1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1,
  0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0,
  1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1,
  1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1,
];

export default function MoreFeatures() {
  return (
    <div className="mt-32 md:mt-48">
      <div className="flex flex-col gap-3 md:gap-4">
        <span className="text-base font-bold tracking-[-0.01em] text-[#ffb60b] md:text-xl">
          더 많은 기능
        </span>
        <h3 className="text-[26px] font-bold leading-[1.55] tracking-[-0.01em] text-[#292a2e] md:text-[40px]">
          결제와 QR, 원하는 기능까지
          <br />
          부스에 맞게 골라 써요
        </h3>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-5">
        <FeatureCard
          icon="payments"
          eyebrow="PG 결제"
          title={"카드·간편결제로\n주문 금액을 받아요"}
          description="계좌 송금 확인과 함께 PG 결제도 지원해요. 방문객이 메뉴를 고르고 결제하면, 운영 화면에서 결제 완료를 바로 확인할 수 있어요."
          mock={<PgMock />}
          delay={0}
        />
        <FeatureCard
          icon="qr_code_2"
          eyebrow="QR"
          title={"스캔은 방문객이,\n만들고 관리는 운영진이"}
          description="테이블이나 부스 QR을 스캔하면 앱 없이 메뉴와 주문으로 들어와요. 관리 화면에서 테이블별·부스 QR을 만들고 이미지로 저장해 출력하면 돼요."
          mock={<QrMock />}
          delay={0.08}
        />
        <FeatureCard
          icon="extension"
          eyebrow="플러그인"
          title={"소개팅, 미니게임도\n원하면 넣어드려요"}
          description="주문 외에 축제에 어울리는 기능을 플러그인으로 붙일 수 있어요. 소개팅이나 미니게임처럼 원하는 기능이 있으면 도입할 때 함께 구성해 드려요."
          mock={<PluginMock />}
          delay={0.16}
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  eyebrow,
  title,
  description,
  mock,
  delay,
}: {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  mock: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="flex flex-col rounded-3xl bg-white p-6 shadow-[0_12px_40px_rgba(54,56,62,0.08)] md:p-7"
    >
      <span className="flex items-center gap-1.5 text-sm font-bold tracking-[-0.01em] text-[#ffb60b] md:text-base">
        <Icon name={icon} size={18} weight={700} filled />
        {eyebrow}
      </span>
      <h4 className="mt-4 whitespace-pre-line text-[22px] font-bold leading-[1.45] tracking-[-0.02em] text-[#36383e] md:text-[26px]">
        {title}
      </h4>
      <p className="mt-3 text-sm leading-[1.7] text-[#5f616a]">{description}</p>
      <div className="mt-6 flex flex-1 items-end">{mock}</div>
    </motion.article>
  );
}

function useLoop(delays: number[], cycle: number) {
  const [step, setStep] = useState(0);
  const signature = delays.join(",");

  useEffect(() => {
    const points = signature.split(",").map(Number);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      points.forEach((delay, index) => {
        timers.push(setTimeout(() => setStep(index + 1), delay));
      });
      timers.push(setTimeout(() => setStep(0), cycle));
      timers.push(setTimeout(run, cycle + 400));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [cycle, signature]);

  return step;
}

function PgMock() {
  const step = useLoop([1200, 2200, 3200], 5000);
  const simple = step === 1 || step === 2;
  const paid = step >= 3;

  return (
    <div className="w-full rounded-2xl bg-[#f7f8fa] p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#9b9da3]">결제 금액</span>
        <span className="text-base font-bold text-[#292a2e]">11,500원</span>
      </div>
      <div className="relative mt-4 grid grid-cols-2 gap-2">
        <PayMethod
          icon="credit_card"
          label="카드"
          selected={!simple && !paid}
        />
        <PayMethod
          icon="account_balance_wallet"
          label="간편결제"
          selected={simple}
        />
        {step === 0 && <TouchPoint className="left-[75%] top-1/2" />}
      </div>
      <div className="relative mt-3">
        <motion.div
          className="rounded-2xl px-4 py-3 text-center text-sm font-semibold"
          animate={
            paid
              ? {
                  scale: [1, 0.96, 1],
                  backgroundColor: "#ffd761",
                  color: "#292a2e",
                }
              : { scale: 1, backgroundColor: "#292a2e", color: "#ffffff" }
          }
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {paid ? "결제 완료" : "결제하기"}
        </motion.div>
        {step === 2 && <TouchPoint className="left-1/2 top-1/2" />}
      </div>
    </div>
  );
}

function PayMethod({
  icon,
  label,
  selected,
}: {
  icon: string;
  label: string;
  selected: boolean;
}) {
  return (
    <motion.span
      className="flex items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold"
      animate={{
        backgroundColor: selected ? "#ffd761" : "#ffffff",
        color: selected ? "#292a2e" : "#9b9da3",
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <Icon name={icon} size={16} weight={600} />
      {label}
    </motion.span>
  );
}

function QrMock() {
  const step = useLoop([1600, 2400], 4800);
  const booth = step >= 2;

  return (
    <div className="flex w-full items-center gap-4 rounded-2xl bg-[#f7f8fa] p-4">
      <div className="relative grid shrink-0 grid-cols-11 gap-px overflow-hidden rounded-lg bg-white p-2">
        {QR_CELLS.map((on, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 ${on ? "bg-[#292a2e]" : "bg-transparent"}`}
          />
        ))}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-1 h-3 bg-gradient-to-b from-transparent via-[#ffd761] to-transparent"
          animate={{ top: ["-10%", "90%"], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 1.5,
            times: [0, 0.7, 1],
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative inline-flex rounded-lg bg-[#e5e7eb] p-0.5 text-[11px] font-semibold">
          <motion.span
            className="absolute top-0.5 bottom-0.5 left-0.5 w-12 rounded-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            animate={{ x: booth ? 48 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          />
          <span
            className={`relative z-10 flex w-12 items-center justify-center py-1 ${
              booth ? "text-[#9b9da3]" : "text-[#292a2e]"
            }`}
          >
            테이블
          </span>
          <span
            className={`relative z-10 flex w-12 items-center justify-center py-1 ${
              booth ? "text-[#292a2e]" : "text-[#9b9da3]"
            }`}
          >
            부스
          </span>
          {step === 1 && <TouchPoint className="left-[75%] top-1/2" />}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={booth ? "booth" : "table"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <p className="mt-2 text-sm font-bold text-[#292a2e]">
              {booth ? "부스 QR" : "테이블 3"}
            </p>
            <p className="mt-1 text-xs leading-[1.5] text-[#7b7d85]">
              {booth ? (
                <>
                  웨이팅 · 포장
                  <br />
                  메뉴 보기
                </>
              ) : (
                <>
                  스캔하면 주문
                  <br />
                  관리에서 이미지 저장
                </>
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PluginMock() {
  const step = useLoop([900, 1800, 2700], 4800);
  const dating = step >= 1;
  const game = step >= 2;
  const added = step >= 3;

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      <PluginChip icon="favorite" label="소개팅" active={dating} />
      <PluginChip icon="sports_esports" label="미니게임" active={game} />
      <div className="relative col-span-2 overflow-hidden rounded-2xl border border-dashed border-[#e5e6e8] bg-[#f7f8fa] px-3 py-3 text-center text-xs font-semibold text-[#7b7d85]">
        <AnimatePresence mode="wait">
          <motion.span
            key={added ? "added" : "ask"}
            className="block"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {added
              ? "소개팅, 미니게임을 넣었어요"
              : "원하는 기능이 있으면 요청해 주세요"}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PluginChip({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active: boolean;
}) {
  return (
    <motion.div
      className="relative flex flex-col items-start gap-2 rounded-2xl px-3 py-3"
      animate={{
        backgroundColor: active ? "#fff6d8" : "#f7f8fa",
        scale: active ? 1.03 : 1,
      }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#f0b90b]">
        <motion.span
          className="flex"
          animate={active ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <Icon name={icon} size={18} weight={600} filled />
        </motion.span>
      </span>
      <span className="text-sm font-bold text-[#292a2e]">{label}</span>
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-2 right-2 text-[#f0b90b]"
          >
            <Icon name="check_circle" size={16} weight={700} filled />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TouchPoint({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute z-10 ${className}`}>
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{ scale: [0, 0.7, 1.4], opacity: [0, 0.7, 0] }}
        transition={{
          duration: 1.1,
          times: [0.15, 0.45, 1],
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#292a2e] shadow-[0_0_0_3px_rgba(255,255,255,0.7)]"
        animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.1,
          times: [0.2, 0.4, 0.55, 0.75],
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

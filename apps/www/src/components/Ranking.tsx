"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BOOTHS, type Booth } from "@/src/data/ranking";
import Icon from "./Icon";

type Trend = "up" | "down" | "same";

type RankedBooth = Booth & {
  rank: number;
  rankDelta: number;
  trend: Trend;
  revenueDelta: number;
};

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR");
}

function buildRanked(
  booths: Booth[],
  prevRanks: Map<string, number>,
  prevRevenues: Map<string, number>,
): RankedBooth[] {
  const sorted = [...booths].sort((a, b) => b.revenue - a.revenue);
  return sorted.map((b, idx) => {
    const rank = idx + 1;
    const prev = prevRanks.get(b.id) ?? rank;
    const delta = prev - rank;
    const trend: Trend = delta > 0 ? "up" : delta < 0 ? "down" : "same";
    const prevRev = prevRevenues.get(b.id) ?? b.revenue;
    return {
      ...b,
      rank,
      rankDelta: Math.abs(delta),
      trend,
      revenueDelta: b.revenue - prevRev,
    };
  });
}

export default function Ranking() {
  const [ranked, setRanked] = useState<RankedBooth[]>(() =>
    buildRanked(BOOTHS, new Map(), new Map()),
  );
  const prevRanksRef = useRef<Map<string, number>>(new Map());
  const prevRevenuesRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const seedRanks = new Map<string, number>();
    const seedRevs = new Map<string, number>();
    ranked.forEach((b) => {
      seedRanks.set(b.id, b.rank);
      seedRevs.set(b.id, b.revenue);
    });
    prevRanksRef.current = seedRanks;
    prevRevenuesRef.current = seedRevs;

    const tick = () => {
      setRanked((prev) => {
        const updated: Booth[] = prev.map((b) => ({
          id: b.id,
          name: b.name,
          university: b.university,
          affiliation: b.affiliation,
          color: b.color,
          abbr: b.abbr,
          logoExt: b.logoExt,
          revenue: b.revenue + Math.floor(Math.random() * 16000) + 3000,
        }));
        const next = buildRanked(
          updated,
          prevRanksRef.current,
          prevRevenuesRef.current,
        );
        const ranks = new Map<string, number>();
        const revs = new Map<string, number>();
        next.forEach((b) => {
          ranks.set(b.id, b.rank);
          revs.set(b.id, b.revenue);
        });
        prevRanksRef.current = ranks;
        prevRevenuesRef.current = revs;
        return next;
      });
    };

    const id = setInterval(tick, 3500);
    return () => clearInterval(id);
  }, []);

  const leader = ranked[0];
  const rest = ranked.slice(1);

  return (
    <section className="relative w-full bg-white pt-32 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-medium tracking-[-0.01em] text-[#5f616a]">
            <span className="relative inline-flex h-2 w-2">
              <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d4f]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff4d4f]" />
            </span>
            <span>실시간 집계 중</span>
          </div>
          <h1 className="text-[34px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#292a2e] md:text-[44px]">
            오늘의 부스 랭킹
          </h1>
          <p className="max-w-xl text-sm text-[#5f616a] md:text-base">
            지금 이 순간 매출이 가장 활발한 캠퍼스 부스를 자동으로 추적합니다.
          </p>
        </div>

        {leader && (
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="card-shine mt-10 overflow-hidden rounded-3xl bg-[#f7f8fa] p-7 md:p-10"
          >
            <div className="relative z-[2] flex items-center gap-2 text-lg font-semibold tracking-[-0.01em]">
              <Icon
                name="workspace_premium"
                size={36}
                weight={700}
                filled
                className="text-[#ffb60b]"
              />
              <span className="text-[#b8860b]">1위</span>
            </div>
            <div className="relative z-[2] mt-5 flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <BoothAvatar booth={leader} size={72} />
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm text-[#7b7d85]">
                    {leader.university} · {leader.affiliation}
                  </span>
                  <span className="mt-1.5 truncate text-[36px] font-semibold leading-tight tracking-[-0.02em] text-[#292a2e] md:text-[48px]">
                    {leader.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-sm text-[#7b7d85]">현재 매출</span>
                <span className="mt-1.5 text-[36px] font-semibold leading-tight tracking-[-0.02em] text-[#292a2e] md:text-[48px]">
                  {formatKRW(leader.revenue)}원
                </span>
                <span
                  aria-hidden={leader.revenueDelta <= 0}
                  className="mt-1.5 flex items-center gap-1 text-sm font-medium text-[#b8860b]"
                  style={{
                    visibility:
                      leader.revenueDelta > 0 ? "visible" : "hidden",
                  }}
                >
                  <Icon name="trending_up" size={16} weight={600} />
                  +{formatKRW(Math.max(leader.revenueDelta, 0))}원
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-10">
          <div className="grid grid-cols-[40px_1fr_110px_72px] items-center gap-3 px-5 pb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#92949d] md:grid-cols-[60px_1fr_180px_96px] md:gap-4">
            <span>RANK</span>
            <span>부스</span>
            <span className="text-right">매출</span>
            <span className="text-right">변동</span>
          </div>
          <motion.ul layout className="flex flex-col">
            {rest.map((b) => (
              <motion.li
                layout
                key={b.id}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className="grid grid-cols-[40px_1fr_110px_72px] items-center gap-3 border-t border-[#36383e1a] px-5 py-4 md:grid-cols-[60px_1fr_180px_96px] md:gap-4"
              >
                <RankIcon rank={b.rank} />
                <div className="flex min-w-0 items-center gap-3">
                  <BoothAvatar booth={b} size={40} />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-[#292a2e] md:text-base">
                      {b.name}
                    </span>
                    <span className="mt-0.5 truncate text-xs text-[#7b7d85] md:text-sm">
                      {b.university} · {b.affiliation}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold tabular-nums text-[#292a2e] md:text-base">
                    {formatKRW(b.revenue)}원
                  </span>
                  {b.revenueDelta > 0 && (
                    <span className="mt-0.5 text-[11px] tabular-nums text-[#92949d] md:text-xs">
                      +{formatKRW(b.revenueDelta)}원
                    </span>
                  )}
                </div>
                <div className="flex justify-end">
                  <TrendIndicator trend={b.trend} delta={b.rankDelta} />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <p className="mt-10 text-center text-xs text-[#92949d]">
          매출 정보는 약 3.5초마다 자동으로 갱신됩니다.
        </p>
      </div>
    </section>
  );
}

function BoothAvatar({ booth, size }: { booth: Booth; size: number }) {
  const [errored, setErrored] = useState(false);
  const showLogo = !errored && Boolean(booth.logoExt);
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: showLogo ? "#ffffff" : booth.color,
        boxShadow: showLogo ? "inset 0 0 0 1px #e7e8eb" : "none",
      }}
    >
      {showLogo ? (
        <img
          src={`/logos/${booth.id}.${booth.logoExt}`}
          alt={booth.university}
          width={Math.round(size * 0.7)}
          height={Math.round(size * 0.7)}
          onError={() => setErrored(true)}
          style={{ objectFit: "contain" }}
        />
      ) : (
        <span
          className="font-bold text-white"
          style={{ fontSize: Math.round(size * 0.3) }}
        >
          {booth.abbr}
        </span>
      )}
    </div>
  );
}

function RankIcon({ rank }: { rank: number }) {
  if (rank <= 3) {
    const color =
      rank === 1 ? "#ffb60b" : rank === 2 ? "#b8bcc4" : "#cd7f32";
    return (
      <span style={{ color }} className="inline-flex">
        <Icon name="workspace_premium" size={28} weight={700} filled />
      </span>
    );
  }
  const counterName = rank > 9 ? "counter_9_plus" : `counter_${rank}`;
  return (
    <span className="inline-flex text-[#5f616a]">
      <Icon name={counterName} size={28} weight={500} filled />
    </span>
  );
}

function TrendIndicator({ trend, delta }: { trend: Trend; delta: number }) {
  if (trend === "same") {
    return (
      <span className="flex items-center text-[#c8c9cd]">
        <Icon name="remove" size={16} weight={500} />
      </span>
    );
  }
  const isUp = trend === "up";
  const color = isUp ? "#1f9d55" : "#dc2626";
  return (
    <span
      className="flex items-center gap-0.5 text-xs font-semibold tabular-nums"
      style={{ color }}
    >
      <Icon name={isUp ? "arrow_upward" : "arrow_downward"} size={14} weight={600} />
      {delta}
    </span>
  );
}

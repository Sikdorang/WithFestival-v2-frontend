"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { FESTIVALS, type FestivalEvent } from "@/src/data/schedule";
import Icon from "./Icon";

type Tab = "ongoing" | "upcoming" | "ended";

const TODAY = new Date("2026-04-28T00:00:00+09:00");

function parseDate(s: string) {
  return new Date(`${s}T00:00:00+09:00`);
}

function daysBetween(a: Date, b: Date) {
  const ms = a.getTime() - b.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatRange(startStr: string, endStr: string) {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();
  const startLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
  const endLabel = sameMonth
    ? `${end.getDate()}일`
    : `${end.getMonth() + 1}월 ${end.getDate()}일`;
  return `${startLabel} – ${endLabel}`;
}

function dayMeta(festival: FestivalEvent, tab: Tab) {
  const start = parseDate(festival.startDate);
  const end = parseDate(festival.endDate);
  if (tab === "ongoing") {
    const dayNum = daysBetween(TODAY, start) + 1;
    const total = daysBetween(end, start) + 1;
    return { label: `${dayNum}/${total}일차`, tone: "live" as const };
  }
  if (tab === "upcoming") {
    const d = daysBetween(start, TODAY);
    if (d <= 0) return { label: "오늘 시작", tone: "live" as const };
    if (d <= 3) return { label: `D-${d}`, tone: "live" as const };
    return { label: `D-${d}`, tone: "future" as const };
  }
  const d = daysBetween(TODAY, end);
  return { label: `${d}일 전`, tone: "past" as const };
}

export default function Schedule() {
  const [tab, setTab] = useState<Tab>("ongoing");

  const { ongoing, upcoming, ended } = useMemo(() => {
    const o: FestivalEvent[] = [];
    const u: FestivalEvent[] = [];
    const e: FestivalEvent[] = [];
    FESTIVALS.forEach((f) => {
      const start = parseDate(f.startDate);
      const end = parseDate(f.endDate);
      if (start <= TODAY && TODAY <= end) o.push(f);
      else if (start > TODAY) u.push(f);
      else e.push(f);
    });
    o.sort(
      (a, b) =>
        parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
    );
    u.sort(
      (a, b) =>
        parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
    );
    e.sort(
      (a, b) =>
        parseDate(b.endDate).getTime() - parseDate(a.endDate).getTime(),
    );
    return { ongoing: o, upcoming: u, ended: e };
  }, []);

  const list =
    tab === "ongoing" ? ongoing : tab === "upcoming" ? upcoming : ended;

  return (
    <section className="relative w-full bg-white pt-32 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-[34px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#292a2e] md:text-[44px]">
            올해의 축제 일정
          </h1>
          <p className="max-w-xl text-sm text-[#5f616a] md:text-base">
            축제랑이 함께하는 캠퍼스 축제 일정을 한자리에서 확인하세요.
          </p>
        </div>

        <div className="mt-10 flex justify-start">
          <SegmentedControl
            value={tab}
            onChange={setTab}
            counts={{
              ongoing: ongoing.length,
              upcoming: upcoming.length,
              ended: ended.length,
            }}
          />
        </div>

        <div className="mt-8">
          <div className="hidden items-center gap-4 px-5 pb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#92949d] md:grid md:grid-cols-[1fr_220px_120px]">
            <span>축제</span>
            <span>일정</span>
            <span className="text-right">
              {tab === "ongoing"
                ? "진행 일차"
                : tab === "upcoming"
                  ? "D-DAY"
                  : "종료"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              {list.length === 0 ? (
                <li className="py-12 text-center text-sm text-[#92949d]">
                  표시할 일정이 없습니다.
                </li>
              ) : (
                list.map((f) => {
                  const meta = dayMeta(f, tab);
                  return (
                    <li
                      key={f.id}
                      className="flex flex-col gap-2 border-t border-[#36383e1a] px-5 py-4 md:grid md:grid-cols-[1fr_220px_120px] md:items-center md:gap-4"
                    >
                      <div className="flex items-start justify-between gap-3 md:items-center">
                        <div className="flex min-w-0 items-center gap-3">
                          <BoothLogo festival={f} />
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold text-[#292a2e] md:text-base">
                              {f.university} · {f.name}
                            </span>
                            <span className="mt-0.5 truncate text-xs text-[#7b7d85] md:text-sm">
                              {f.location}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 md:hidden">
                          <DayBadge label={meta.label} tone={meta.tone} />
                        </div>
                      </div>
                      <span className="pl-[52px] text-xs font-semibold tabular-nums text-[#5f616a] md:pl-0 md:text-sm">
                        {formatRange(f.startDate, f.endDate)}
                      </span>
                      <div className="hidden md:flex md:justify-end">
                        <DayBadge label={meta.label} tone={meta.tone} />
                      </div>
                    </li>
                  );
                })
              )}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SegmentedControl({
  value,
  onChange,
  counts,
}: {
  value: Tab;
  onChange: (t: Tab) => void;
  counts: { ongoing: number; upcoming: number; ended: number };
}) {
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "ongoing", label: "진행 중", count: counts.ongoing },
    { id: "upcoming", label: "진행 예정", count: counts.upcoming },
    { id: "ended", label: "종료", count: counts.ended },
  ];
  return (
    <div className="relative inline-flex rounded-xl bg-[#f1f2f5] p-1">
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="relative z-[1] flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors"
            style={{ color: active ? "#292a2e" : "#7b7d85" }}
          >
            {active && (
              <motion.span
                layoutId="schedule-segmented-pill"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="absolute inset-0 -z-[1] rounded-lg bg-white shadow-[0_1px_6px_rgba(54,56,62,0.08)]"
              />
            )}
            <span>{t.label}</span>
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: active ? "#92949d" : "#b8bcc4" }}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BoothLogo({ festival }: { festival: FestivalEvent }) {
  const size = 40;
  const showLogo = Boolean(festival.logoExt);
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: showLogo ? "#ffffff" : festival.color,
        boxShadow: showLogo ? "inset 0 0 0 1px #e7e8eb" : "none",
      }}
    >
      {showLogo ? (
        <img
          src={`/logos/${festival.id}.${festival.logoExt}`}
          alt={festival.university}
          width={Math.round(size * 0.7)}
          height={Math.round(size * 0.7)}
          style={{ objectFit: "contain" }}
        />
      ) : (
        <span
          className="font-bold text-white"
          style={{ fontSize: Math.round(size * 0.3) }}
        >
          {festival.abbr}
        </span>
      )}
    </div>
  );
}

function DayBadge({
  label,
  tone,
}: {
  label: string;
  tone: "live" | "future" | "past";
}) {
  const palette: Record<typeof tone, { color: string; icon?: string }> = {
    live: { color: "#dc2626" },
    future: { color: "#5f616a" },
    past: { color: "#92949d" },
  };
  const { color, icon } = palette[tone];
  return (
    <span
      className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums"
      style={{ color }}
    >
      {icon && <Icon name={icon} size={14} weight={600} />}
      {label}
    </span>
  );
}

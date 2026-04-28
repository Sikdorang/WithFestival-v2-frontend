"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Icon from "./Icon";
import type { FaqItem } from "@/src/lib/faq";

export default function Faq({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="relative w-full overflow-hidden bg-white pt-32 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-[34px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#292a2e] md:text-[44px]">
            자주 묻는 질문
          </h2>
          <p className="max-w-xl text-sm text-[#5f616a] md:text-base">
            축제랑 도입과 운영에 대해 가장 많이 받는 질문들을 모았어요.
            <br />더 궁금한 점은 언제든 도입 문의로 알려주세요.
          </p>
        </div>

        <div className="mt-10 flex flex-col">
          {items.length === 0 && (
            <p className="text-sm text-[#92949d]">등록된 FAQ가 없습니다.</p>
          )}
          {items.map((item, idx) => {
            const isOpen = openIdx === idx;
            const isLast = idx === items.length - 1;
            return (
              <div
                key={item.slug}
                className={isLast ? "" : "border-b border-[#36383e1a]"}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors md:py-6"
                >
                  <span className="break-keep text-base font-semibold leading-[1.7] text-[#292a2e] md:text-lg">
                    {item.title}
                  </span>
                  <span className="relative flex h-5 w-5 shrink-0 items-center justify-center text-[#ffb60b]">
                    <motion.span
                      animate={{
                        rotate: isOpen ? 90 : 0,
                        scale: isOpen ? 0 : 1,
                        opacity: isOpen ? 0 : 1,
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Icon name="add" size={20} weight={500} />
                    </motion.span>
                    <motion.span
                      initial={false}
                      animate={{
                        rotate: isOpen ? 0 : -90,
                        scale: isOpen ? 1 : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Icon name="remove" size={20} weight={500} />
                    </motion.span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="prose pb-6 pr-10 text-sm leading-[1.7] text-[#7b7d85] md:text-base"
                        dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

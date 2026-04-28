"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type Card = {
  id: string;
  category: string;
  title: string;
  src: string;
};

const CARDS: Card[] = [
  {
    id: "c1",
    category: " ",
    title: " ",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
  },
  {
    id: "c2",
    category: " ",
    title: " ",
    src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop",
  },
  {
    id: "c3",
    category: " ",
    title: " ",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  },
  {
    id: "c4",
    category: " ",
    title: " ",
    src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop",
  },
  {
    id: "c5",
    category: " ",
    title: " ",
    src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop",
  },
  {
    id: "c6",
    category: " ",
    title: " ",
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop",
  },
];

export default function AppleCardsCarousel() {
  const [openId, setOpenId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "unset";
  }, [openId]);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const opened = CARDS.find((c) => c.id === openId);

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 md:py-24">
      <div className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between px-5 md:mb-12 md:px-8">
        <h2 className="text-3xl font-bold tracking-[-0.01em] text-[#292a2e] md:text-5xl">
          &nbsp;
        </h2>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#36383e1a] bg-white text-[#292a2e] transition-colors hover:bg-[#f7f8fa]"
            aria-label="prev"
          >
            <Icon name="arrow_back" size={20} weight={500} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#36383e1a] bg-white text-[#292a2e] transition-colors hover:bg-[#f7f8fa]"
            aria-label="next"
          >
            <Icon name="arrow_forward" size={20} weight={500} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="scroll-smooth flex gap-5 overflow-x-auto px-5 pb-8 [scrollbar-width:none] md:px-8 md:gap-6 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setOpenId(card.id)}
            className="group relative flex h-[480px] w-[260px] shrink-0 flex-col justify-end overflow-hidden rounded-[28px] bg-[#f7f8fa] text-left snap-start transition-transform hover:-translate-y-1 md:h-[560px] md:w-[320px] md:rounded-[32px]"
          >
            <img
              src={card.src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/70" />
            <div className="relative z-10 flex flex-col gap-2 p-6 md:p-7">
              <span className="text-xs font-semibold uppercase tracking-[-0.01em] text-white/80 min-h-[1em]">
                {card.category}
              </span>
              <span className="text-2xl font-bold leading-[1.7] tracking-[-0.01em] text-white md:text-3xl min-h-[1em]">
                {card.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm"
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white md:rounded-[36px]"
            >
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#292a2e] backdrop-blur-md transition-colors hover:bg-white"
                aria-label="close"
              >
                <Icon name="close" size={20} weight={500} />
              </button>
              <div className="relative aspect-[16/10] w-full bg-[#f7f8fa]">
                <img
                  src={opened.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-7 md:p-10">
                <span className="text-xs font-semibold uppercase tracking-[-0.01em] text-[#92949d] min-h-[1em]">
                  {opened.category}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-[-0.01em] text-[#292a2e] md:text-4xl min-h-[1em]">
                  {opened.title}
                </h3>
                <div className="mt-6 min-h-[6em] text-base leading-[1.7] text-[#5f616a] md:text-lg">
                  {" "}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

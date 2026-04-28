"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Msg = {
  side: "left" | "right";
  name: string;
  text: string;
  avatar: string;
};

const MESSAGES: Msg[] = [
  {
    side: "left",
    name: "Sarah",
    text: " ",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&auto=format&fit=crop&crop=faces",
  },
  {
    side: "right",
    name: "You",
    text: " ",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&auto=format&fit=crop&crop=faces",
  },
  {
    side: "left",
    name: "Tyler",
    text: " ",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&auto=format&fit=crop&crop=faces",
  },
  {
    side: "right",
    name: "Sarah",
    text: " ",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&auto=format&fit=crop&crop=faces",
  },
];

export default function ChatConversation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative w-full overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="mb-10 flex flex-col items-start gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 className="text-3xl font-bold tracking-[-0.01em] text-[#292a2e] md:text-5xl min-h-[1em]">
            &nbsp;
          </h2>
          <p className="max-w-md text-base leading-[1.7] text-[#5f616a] md:text-lg min-h-[1.6em]">
            {" "}
          </p>
        </div>

        <div
          ref={ref}
          className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[28px] border border-[#36383e0d] bg-white p-6 shadow-[0_4px_24px_rgba(54,56,62,0.05)] md:rounded-[32px] md:p-10"
        >
          {MESSAGES.map((m, i) => {
            const isRight = m.side === "right";
            return (
              <div
                key={i}
                className={`flex items-end gap-3 ${isRight ? "flex-row-reverse" : ""}`}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: i * 0.4,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 280,
                  }}
                  className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f7f8fa]"
                >
                  <img
                    src={m.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{
                    opacity: 0,
                    x: isRight ? 24 : -24,
                  }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    delay: i * 0.4 + 0.15,
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                  className={`max-w-[68%] rounded-2xl px-4 py-2.5 text-sm leading-[1.7] md:text-[15px] ${
                    isRight
                      ? "bg-[#292a2e] text-white"
                      : "bg-[#f7f8fa] text-[#292a2e]"
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[-0.01em] opacity-60 min-h-[1em]">
                    {m.name}
                  </div>
                  <div className="mt-0.5 min-h-[1.5em]">{m.text}</div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

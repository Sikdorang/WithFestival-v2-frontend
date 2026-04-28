"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { Button, ButtonLink } from "./ui/Button";

const NAV_ITEMS = [
  { label: "축제랑 소개", href: "/" },
  { label: "축제 일정", href: "/schedule" },
  { label: "실시간 랭킹", href: "/ranking" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  return (
    <>
      <motion.header
        animate={{
          paddingTop: scrolled ? 12 : 24,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 w-full px-4"
      >
        <motion.div
          animate={{
            maxWidth: scrolled ? 880 : 1120,
            backgroundColor: scrolled
              ? "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0)",
            backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
            boxShadow: scrolled
              ? "0 1px 2px rgba(54,56,62,0.04), 0 8px 24px rgba(54,56,62,0.06)"
              : "0 0 0 rgba(0,0,0,0)",
            borderColor: scrolled
              ? "rgba(54,56,62,0.08)"
              : "rgba(54,56,62,0)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative mx-auto flex w-full items-center justify-between rounded-full border px-5 py-2.5 md:px-6"
        >
          <Link
            href="/"
            className="z-10 flex items-center"
            onClick={() => setOpen(false)}
            aria-label="withfestival"
          >
            <svg
              viewBox="0 0 677 209"
              className="h-7 w-auto md:h-8"
              fill="#FFCC3E"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M166.562 21.4414C166.562 31.694 166.583 38.1369 166.979 42.9941C167.355 47.5946 167.962 48.9307 168.148 49.2969C169.546 52.0392 171.781 54.2746 174.523 55.6719C174.89 55.8582 176.226 56.465 180.826 56.8408C185.683 57.2374 192.126 57.2578 202.379 57.2578H208.204V98.8984H202.379C192.811 98.8984 184.377 98.9172 177.431 98.3496C173.7 98.0448 169.909 97.541 166.116 96.6152C166.41 99.0704 166.562 101.569 166.562 104.104C166.562 138.6 138.597 166.564 104.101 166.564C96.6242 166.564 89.4552 165.25 82.8105 162.841C83.2975 169.586 83.2822 177.662 83.2822 186.764V192.589H41.6406V186.764C41.6406 176.511 41.6212 170.068 41.2246 165.211C40.8486 160.609 40.2407 159.274 40.0547 158.908C38.6574 156.166 36.423 153.93 33.6807 152.533C33.3145 152.347 31.9784 151.74 27.3779 151.364C22.5207 150.968 16.0778 150.947 5.8252 150.947H0V109.307H5.8252C15.3931 109.307 23.8268 109.288 30.7734 109.855C34.5026 110.16 38.293 110.663 42.084 111.588C41.7909 109.134 41.6387 106.636 41.6387 104.104C41.6387 69.607 69.6041 41.6416 104.101 41.6416C111.578 41.6416 118.748 42.956 125.393 45.3652C124.906 38.6197 124.922 30.5439 124.922 21.4414V15.6162H166.562V21.4414ZM104.101 83.2832C92.6018 83.2832 83.2803 92.6047 83.2803 104.104C83.2804 115.602 92.6018 124.924 104.101 124.924C115.599 124.924 124.921 115.602 124.921 104.104C124.921 92.6047 115.599 83.2832 104.101 83.2832Z" />
              <path d="M622.26 150.009C628.593 150.009 633.198 147.064 636.077 141.172C637.228 138.586 637.804 135.928 637.804 133.198C637.804 126.444 635.069 121.487 629.6 118.326C627.297 117.033 624.85 116.386 622.26 116.386C615.926 116.386 611.321 119.332 608.442 125.223C607.291 127.809 606.715 130.468 606.715 133.198C606.715 139.951 609.45 144.908 614.919 148.069C617.222 149.363 619.669 150.009 622.26 150.009ZM622.26 91.8153C636.077 91.8153 647.16 96.8444 655.508 106.903C661.841 114.518 665.007 123.283 665.007 133.198C665.007 146.561 659.826 157.266 649.463 165.312C641.546 171.491 632.479 174.58 622.26 174.58C608.442 174.58 597.359 169.551 589.011 159.493C582.678 151.877 579.512 143.112 579.512 133.198C579.512 119.835 584.693 109.13 595.056 101.083C602.973 94.9046 612.04 91.8153 622.26 91.8153ZM661.121 5.1709V31.0349H676.666V55.6057H661.121V82.7629H633.918V5.1709H661.121ZM541.945 5.1709H619.669V54.3125H569.149C569.436 57.6173 571.164 59.3416 574.33 59.4853H619.669V82.7629H567.853C552.74 82.7629 544.248 76.6561 542.377 64.4425C542.089 62.4309 541.945 60.3474 541.945 58.1921V33.6213H592.466V28.4485H541.945V5.1709Z" />
              <path d="M451.642 5.1709H478.845V82.7629H451.642V55.6057H436.097V31.0349H451.642V5.1709ZM493.095 82.7629V5.1709H520.298V82.7629H493.095ZM437.393 29.7417H412.133V49.1397C412.421 55.0309 415.011 58.0484 419.905 58.1921H437.393V82.7629H421.2C410.262 82.6192 402.705 79.6017 398.531 73.7105C394.069 79.7454 386.513 82.7629 375.862 82.7629H359.669V58.1921H377.157C382.195 57.9047 384.786 54.8872 384.93 49.1397V29.7417H359.669V5.1709H437.393V29.7417Z" />
              <path d="M285.515 117.681H260.255V93.1104H337.979V117.681H312.719V130.613C327.688 131.475 335.964 138.588 337.547 151.951C337.835 153.819 337.979 155.759 337.979 157.77V208.205H310.776V164.236C310.488 158.345 307.897 155.328 303.003 155.184H260.255V130.613H285.515V117.681ZM337.979 34.9164H312.719V49.1416C313.007 55.0328 315.597 58.0503 320.491 58.194H337.979V82.7648H321.786C310.848 82.6211 303.291 79.6036 299.117 73.7124C294.655 79.7473 287.099 82.7648 276.448 82.7648H260.255V58.194H277.743C282.781 57.9066 285.372 54.8891 285.515 49.1416V34.9164H260.255V10.3456H285.515V0H312.719V10.3456H337.979V34.9164Z" />
            </svg>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {NAV_ITEMS.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoverIdx(idx)}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-[#5f616a] transition-colors hover:text-[#292a2e]"
              >
                {hoverIdx === idx && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-[#36383e0d]"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="z-10 flex items-center gap-2">
            <ButtonLink
              href="/contact"
              variant="primary"
              size="sm"
              className="hidden md:inline-flex"
            >
              도입 문의
            </ButtonLink>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="menu"
            >
              <Icon name={open ? "close" : "menu"} size={22} weight={500} />
            </Button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white px-6 md:hidden"
          >
            <nav className="flex flex-col items-center gap-2">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + idx * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-full px-6 py-3 text-2xl font-bold text-[#292a2e] transition-colors hover:text-[#ffbf0b]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#292a2e] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#36383e]"
                >
                  도입 문의
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

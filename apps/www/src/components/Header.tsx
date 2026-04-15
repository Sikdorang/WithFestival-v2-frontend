"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // 🌟 스크롤 위치 감지
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // 🌟 모바일 메뉴가 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // 💡 축제 전문 플랫폼에 맞는 네비게이션 워딩
  const NAV_MENUS = [
    { label: "축제랑 소개", href: "/about" },
    { label: "부스 랭킹", href: "/ranking" },
    { label: "자주 묻는 질문", href: "/faq" },
  ];

  const menuVariants = {
    closed: {
      y: "-100%",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    open: {
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <>
      <motion.header
        initial={{
          backgroundColor: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(0px)",
        }}
        animate={{
          backgroundColor:
            isScrolled && !isMobileMenuOpen
              ? "rgba(255, 255, 255, 0.85)"
              : "rgba(255, 255, 255, 0)",
          backdropFilter:
            isScrolled && !isMobileMenuOpen ? "blur(12px)" : "blur(0px)",
          borderBottom:
            isScrolled && !isMobileMenuOpen
              ? "1px solid rgba(220, 222, 227, 0.5)"
              : "1px solid rgba(220, 222, 227, 0)",
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-x-0 top-0 z-50 w-full transition-colors"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-4 md:px-12">
          {/* [영역 1] 왼쪽 (로고) */}
          <div className="flex flex-1 items-center justify-start">
            <Link
              href="/"
              className="relative z-50 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/images/img_logo_full.svg"
                alt="WithFestival"
                width={70}
                height={70}
                priority
              />
            </Link>
          </div>

          {/* [영역 2] 중앙 (메뉴) */}
          <nav className="hidden shrink-0 items-center gap-8 md:flex">
            {NAV_MENUS.map((menu) => (
              <Link
                key={menu.label}
                href={menu.href}
                // 마우스 호버 시 딥 네이비 컬러로 포인트
                className="text-body1-m text-gray-600 transition-colors hover:text-[#11153F]"
              >
                {menu.label}
              </Link>
            ))}
          </nav>

          {/* [영역 3] 오른쪽 (버튼) */}
          <div className="flex flex-1 items-center justify-end">
            <div className="hidden md:block">
              <Link
                href="/contact"
                // 축제랑 메인 옐로우 컬러 + 딥 네이비 텍스트 적용
                className="rounded-md bg-[#FFD43A] px-6 py-2 text-body2-sb text-[#11153F] shadow-sm transition-colors hover:bg-[#FFBF0B]"
              >
                문의하기
              </Link>
            </div>

            {/* 모바일 햄버거/닫기 버튼 */}
            <button
              className={`relative z-50 p-2 md:hidden transition-colors ${isMobileMenuOpen ? "text-white" : "text-gray-800"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMobileMenuOpen ? (
                  // 열렸을 땐 X 아이콘
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  // 닫혔을 땐 햄버거 아이콘
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* 🌟 모바일 풀스크린 네비게이션 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            // 브랜드 시그니처 딥 네이비 배경 적용
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#11153F] px-6"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_MENUS.map((menu) => (
                <motion.div key={menu.label} variants={linkVariants}>
                  <Link
                    href={menu.href}
                    className="text-head1-b text-white transition-colors hover:text-[#FFD43A]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {menu.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={linkVariants} className="mt-8">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#FFD43A] px-8 py-4 text-sub1-sb text-[#11153F] transition-colors hover:bg-[#FFBF0B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  문의하기
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

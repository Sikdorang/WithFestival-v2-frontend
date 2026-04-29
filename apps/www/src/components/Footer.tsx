import Link from "next/link";

const FOOTER_LINKS = [
  { label: "축제랑 소개", href: "/" },
  { label: "축제 일정", href: "/schedule" },
  { label: "실시간 랭킹", href: "/ranking" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "이용약관", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <div className="flex flex-col items-center gap-8">
          <img
            src="/logo-gray.svg"
            alt="축제랑"
            className="h-7 w-auto md:h-8"
          />

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#5f616a] transition-colors hover:text-[#292a2e]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="my-12 border-t border-dashed border-[#d4d6db]" />

        <div className="flex flex-col items-start gap-2 text-xs leading-[1.7] text-[#9b9da3] md:text-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>서울특별시 성동구</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>대표자: 전진현</span>
            <span>대표이메일: u.lento25@gmail.com</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <span className="text-sm text-[#9b9da3]">
            © 2026 축제랑. All rights reserved.
          </span>

          <a
            href="https://www.instagram.com/with.festival?igsh=amZ1MHJxcTNoaWho"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#9b9da3] transition-colors hover:text-[#5f616a]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

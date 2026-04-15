import Link from "next/link";

const LEGAL_LINKS = [
  { label: "개인정보처리방침", href: "/privacy", isBold: true },
  { label: "이용약관", href: "/terms", isBold: false },
  { label: "사업자정보확인", href: "/business-info", isBold: false },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white py-10 md:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 md:px-12">
        {/* 1. 약관 및 정책 링크 */}
        <nav className="flex flex-wrap items-center gap-6">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm text-gray-600 underline underline-offset-4 transition-colors hover:text-gray-900 ${
                link.isBold ? "font-bold" : "font-medium"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 2. 사업자 정보 (시맨틱 웹 표준: address 태그 사용) */}
        <address className="flex flex-col gap-2 font-normal not-italic text-sm text-gray-400 break-keep">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>축제랑</span>
            <span>서울특별시 성동구</span>
            <span>사업자등록번호: 111-11-111111</span>
            <span>통신판매업 신고번호: 어쩌구 </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>대표자: 전XX</span>
            <span>고객센터: 010-1234-1234</span>
            <span>대표이메일: u.lento25@gmail.com</span>
          </div>
        </address>

        {/* 3. 저작권 표기 */}
        <p className="text-sm text-gray-400 mt-2">
          &copy; WithFestival. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";

const LEGAL_LINKS = [
  { label: "개인정보처리방침", href: "/privacy", isBold: true },
  { label: "이용약관", href: "/terms", isBold: false },
  { label: "사업자정보확인", href: "/business-info", isBold: false },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/with.festival?igsh=MXJlY2tmc2lwMDg0cQ==",
    icon: (
      <Image
        src={"/icons/ic_instagram.png"}
        alt="insta"
        width={25}
        height={25}
      />
    ),
  },
  {
    label: "Github",
    href: "https://github.com/orgs/Sikdorang/repositories",
    icon: (
      <Image src={"/icons/ic_github.png"} alt="insta" width={25} height={25} />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white py-10 md:py-16 border-t border-gray-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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

          {/* 2. SNS 아이콘 링크 섹션 추가 */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 transition-colors hover:text-gray-900 hover:bg-gray-100 rounded-full"
                aria-label={social.label}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* 3. 사업자 정보 */}
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

        {/* 4. 저작권 표기 */}
        <p className="text-sm text-gray-400 mt-2">
          &copy; WithFestival. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}

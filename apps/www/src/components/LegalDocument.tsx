import Link from "next/link";

export default function LegalDocument({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white pt-28 pb-24 md:pt-32 md:pb-32">
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5f616a] transition-colors hover:text-[#292a2e]"
        >
          ← 홈으로
        </Link>

        <header className="mt-10 md:mt-14">
          <p className="text-xs font-medium text-[#92949d] md:text-sm">
            시행일: {effectiveDate}
          </p>
          <h1 className="mt-4 text-[36px] font-semibold tracking-[-0.01em] leading-[1.25] text-[#292a2e] md:text-[48px]">
            {title}
          </h1>
        </header>

        <article className="prose mt-12 md:mt-16">{children}</article>
      </div>
    </main>
  );
}

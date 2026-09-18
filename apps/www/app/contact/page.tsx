import ContactForm from "@/src/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto w-full max-w-2xl px-5 md:px-8">
        <header className="mb-10 md:mb-14">
          <h1 className="text-[40px] font-semibold tracking-[-0.01em] leading-[1.7] text-[#292a2e] md:text-[52px]">
            문의하기
          </h1>
          <p className="mt-4 text-[15px] leading-[1.7] text-[#5f616a] md:text-base">
            축제랑 도입·제휴·기타 문의를 메일(
            <a
              href="mailto:sikdorang2026@gmail.com"
              className="font-medium text-[#292a2e] underline underline-offset-2"
            >
              sikdorang2026@gmail.com
            </a>
            )로 보내 주세요. 다른 방식이 편하다면{" "}
            <a
              href="https://www.instagram.com/with.festival/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#292a2e] underline underline-offset-2"
            >
              인스타그램 DM
            </a>
            도 환영합니다.
          </p>
        </header>
        <ContactForm />
      </div>
    </main>
  );
}

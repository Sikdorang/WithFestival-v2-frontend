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
            축제랑 도입·제휴·기타 어떤 문의든 보내주세요. 담당자가 영업일 기준
            1~2일 내로 회신드릴게요.
          </p>
        </header>
        <ContactForm />
      </div>
    </main>
  );
}

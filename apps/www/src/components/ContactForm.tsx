"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./ui/Button";

type Status = "idle" | "success";

const TYPES = ["도입 문의", "가격 문의", "제휴", "기타"] as const;

const CONTACT_EMAIL = "sikdorang2026@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/with.festival/";

function buildMailto(fields: {
  name: string;
  email: string;
  phone: string;
  organization: string;
  type: string;
  message: string;
}) {
  const typeLabel = fields.type || "일반";
  const subject = encodeURIComponent(
    `[축제랑 문의] ${typeLabel} — ${fields.name}`,
  );
  const lines = [
    "축제랑 도입 문의입니다.",
    "",
    `이름: ${fields.name}`,
    `회신 이메일: ${fields.email}`,
    fields.phone ? `연락처: ${fields.phone}` : null,
    fields.organization ? `소속/학교: ${fields.organization}` : null,
    `문의 유형: ${typeLabel}`,
    "",
    "메시지:",
    fields.message,
  ].filter((line): line is string => line !== null);

  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [isValid, setIsValid] = useState(false);

  function handleInput(e: FormEvent<HTMLFormElement>) {
    setIsValid(e.currentTarget.checkValidity());
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    const fd = new FormData(form);
    const mailto = buildMailto({
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      organization: String(fd.get("organization") ?? "").trim(),
      type: String(fd.get("type") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    });

    window.location.href = mailto;
    form.reset();
    setIsValid(false);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-[24px] border border-[#36383e1a] bg-[#f7f8fa] p-10 text-center md:p-14">
        <p className="text-2xl font-semibold tracking-[-0.01em] text-[#292a2e]">
          메일 앱이 열렸습니다
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#5f616a]">
          작성된 내용을 확인한 뒤 <strong>전송</strong>을 눌러 주세요.
          <br />
          수신 주소는{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-[#292a2e] underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          입니다.
        </p>
        <InstagramHint className="mt-6" />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => setStatus("idle")}
          className="mt-8"
        >
          새 문의 작성
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onInput={handleInput}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="이름" required>
          <input
            name="name"
            required
            className="form-input"
            placeholder="홍길동"
          />
        </Field>
        <Field label="이메일" required>
          <input
            type="email"
            name="email"
            required
            className="form-input"
            placeholder="name@example.com"
          />
        </Field>
        <Field label="연락처">
          <input
            type="tel"
            name="phone"
            className="form-input"
            placeholder="010-0000-0000"
          />
        </Field>
        <Field label="소속 / 학교">
          <input
            name="organization"
            className="form-input"
            placeholder="OO대학교 총학생회"
          />
        </Field>
      </div>

      <Field label="문의 유형">
        <select name="type" defaultValue="" className="form-input form-select">
          <option value="" disabled>
            문의 유형을 선택해주세요
          </option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="메시지" required>
        <textarea
          name="message"
          required
          rows={6}
          className="form-input resize-none"
          placeholder="자세한 문의 내용을 적어주세요."
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!isValid}
        className="mt-2"
      >
        메일로 문의 보내기
      </Button>

      <InstagramHint className="mt-2 text-center" />

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #c8c9cd;
          background: #ffffff;
          padding: 14px 16px;
          font-size: 15px;
          line-height: 1.4;
          color: #292a2e;
          outline: none;
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
        }
        :global(.form-input::placeholder) {
          color: #92949d;
        }
        :global(.form-input:focus) {
          border-color: #292a2e;
          box-shadow: 0 0 0 3px #292a2e1a;
        }
        :global(.form-select) {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 48px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none'><path d='M6 9l6 6 6-6' stroke='%235f616a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 20px 20px;
        }
        :global(.form-select:invalid) {
          color: #92949d;
        }
        :global(.form-select option) {
          color: #292a2e;
        }
        :global(.form-select option[value=""]) {
          color: #92949d;
        }
      `}</style>
    </form>
  );
}

function InstagramHint({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm leading-relaxed text-[#5f616a] ${className}`}>
      다르게 문의하고 싶다면{" "}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#292a2e] underline underline-offset-2 transition-colors hover:text-[#5f616a]"
      >
        인스타그램 DM
      </a>
      으로도 연락할 수 있어요.
    </p>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[#292a2e]">
        {label}
        {required && <span className="ml-1 text-[#de5252]">*</span>}
      </span>
      {children}
    </label>
  );
}

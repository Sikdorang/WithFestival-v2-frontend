"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

const TYPES = ["도입 문의", "가격 문의", "제휴", "기타"] as const;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isValid, setIsValid] = useState(false);

  function handleInput(e: FormEvent<HTMLFormElement>) {
    setIsValid(e.currentTarget.checkValidity());
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      organization: fd.get("organization"),
      type: fd.get("type"),
      message: fd.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "전송에 실패했습니다.");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("네트워크 오류가 발생했습니다.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[24px] border border-[#36383e1a] bg-[#f7f8fa] p-10 text-center md:p-14">
        <p className="text-2xl font-semibold tracking-[-0.01em] text-[#292a2e]">
          문의가 정상 접수되었습니다.
        </p>
        <p className="mt-3 text-[15px] text-[#5f616a]">
          담당자가 영업일 기준 1~2일 내로 회신드릴게요.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            setIsValid(false);
            setStatus("idle");
          }}
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

      {status === "error" && (
        <p className="rounded-2xl bg-[#fff0f0] px-4 py-3 text-sm font-medium text-[#de5252]">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={status === "submitting"}
        loadingLabel="전송 중"
        disabled={!isValid}
        className="mt-2"
      >
        문의 보내기
      </Button>

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

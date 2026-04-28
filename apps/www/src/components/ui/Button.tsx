"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "relative inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292a2e]/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

const disabledStyles =
  "disabled:bg-[#eeeff2] disabled:text-[#92949d] disabled:border-transparent disabled:shadow-none disabled:hover:bg-[#eeeff2] disabled:hover:border-transparent disabled:hover:text-[#92949d]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#292a2e] text-white shadow-[0_8px_24px_rgba(41,42,46,0.16)] hover:bg-[#36383e] active:bg-[#1f2024]",
  secondary:
    "border border-[#36383e33] bg-white text-[#292a2e] hover:border-[#292a2e] hover:bg-[#f7f8fa] active:bg-[#eeeff2]",
  ghost: "text-[#292a2e] hover:bg-[#36383e0d] active:bg-[#36383e1a]",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-7 py-3.5 text-sm md:text-base",
  lg: "px-7 py-4 text-base",
  icon: "p-2",
};

function LoadingDots() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center gap-1.5"
    >
      <span className="btn-dot" style={{ animationDelay: "-0.32s" }} />
      <span className="btn-dot" style={{ animationDelay: "-0.16s" }} />
      <span className="btn-dot" />
    </span>
  );
}

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingLabel?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel = "처리 중",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        disabledStyles,
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-opacity",
          loading && "opacity-0",
        )}
      >
        {children}
      </span>
      {loading && (
        <>
          <LoadingDots />
          <span className="sr-only">{loadingLabel}</span>
        </>
      )}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

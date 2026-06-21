import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("text-pine", className)}
    >
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      {/* abstract lotus / continuous-line bloom */}
      <path
        d="M20 30 C20 22 14 18 9 16 C13 22 16 26 20 30 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M20 30 C20 22 26 18 31 16 C27 22 24 26 20 30 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M20 30 C20 20 20 14 20 9 C23 16 23 24 20 30 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="9" r="1.6" fill="var(--gold)" />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)}>
      <LogoMark className="size-9 transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.15rem] font-medium tracking-tight text-ink">
          Dr. Priyal Agarwal
        </span>
        {!compact && (
          <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-pine/80">
            Women&apos;s Health &amp; Care
          </span>
        )}
      </span>
    </Link>
  );
}

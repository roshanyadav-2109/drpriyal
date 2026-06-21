"use client";

import * as React from "react";
import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function WhatsAppFab() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
        "Hi Dr. Priyal's team, I'd like to ask about a consultation.",
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-sand bg-paper py-2 pl-2 pr-4 shadow-[var(--shadow-lift)] transition-all duration-500 hover:border-pine/40",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <span className="relative">
        <span className="relative block size-12 overflow-hidden rounded-full ring-2 ring-pine/20">
          <Image src="/namaste.jpg" alt="Namaste from our care team" fill className="object-cover" sizes="48px" />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-paper bg-[#25D366]" />
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[0.7rem] text-ink-faint">Namaste 🙏 We&apos;re online</span>
        <span className="text-sm font-semibold text-ink">Chat with us</span>
      </span>
    </a>
  );
}

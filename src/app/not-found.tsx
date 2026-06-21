import Link from "next/link";
import { Home, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";
import { LotusLine } from "@/components/decor/motifs";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-5 text-center">
      <LogoMark className="size-12" />
      <p className="mt-8 font-serif text-7xl text-pine">404</p>
      <h1 className="mt-4 font-serif text-3xl">This page took a little detour</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        We couldn&apos;t find the page you were looking for. Let&apos;s get you back on track.
      </p>
      <LotusLine className="mt-8 h-12 w-20 opacity-70" />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/book">
            <CalendarHeart /> Book a consultation
          </Link>
        </Button>
      </div>
    </main>
  );
}

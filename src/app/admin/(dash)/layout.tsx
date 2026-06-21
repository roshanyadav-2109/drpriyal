import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Stethoscope,
  MessageSquareQuote,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { LogoMark } from "@/components/layout/logo";

export const metadata = { title: "Admin", robots: { index: false } };

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/consultations", label: "Consultations & Rx", icon: Stethoscope },
  { href: "/admin/blog", label: "Blog & Content", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

async function signOut() {
  "use server";
  const jar = await cookies();
  jar.delete("dpa_admin");
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sand bg-paper p-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          <LogoMark className="size-8" />
          <div className="leading-tight">
            <p className="font-serif text-sm">Dr. Priyal Agarwal</p>
            <p className="text-[0.65rem] uppercase tracking-wider text-ink-faint">Admin</p>
          </div>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-bone hover:text-ink"
            >
              <n.icon className="size-4.5" />
              {n.label}
            </Link>
          ))}
        </nav>

        <form action={signOut}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-bone hover:text-danger">
            <LogOut className="size-4.5" /> Sign out
          </button>
        </form>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-sand bg-paper px-5 py-3 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="font-serif text-sm">Admin</span>
          </Link>
          <form action={signOut}>
            <button className="text-sm text-ink-soft hover:text-danger">Sign out</button>
          </form>
        </header>
        <div className="flex gap-1 overflow-x-auto border-b border-sand bg-paper px-3 py-2 lg:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs text-ink-soft hover:bg-bone"
            >
              {n.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

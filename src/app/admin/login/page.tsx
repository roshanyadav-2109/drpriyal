import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoMark } from "@/components/layout/logo";

export const metadata = { title: "Admin Sign In", robots: { index: false } };

async function signIn(formData: FormData) {
  "use server";
  const passcode = String(formData.get("passcode") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");
  const expected = process.env.ADMIN_PASSCODE || "priyal-admin";
  if (passcode === expected) {
    const jar = await cookies();
    jar.set("dpa_admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
      secure: process.env.NODE_ENV === "production",
    });
    redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
  }
  redirect("/admin/login?error=1");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect: redirectTo } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="mt-4 font-serif text-2xl">Practice Admin</h1>
          <p className="mt-1 text-sm text-ink-soft">Dr. Priyal Agarwal — back office</p>
        </div>
        <form action={signIn} className="rounded-2xl border border-sand bg-paper p-7 shadow-[var(--shadow-soft)]">
          <input type="hidden" name="redirect" value={redirectTo ?? "/admin"} />
          <Label htmlFor="passcode">Passcode</Label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-sand px-3 focus-within:border-pine">
            <Lock className="size-4 text-ink-faint" />
            <Input
              id="passcode"
              name="passcode"
              type="password"
              autoComplete="current-password"
              placeholder="Enter admin passcode"
              className="border-0 px-0 shadow-none focus-visible:ring-0"
              autoFocus
            />
          </div>
          {error && <p className="mt-3 text-sm text-danger">Incorrect passcode. Please try again.</p>}
          <Button type="submit" className="mt-5 w-full">
            Sign in
          </Button>
          <p className="mt-4 text-xs text-ink-faint">
            Set <code className="rounded bg-bone px-1">ADMIN_PASSCODE</code> in your environment.
            Default is <code className="rounded bg-bone px-1">priyal-admin</code>.
          </p>
        </form>
      </div>
    </main>
  );
}

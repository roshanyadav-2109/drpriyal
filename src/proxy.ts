import { NextResponse, type NextRequest } from "next/server";

/**
 * AUTH-FREE site: patients never log in. Trackers are local-first and booking
 * is guest-based. The ONLY gated area is the doctor's /admin back-office, which
 * uses a single lightweight passcode cookie (not user accounts).
 *
 * (Next.js 16 renamed the `middleware` convention to `proxy`.)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const ok = request.cookies.get("dpa_admin")?.value === "1";
    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

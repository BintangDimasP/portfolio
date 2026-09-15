import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEVICE_COOKIE_NAME,
  ADMIN_DEVICE_SECRET,
  getExpectedDeviceToken,
  isValidDeviceToken,
} from "@/lib/device-auth";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Endpoint Aktivasi Perangkat Rahasia: /admin/activate?key=...
  if (pathname === "/admin/activate") {
    const key = searchParams.get("key");
    if (key && key === ADMIN_DEVICE_SECRET) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.set({
        name: DEVICE_COOKIE_NAME,
        value: getExpectedDeviceToken(),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 tahun
      });
      return response;
    }
    // Jika key salah atau tidak ada, sembunyikan dengan 404 (stealth)
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }

  // 2. Endpoint Deaktivasi: /admin/deactivate (untuk mencabut izin device ini)
  if (pathname === "/admin/deactivate") {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete(DEVICE_COOKIE_NAME);
    response.cookies.delete("portfolio_admin_session");
    return response;
  }

  // 3. Validasi cookie perangkat terpercaya (Trusted Device)
  const deviceCookie = request.cookies.get(DEVICE_COOKIE_NAME)?.value;
  const isTrusted = isValidDeviceToken(deviceCookie);

  if (!isTrusted) {
    // Perangkat asing / tidak terdaftar -> Tampilkan 404 Not Found (seperti halaman tidak ada)
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }

  // Perangkat sah terdaftar -> Lanjutkan ke routing Next.js normal
  return NextResponse.next();
}

// Kompatibilitas export
export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};

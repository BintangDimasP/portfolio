import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "portfolio_admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_SECRET = process.env.ADMIN_DEVICE_SECRET || "bd_admin_hmac_secret_salt_2026";

/**
 * Menghasilkan token sesi admin menggunakan HMAC-SHA256 cryptographically secure.
 */
function getExpectedToken(): string {
  return crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(`portfolio_admin_auth_v2:${ADMIN_PASSWORD}:signed_session`)
    .digest("hex");
}

/**
 * Token legacy base64 untuk kompatibilitas sesi yang sudah aktif.
 */
function getLegacyToken(): string {
  return Buffer.from(`admin_authenticated:${ADMIN_PASSWORD}`).toString("base64");
}

/**
 * Memverifikasi keabsahan sesi admin saat ini.
 * Mendukung migrasi mulus dari token lama ke HMAC-SHA256 tanpa membuat user ter-logout.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return false;

  const expected = getExpectedToken();
  const token = sessionCookie.value;

  // 1. Verifikasi token HMAC-SHA256 saat ini
  if (token.length === expected.length) {
    try {
      if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
        return true;
      }
    } catch {}
  }

  // 2. Kompatibilitas sesi lama (Base64) -> otomatis upgrade ke HMAC baru
  const legacy = getLegacyToken();
  if (token === legacy) {
    try {
      cookieStore.set(ADMIN_COOKIE_NAME, expected, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch {}
    return true;
  }

  return false;
}

/**
 * Login admin dengan verifikasi password dan penyematan cookie HMAC aman.
 */
export async function loginAdmin(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, getExpectedToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });
    return true;
  }
  return false;
}

/**
 * Logout admin dengan menghapus cookie sesi.
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

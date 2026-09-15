import crypto from "crypto";

export const DEVICE_COOKIE_NAME = "trusted_admin_device";
export const ADMIN_DEVICE_SECRET = process.env.ADMIN_DEVICE_SECRET || "bd_device_sec_7a9f8b2c1e4d3f5a6b0c8d1e2f3a4b5c";

/**
 * Menghasilkan token hash perangkat dari secret key di .env.local.
 * Raw secret tidak pernah disimpan di cookie, hanya HMAC-SHA256 hash.
 */
export function getExpectedDeviceToken(): string {
  return crypto
    .createHmac("sha256", ADMIN_DEVICE_SECRET)
    .update("portfolio_trusted_device_salt_v1")
    .digest("hex");
}

/**
 * Memvalidasi apakah cookie perangkat cocok dengan token yang diharapkan.
 * Menggunakan timingSafeEqual untuk mencegah serangan timing-attack.
 */
export function isValidDeviceToken(token?: string | null): boolean {
  if (!token) return false;
  const expected = getExpectedDeviceToken();
  if (typeof token !== "string" || token.length !== expected.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

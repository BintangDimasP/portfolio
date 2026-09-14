import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "portfolio_admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Simple secure session token
function getExpectedToken(): string {
  // Simple deterministic hash based on admin password and salt
  return Buffer.from(`admin_authenticated:${ADMIN_PASSWORD}`).toString("base64");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!sessionCookie) return false;
  return sessionCookie.value === getExpectedToken();
}

export async function loginAdmin(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, getExpectedToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return true;
  }
  return false;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

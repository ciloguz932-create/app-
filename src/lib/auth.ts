import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const DEV_SECRET = "lumina-dev-secret-change-in-production";
const rawSecret = process.env.AUTH_SECRET ?? DEV_SECRET;

// Fail loudly on real deployments instead of silently signing sessions
// with a publicly-known secret.
if (process.env.VERCEL && rawSecret === DEV_SECRET) {
  throw new Error(
    "AUTH_SECRET is not set (or still the dev default). Set a strong random AUTH_SECRET in your deployment environment variables."
  );
}

const SECRET = new TextEncoder().encode(rawSecret);

const COOKIE_NAME = "lumina_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  plan: string;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role, plan: payload.plan })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (!payload.sub) return null;
    return {
      userId: payload.sub,
      email: (payload.email as string) ?? "",
      role: (payload.role as string) ?? "user",
      plan: (payload.plan as string) ?? "free",
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Only callable from Route Handlers / Server Actions
export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export { COOKIE_NAME };

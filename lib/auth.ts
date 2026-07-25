import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET || "gelistirme-ortami-gizli-anahtari-degistir";
const secret = new TextEncoder().encode(secretKey);

// E-postayı asla düz metin saklamıyoruz, tek yönlü hash'liyoruz.
export function hashEmail(email: string): string {
  return crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function compareCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

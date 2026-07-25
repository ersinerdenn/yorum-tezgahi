import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifySessionToken } from "./auth";

export const SESSION_COOKIE = "yt_session";

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.userId } });
}

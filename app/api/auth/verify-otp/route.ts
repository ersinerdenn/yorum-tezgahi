import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashEmail, compareCode, createSessionToken } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/session";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  displayName: z.string().min(2).max(40).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz bilgi." }, { status: 400 });

  const { email, code, displayName } = parsed.data;
  const emailHash = hashEmail(email);

  const otp = await prisma.otpCode.findFirst({
    where: { emailHash, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return NextResponse.json({ error: "Kod süresi dolmuş, yeniden kod iste." }, { status: 400 });

  const valid = await compareCode(code, otp.codeHash);
  if (!valid) return NextResponse.json({ error: "Kod yanlış." }, { status: 400 });

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

  let user = await prisma.user.findUnique({ where: { emailHash } });
  if (!user) {
    user = await prisma.user.create({ data: { emailHash, displayName: displayName?.trim() || email.split("@")[0] } });
  }

  const token = await createSessionToken(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashEmail, generateOtpCode, hashCode } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçerli bir e-posta adresi gir." }, { status: 400 });

  const { email } = parsed.data;
  const emailHash = hashEmail(email);
  const code = generateOtpCode();
  const codeHash = await hashCode(code);

  await prisma.otpCode.create({
    data: { emailHash, codeHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });

  await sendOtpEmail(email, code);
  return NextResponse.json({ ok: true });
}

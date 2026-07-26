import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const schema = z.object({
  overallRating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(2000),
  usageDuration: z.string().max(100).optional(),
  metricScores: z.record(z.number().min(1).max(5)).optional(),
  receiptUrl: z.string().url().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });

  const existing = await prisma.review.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Yorum bulunamadı." }, { status: 404 });
  if (existing.userId !== user.id) return NextResponse.json({ error: "Bu yorum sana ait değil." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Form bilgileri eksik veya hatalı." }, { status: 400 });

  const { overallRating, title, body: reviewBody, usageDuration, metricScores, receiptUrl } = parsed.data;

  await prisma.review.update({
    where: { id: params.id },
    data: {
      overallRating,
      title,
      body: reviewBody,
      usageDuration,
      receiptUrl: receiptUrl ?? existing.receiptUrl,
      verifiedPurchase: Boolean(receiptUrl ?? existing.receiptUrl),
      metricScores: metricScores
        ? {
            deleteMany: {},
            create: Object.entries(metricScores).map(([key, score]) => ({ key, score })),
          }
        : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });

  const existing = await prisma.review.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Yorum bulunamadı." }, { status: 404 });
  if (existing.userId !== user.id) return NextResponse.json({ error: "Bu yorum sana ait değil." }, { status: 403 });

  await prisma.reviewMetricScore.deleteMany({ where: { reviewId: params.id } });
  await prisma.review.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const schema = z.object({
  productSlug: z.string(),
  overallRating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(2000),
  usageDuration: z.string().max(100).optional(),
  metricScores: z.record(z.number().min(1).max(5)).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Yorum yazmak için giriş yapmalısın." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Form bilgileri eksik veya hatalı." }, { status: 400 });
  }

  const { productSlug, overallRating, title, body: reviewBody, usageDuration, metricScores } = parsed.data;

  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: {
      productId: product.id,
      userId: user.id,
      overallRating,
      title,
      body: reviewBody,
      usageDuration,
      metricScores: metricScores
        ? { create: Object.entries(metricScores).map(([key, score]) => ({ key, score })) }
        : undefined,
    },
  });

  return NextResponse.json({ ok: true, reviewId: review.id });
}

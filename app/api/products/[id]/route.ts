import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isAdminUser } from "@/lib/admin";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!isAdminUser(user)) return NextResponse.json({ error: "Yetkin yok." }, { status: 403 });

  const reviews = await prisma.review.findMany({ where: { productId: params.id } });
  for (const r of reviews) await prisma.reviewMetricScore.deleteMany({ where: { reviewId: r.id } });
  await prisma.review.deleteMany({ where: { productId: params.id } });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { slugify } from "@/lib/slugify";

const schema = z.object({
  subcategorySlug: z.string(),
  brand: z.string().min(1).max(60),
  model: z.string().min(1).max(80),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Ürün eklemek için giriş yapmalısın." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Form bilgileri eksik veya hatalı." }, { status: 400 });
  }

  const { subcategorySlug, brand, model } = parsed.data;

  const subcategory = await prisma.subcategory.findUnique({ where: { slug: subcategorySlug } });
  if (!subcategory) {
    return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  }

  const baseSlug = slugify(`${brand}-${model}`);
  if (!baseSlug) {
    return NextResponse.json({ error: "Marka ve model geçerli bir isim oluşturmalı." }, { status: 400 });
  }

  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const product = await prisma.product.create({
    data: { slug, brand: brand.trim(), model: model.trim(), subcategoryId: subcategory.id },
  });

  return NextResponse.json({ ok: true, slug: product.slug });
}

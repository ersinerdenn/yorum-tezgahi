import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://yorumtezgahi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, subcategories] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, createdAt: true } }),
    prisma.subcategory.findMany({ select: { slug: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/gizlilik`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/kosullar`, changeFrequency: "yearly", priority: 0.2 },
  ];
  const categoryEntries: MetadataRoute.Sitemap = subcategories.map((s) => ({ url: `${BASE_URL}/kategori/${s.slug}`, changeFrequency: "daily", priority: 0.7 }));
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({ url: `${BASE_URL}/urun/${p.slug}`, lastModified: p.createdAt, changeFrequency: "weekly", priority: 0.9 }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}

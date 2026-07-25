import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RatingTag from "../../components/RatingTag";

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const subcategory = await prisma.subcategory.findUnique({ where: { slug: params.slug }, include: { products: { include: { reviews: true } } } });
  if (!subcategory) notFound();

  const products = subcategory.products.map((p) => {
    const count = p.reviews.length;
    const avg = count > 0 ? p.reviews.reduce((s, r) => s + r.overallRating, 0) / count : 0;
    return { ...p, reviewCount: count, rating: avg };
  });

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <div className="border-b border-ink py-8">
        <p className="font-mono text-xs uppercase tracking-widest text-steel">Kategori</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{subcategory.name}</h1>
      </div>
      <section className="py-10">
        {products.length === 0 ? (
          <div className="border border-dashed border-line bg-white p-6 text-sm text-steel">
            <p>Bu kategoride henüz ürün yok.</p>
            <Link href={`/urun-ekle?kategori=${subcategory.slug}`} className="mt-3 inline-block border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors focus-ring">
              İlk ürünü sen ekle
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.slug} href={`/urun/${p.slug}`} className="border border-ink bg-white p-5 transition-shadow hover:shadow-[4px_4px_0_#1B1E23] focus-ring">
                <p className="font-mono text-xs uppercase tracking-wide text-steel">{p.brand}</p>
                <h3 className="mt-1 font-display text-lg font-bold leading-snug">{p.model}</h3>
                <div className="tear-line my-4" />
                <div className="flex items-center justify-between">
                  <RatingTag score={p.rating} />
                  <span className="font-mono text-xs text-steel">{p.reviewCount} yorum</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

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
    <main className="mx-auto max-w-5xl px-6 pb-24">
      <div className="pt-10 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Kategori</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink">{subcategory.name}</h1>
      </div>
      <section className="py-6">
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-steel">
            <p>Bu kategoride henüz ürün yok.</p>
            <Link href={`/urun-ekle?kategori=${subcategory.slug}`} className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">
              İlk ürünü sen ekle
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.slug} href={`/urun/${p.slug}`} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-ring">
                <p className="text-xs font-medium text-steelLight">{p.brand}</p>
                <h3 className="mt-1 font-semibold text-ink">{p.model}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <RatingTag score={p.rating} />
                  <span className="text-xs text-steelLight">{p.reviewCount} yorum</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

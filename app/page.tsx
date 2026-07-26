import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RatingTag from "./components/RatingTag";

export const revalidate = 0;

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: { subcategories: { include: { _count: { select: { products: true } } } } },
  });
  const products = await prisma.product.findMany({ include: { reviews: true } });

  const featured = products
    .map((p) => {
      const count = p.reviews.length;
      const avg = count > 0 ? p.reviews.reduce((s, r) => s + r.overallRating, 0) / count : 0;
      const verified = p.reviews.some((r) => r.verifiedPurchase);
      return { ...p, reviewCount: count, rating: avg, verified };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24">
      <section className="pt-14 pb-10 sm:pt-20">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          Satın almadan önce <span className="text-amber">tezgaha yatır.</span>
        </h1>
        <p className="mt-4 max-w-md text-steel">
          Doğrulanmış alıcılardan gerçek kullanım deneyimleri. Reklam değil, sahte yorum değil — sadece kullananların anlattıkları.
        </p>
        <form action="/ara" className="mt-6 flex max-w-md items-center rounded-full border border-line bg-white px-2 py-1.5 shadow-sm">
          <input name="q" placeholder="ör. iPhone 15, Galaxy Buds, MacBook…" className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-steelLight" />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">İncele</button>
        </form>
      </section>

      <section className="py-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-steel">Kategoriler</h2>
        <div className="space-y-7">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-steelLight">{cat.name}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {cat.subcategories.map((c) => (
                  <Link key={c.slug} href={`/kategori/${c.slug}`} className="rounded-xl border border-line bg-white p-4 text-center transition-colors hover:border-amber focus-ring">
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="mt-0.5 text-xs text-steelLight">{c._count.products} ürün</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-steel">En çok yorumlananlar</h2>
        {featured.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-steel">Henüz ürün eklenmedi.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.slug} href={`/urun/${p.slug}`} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-ring">
                <p className="text-xs font-medium text-steelLight">{p.brand}</p>
                <h3 className="mt-1 font-semibold text-ink">{p.model}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <RatingTag score={p.rating} />
                  <span className="text-xs text-steelLight">{p.reviewCount} yorum</span>
                </div>
                {p.verified && <p className="mt-3 text-xs font-medium text-teal">● Doğrulanmış alışverişler mevcut</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

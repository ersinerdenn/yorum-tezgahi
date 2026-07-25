import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RatingTag from "./components/RatingTag";

export const revalidate = 0;

export default async function HomePage() {
  const subcategories = await prisma.subcategory.findMany({ include: { _count: { select: { products: true } } } });
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
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <section className="border-b border-ink py-14 sm:py-20">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-steel">Kayıt no. 000001 — Kuruluş 2026</p>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Satın almadan önce <span className="underline decoration-amber decoration-4 underline-offset-4">tezgaha yatır.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-steel sm:text-lg">Doğrulanmış alıcılardan gerçek kullanım deneyimleri. Reklam değil, sahte yorum değil — sadece kullananların anlattıkları.</p>
        <form action="/ara" className="mt-8 flex max-w-lg border border-ink bg-white">
          <input name="q" placeholder="ör. iPhone 15, Galaxy Buds, MacBook…" className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-steelLight" />
          <button type="submit" className="shrink-0 border-l border-ink bg-ink px-5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-steel transition-colors focus-ring">İncele</button>
        </form>
      </section>

      <section className="py-12">
        <h2 className="mb-5 font-display text-xl font-bold">Kategoriler</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {subcategories.map((c) => (
            <Link key={c.slug} href={`/kategori/${c.slug}`} className="group border border-ink bg-white p-4 transition-colors hover:bg-ink hover:text-paper focus-ring">
              <p className="font-display font-semibold">{c.name}</p>
              <p className="mt-1 font-mono text-xs text-steel group-hover:text-steelLight">{c._count.products} ürün</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="mb-5 font-display text-xl font-bold">En çok yorumlananlar</h2>
        {featured.length === 0 ? (
          <p className="border border-dashed border-line bg-white p-6 text-sm text-steel">Henüz ürün eklenmedi.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.slug} href={`/urun/${p.slug}`} className="border border-ink bg-white p-5 transition-shadow hover:shadow-[4px_4px_0_#1B1E23] focus-ring">
                <p className="font-mono text-xs uppercase tracking-wide text-steel">{p.brand}</p>
                <h3 className="mt-1 font-display text-lg font-bold leading-snug">{p.model}</h3>
                <div className="tear-line my-4" />
                <div className="flex items-center justify-between">
                  <RatingTag score={p.rating} />
                  <span className="font-mono text-xs text-steel">{p.reviewCount} yorum</span>
                </div>
                {p.verified && <p className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-teal">● Doğrulanmış alışverişler mevcut</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

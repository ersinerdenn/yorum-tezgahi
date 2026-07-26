import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RatingTag from "../components/RatingTag";

export const revalidate = 0;

export default async function AramaPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q || "").trim();

  const products = query
    ? await prisma.product.findMany({
        where: { OR: [{ brand: { contains: query, mode: "insensitive" } }, { model: { contains: query, mode: "insensitive" } }] },
        include: { reviews: true },
      })
    : [];

  const results = products.map((p) => {
    const count = p.reviews.length;
    const avg = count > 0 ? p.reviews.reduce((s, r) => s + r.overallRating, 0) / count : 0;
    return { ...p, reviewCount: count, rating: avg };
  });

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24">
      <div className="pt-10 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Arama sonuçları</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
          {query ? `"${query}" için ${results.length} sonuç` : "Ne aramıştın?"}
        </h1>
        <form action="/ara" className="mt-6 flex max-w-md items-center rounded-full border border-line bg-white px-2 py-1.5 shadow-sm">
          <input name="q" defaultValue={query} placeholder="ör. iPhone 15, Galaxy Buds, MacBook…" className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-steelLight" />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">Ara</button>
        </form>
      </div>

      <section className="py-6">
        {!query ? (
          <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-steel">Marka veya model adı yazıp aramayı dene.</p>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-steel">
            <p>"{query}" ile eşleşen bir ürün bulamadık.</p>
            <Link href="/urun-ekle" className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">Bu ürünü sen ekle</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
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

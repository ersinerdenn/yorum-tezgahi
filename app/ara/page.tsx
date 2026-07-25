import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RatingTag from "../components/RatingTag";

export const revalidate = 0;

export default async function AramaPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || "").trim();

  const products = query
    ? await prisma.product.findMany({
        where: {
          OR: [
            { brand: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { reviews: true },
      })
    : [];

  const results = products.map((p) => {
    const count = p.reviews.length;
    const avg = count > 0 ? p.reviews.reduce((s, r) => s + r.overallRating, 0) / count : 0;
    return { ...p, reviewCount: count, rating: avg };
  });

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <div className="border-b border-ink py-8">
        <p className="font-mono text-xs uppercase tracking-widest text-steel">Arama sonuçları</p>
        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
          {query ? `"${query}" için ${results.length} sonuç` : "Ne aramıştın?"}
        </h1>

        <form action="/ara" className="mt-6 flex max-w-lg border border-ink bg-white">
          <input
            name="q"
            defaultValue={query}
            placeholder="ör. iPhone 15, Galaxy Buds, MacBook…"
            className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-steelLight"
          />
          <button
            type="submit"
            className="shrink-0 border-l border-ink bg-ink px-5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-steel transition-colors focus-ring"
          >
            Ara
          </button>
        </form>
      </div>

      <section className="py-10">
        {!query ? (
          <p className="border border-dashed border-line bg-white p-6 text-sm text-steel">
            Marka veya model adı yazıp aramayı dene.
          </p>
        ) : results.length === 0 ? (
          <p className="border border-dashed border-line bg-white p-6 text-sm text-steel">
            "{query}" ile eşleşen bir ürün bulamadık. Farklı bir kelimeyle dene, ya da yakında ürün ekleme
            özelliğiyle bu ürünü sen ekleyebileceksin.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <Link
                key={p.slug}
                href={`/urun/${p.slug}`}
                className="border border-ink bg-white p-5 transition-shadow hover:shadow-[4px_4px_0_#1B1E23] focus-ring"
              >
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RatingTag from "../../components/RatingTag";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      subcategory: true,
      reviews: {
        include: { user: true, metricScores: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const reviewCount = product.reviews.length;
  const avgRating =
    reviewCount > 0
      ? product.reviews.reduce((s, r) => s + r.overallRating, 0) / reviewCount
      : 0;

  const metricSchema: { key: string; label: string }[] = JSON.parse(
    product.subcategory.metricSchema
  );

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24">
      <div className="border-b border-ink py-8">
        <Link href={`/kategori/${product.subcategory.slug}`} className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink">
          ← {product.subcategory.name}
        </Link>
        <p className="mt-3 font-mono text-xs uppercase tracking-wide text-steel">{product.brand}</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{product.model}</h1>

        <div className="mt-5 flex items-center gap-4">
          <RatingTag score={avgRating} size="lg" />
          <span className="font-mono text-sm text-steel">{reviewCount} yorum</span>
        </div>
      </div>

      <section className="border-b border-ink py-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Yorumlar</h2>
          <Link href="/giris" className="border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-paper transition-colors focus-ring">
            Yorum yaz
          </Link>
        </div>

        {reviewCount === 0 ? (
          <p className="mt-6 border border-dashed border-line bg-white p-6 text-sm text-steel">
            Bu ürün için henüz yorum yapılmadı. İlk yorumu sen yazabilirsin.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {product.reviews.map((r) => (
              <article key={r.id} className="border border-ink bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <RatingTag score={r.overallRating} size="sm" />
                    <h3 className="font-display font-bold">{r.title}</h3>
                  </div>
                  {r.verifiedPurchase && (
                    <span className="font-mono text-xs text-teal">● Doğrulanmış Alışveriş</span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink">{r.body}</p>

                {r.metricScores.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4">
                    {r.metricScores.map((m) => {
                      const label = metricSchema.find((ms) => ms.key === m.key)?.label ?? m.key;
                      return (
                        <span key={m.id} className="font-mono text-xs text-steel">
                          {label}: <span className="font-semibold text-ink">{m.score}/5</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="tear-line my-4" />
                <div className="flex items-center justify-between font-mono text-xs text-steel">
                  <span>{r.user.displayName}{r.usageDuration ? ` — ${r.usageDuration}` : ""}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

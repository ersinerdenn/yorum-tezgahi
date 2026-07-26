import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import RatingTag from "../../components/RatingTag";
import ReviewForm from "./ReviewForm";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, user] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: params.slug },
      include: { subcategory: true, reviews: { include: { user: true, metricScores: true }, orderBy: { createdAt: "desc" } } },
    }),
    getCurrentUser(),
  ]);

  if (!product) notFound();

  const reviewCount = product.reviews.length;
  const avgRating = reviewCount > 0 ? product.reviews.reduce((s, r) => s + r.overallRating, 0) / reviewCount : 0;
  const metricSchema: { key: string; label: string }[] = JSON.parse(product.subcategory.metricSchema);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24">
      <div className="pt-10 pb-8">
        <Link href={`/kategori/${product.subcategory.slug}`} className="text-xs font-semibold uppercase tracking-wide text-steelLight hover:text-ink">← {product.subcategory.name}</Link>
        <p className="mt-4 text-xs font-medium text-steelLight">{product.brand}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">{product.model}</h1>
        <div className="mt-4 flex items-center gap-3">
          <RatingTag score={avgRating} size="lg" />
          <span className="text-sm text-steel">{reviewCount} yorum</span>
        </div>
      </div>

      <section className="border-t border-line py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">Yorumlar</h2>
          {user ? <ReviewForm productSlug={product.slug} metricSchema={metricSchema} /> : (
            <Link href="/giris" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">Yorum yazmak için giriş yap</Link>
          )}
        </div>

        {reviewCount === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-line bg-white p-6 text-sm text-steel">Bu ürün için henüz yorum yapılmadı. İlk yorumu sen yazabilirsin.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {product.reviews.map((r) => (
              <article key={r.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <RatingTag score={r.overallRating} size="sm" />
                    <h3 className="font-semibold text-ink">{r.title}</h3>
                  </div>
                  {r.verifiedPurchase && <span className="text-xs font-medium text-teal">● Doğrulanmış Alışveriş</span>}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">{r.body}</p>
                {r.receiptUrl && (
                  <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
                    <img src={r.receiptUrl} alt="Fiş / fatura" className="h-20 w-20 rounded-lg border border-line object-cover hover:opacity-80 transition-opacity" />
                  </a>
                )}
                {r.metricScores.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4">
                    {r.metricScores.map((m) => {
                      const label = metricSchema.find((ms) => ms.key === m.key)?.label ?? m.key;
                      return <span key={m.id} className="text-xs text-steel">{label}: <span className="font-semibold text-ink">{m.score}/5</span></span>;
                    })}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-steelLight">
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

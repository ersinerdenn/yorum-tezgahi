import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import RatingTag from "../../components/RatingTag";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import ReviewFilters from "./ReviewFilters";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { reviews: true, subcategory: true } });
  if (!product) return {};
  const count = product.reviews.length;
  const avg = count > 0 ? product.reviews.reduce((s, r) => s + r.overallRating, 0) / count : 0;
  const title = `${product.brand} ${product.model} Yorumları — ${avg > 0 ? avg.toFixed(1) + "/5" : "Henüz Puanlanmadı"}`;
  const description = count > 0
    ? `${product.brand} ${product.model} için ${count} doğrulanmış kullanıcı yorumu. Ortalama puan: ${avg.toFixed(1)}/5.`
    : `${product.brand} ${product.model} hakkında gerçek kullanıcı deneyimlerini oku, sen de yorum yaz.`;
  return { title, description, alternates: { canonical: `/urun/${product.slug}` }, openGraph: { title, description } };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sirala?: string; dogrulanmis?: string };
}) {
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

  let visibleReviews = [...product.reviews];
  if (searchParams.dogrulanmis === "1") visibleReviews = visibleReviews.filter((r) => r.verifiedPurchase);
  switch (searchParams.sirala) {
    case "eski": visibleReviews.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); break;
    case "yuksek": visibleReviews.sort((a, b) => b.overallRating - a.overallRating); break;
    case "dusuk": visibleReviews.sort((a, b) => a.overallRating - b.overallRating); break;
    default: visibleReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.model}`,
    brand: { "@type": "Brand", name: product.brand },
    ...(reviewCount > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: reviewCount },
      review: product.reviews.slice(0, 10).map((r) => ({
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: r.overallRating },
        author: { "@type": "Person", name: r.user.displayName },
        reviewBody: r.body,
        name: r.title,
      })),
    }),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
            <Link href="/giris" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity focus-ring">Yorum yazmak için giriş yap</Link>
          )}
        </div>

        {reviewCount === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-steel shadow-sm">Bu ürün için henüz yorum yapılmadı. İlk yorumu sen yazabilirsin.</p>
        ) : (
          <>
            <div className="mt-5"><Suspense fallback={null}><ReviewFilters /></Suspense></div>
            {visibleReviews.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-steel shadow-sm">Bu filtreye uyan bir yorum yok.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {visibleReviews.map((r) => (
                  <ReviewItem key={r.id} review={{ ...r, createdAt: r.createdAt.toISOString() }} metricSchema={metricSchema} isOwner={user?.id === r.userId} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

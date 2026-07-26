import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import ProductForm from "./ProductForm";

export const revalidate = 0;

export default async function UrunEklePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Ürün Ekle</p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">Önce giriş yapmalısın</h1>
        <p className="mt-4 text-sm text-steel">Tezgaha yeni bir ürün koymak için önce e-postanla giriş yapman gerekiyor.</p>
        <Link href="/giris" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">Giriş yap</Link>
      </main>
    );
  }

  const subcategories = await prisma.subcategory.findMany({ include: { category: true }, orderBy: { name: "asc" } });
  const options = subcategories.map((s) => ({ slug: s.slug, name: s.name, categoryName: s.category.name }));

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Tezgaha yeni ürün</p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">Ürün ekle</h1>
      <p className="mt-2 mb-8 text-sm text-steel">Aradığın ürün listede yoksa, buradan ekleyip ilk yorumu sen yazabilirsin.</p>
      <Suspense fallback={null}>
        <ProductForm subcategories={options} />
      </Suspense>
    </main>
  );
}

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
      <main className="mx-auto max-w-sm px-5 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-steel">Ürün Ekle</p>
        <h1 className="mt-2 font-display text-2xl font-bold">Önce giriş yapmalısın</h1>
        <p className="mt-4 text-sm text-steel">
          Tezgaha yeni bir ürün koymak için önce e-postanla giriş yapman gerekiyor.
        </p>
        <Link
          href="/giris"
          className="mt-6 inline-block border border-ink px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors focus-ring"
        >
          Giriş yap
        </Link>
      </main>
    );
  }

  const subcategories = await prisma.subcategory.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  const options = subcategories.map((s) => ({
    slug: s.slug,
    name: s.name,
    categoryName: s.category.name,
  }));

  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-steel">Tezgaha yeni ürün</p>
      <h1 className="mt-2 font-display text-2xl font-bold">Ürün ekle</h1>
      <p className="mt-2 mb-8 text-sm text-steel">
        Aradığın ürün listede yoksa, buradan ekleyip ilk yorumu sen yazabilirsin.
      </p>
      <Suspense fallback={null}>
        <ProductForm subcategories={options} />
      </Suspense>
    </main>
  );
}

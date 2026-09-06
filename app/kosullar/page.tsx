export const metadata = { title: "Kullanım Şartları" };

export default function KosullarPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Yasal</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink">Kullanım Şartları</h1>
      <p className="mt-2 text-sm text-steel">Son güncelleme: {new Date().toLocaleDateString("tr-TR")}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
        <section><h2 className="mb-2 font-bold">1. Genel</h2><p>Yorum Tezgahı'nı kullanarak aşağıdaki şartları kabul etmiş sayılırsın. Bu şartlar zaman zaman güncellenebilir.</p></section>
        <section><h2 className="mb-2 font-bold">2. Yorum ve içerik kuralları</h2><p>Yalnızca gerçek deneyimlerini paylaş. Sahte, yanıltıcı, hakaret içeren, başkalarının haklarını ihlal eden veya yasa dışı içerik paylaşmak yasaktır. Bu tür içerikleri kaldırma hakkımız saklıdır.</p></section>
        <section><h2 className="mb-2 font-bold">3. Hesap sorumluluğu</h2><p>Hesabınla yapılan tüm işlemlerden sen sorumlusun.</p></section>
        <section><h2 className="mb-2 font-bold">4. Sorumluluk reddi</h2><p>Sitedeki yorumlar kullanıcılar tarafından yazılır ve kişisel görüşlerini yansıtır. Yorum Tezgahı, paylaşılan içeriklerin doğruluğunu garanti etmez.</p></section>
        <section><h2 className="mb-2 font-bold">5. Değişiklikler</h2><p>Hizmeti ve bu şartları önceden haber vermeksizin değiştirme hakkımız saklıdır.</p></section>
      </div>
    </main>
  );
}

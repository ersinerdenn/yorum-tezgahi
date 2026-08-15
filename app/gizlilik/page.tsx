export const metadata = { title: "Gizlilik Politikası — Yorum Tezgahı" };

export default function GizlilikPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Yasal</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink">Gizlilik Politikası</h1>
      <p className="mt-2 text-sm text-steel">Son güncelleme: {new Date().toLocaleDateString("tr-TR")}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-2 font-bold">1. Hangi verileri topluyoruz?</h2>
          <p>
            Yorum Tezgahı'na üye olduğunda e-posta adresini alırız, ancak bunu düz metin olarak saklamayız —
            geri döndürülemez bir şekilde (hash) dönüştürülmüş haliyle veritabanında tutarız. Ayrıca
            görünen adını (istersen kendi belirlediğin bir takma ad), yazdığın yorumları, verdiğin puanları
            ve isteğe bağlı olarak yüklediğin fiş/fatura fotoğraflarını saklarız.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold">2. Verilerini ne için kullanıyoruz?</h2>
          <p>
            E-posta adresin sadece giriş yaparken kimliğini doğrulamak için kullanılır. Yorumların ve
            puanların, diğer ziyaretçilerin ürün hakkında bilgi edinmesi amacıyla herkese açık şekilde
            sitede yayınlanır. Fiş/fatura fotoğrafları, "Doğrulanmış Alışveriş" rozetini göstermek amacıyla
            yorumla birlikte herkese açık olarak görüntülenir.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold">3. Verilerini kimlerle paylaşıyoruz?</h2>
          <p>
            Verilerini üçüncü taraflara satmıyor veya pazarlama amacıyla paylaşmıyoruz. Hizmeti sunabilmek
            için altyapı sağlayıcılarından (barındırma, veritabanı, e-posta gönderimi, dosya depolama)
            yararlanıyoruz; bu sağlayıcılar verilerini yalnızca hizmeti çalıştırmak amacıyla işler.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold">4. Verilerinin silinmesini istersen</h2>
          <p>
            Hesabını ve yazdığın yorumları silmek istersen bizimle iletişime geçebilirsin. Ayrıca kendi
            yazdığın yorumları istediğin zaman kendi hesabından silebilirsin.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold">5. Çerezler</h2>
          <p>
            Giriş yaptığında, oturumunu hatırlamamız için tarayıcına bir çerez (cookie) yerleştiririz. Bu
            çerez yalnızca giriş durumunu korumak için kullanılır, reklam veya takip amaçlı değildir.
          </p>
        </section>
      </div>
    </main>
  );
}

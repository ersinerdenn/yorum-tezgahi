import GirisForm from "./GirisForm";

export default function GirisPage() {
  return (
    <main className="mx-auto max-w-sm px-6 py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Giriş / Üyelik</p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">Tezgaha katıl</h1>
      <p className="mt-2 mb-8 text-sm text-steel">Yorum yazmak için e-postanı doğrulaman yeterli, şifre gerekmiyor.</p>
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <GirisForm />
      </div>
    </main>
  );
}

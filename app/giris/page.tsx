import GirisForm from "./GirisForm";

export default function GirisPage() {
  return (
    <main className="mx-auto max-w-sm px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-steel">Giriş / Üyelik</p>
      <h1 className="mt-2 font-display text-2xl font-bold">Tezgaha katıl</h1>
      <p className="mt-2 mb-8 text-sm text-steel">
        Yorum yazmak için e-postanı doğrulaman yeterli, şifre gerekmiyor.
      </p>
      <GirisForm />
    </main>
  );
}

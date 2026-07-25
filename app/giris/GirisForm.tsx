"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GirisForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setLoading(false);
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Bir şeyler ters gitti."); return; }
    setStep("code");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, displayName }) });
    setLoading(false);
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Kod doğrulanamadı."); return; }
    router.push("/"); router.refresh();
  }

  if (step === "email") {
    return (
      <form onSubmit={requestCode} className="space-y-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-wide text-steel">E-posta</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@eposta.com" className="mt-1 w-full border border-ink bg-white px-3 py-2.5 text-sm outline-none focus-ring" />
        </div>
        {error && <p className="text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading} className="w-full border border-ink bg-ink px-4 py-2.5 font-medium text-paper transition-colors hover:bg-steel disabled:opacity-50">
          {loading ? "Gönderiliyor…" : "Doğrulama kodu gönder"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-4">
      <p className="text-sm text-steel"><strong className="text-ink">{email}</strong> adresine 6 haneli bir kod gönderdik.</p>
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Doğrulama kodu</label>
        <input type="text" required inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" className="mt-1 w-full border border-ink bg-white px-3 py-2.5 text-center font-mono text-lg tracking-[0.5em] outline-none focus-ring" />
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Görünen adın <span className="text-steelLight normal-case">(isteğe bağlı)</span></label>
        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="ör. Ahmet K." className="mt-1 w-full border border-ink bg-white px-3 py-2.5 text-sm outline-none focus-ring" />
      </div>
      {error && <p className="text-sm text-rust">{error}</p>}
      <button type="submit" disabled={loading} className="w-full border border-ink bg-ink px-4 py-2.5 font-medium text-paper transition-colors hover:bg-steel disabled:opacity-50">
        {loading ? "Kontrol ediliyor…" : "Giriş yap"}
      </button>
      <button type="button" onClick={() => setStep("email")} className="w-full text-center text-xs text-steel hover:text-ink">E-postayı değiştir</button>
    </form>
  );
}

export async function sendOtpEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[DEV] ${email} için doğrulama kodu: ${code}`);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Yorum Tezgahı <onboarding@resend.dev>",
      to: email,
      subject: `Doğrulama kodun: ${code}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; background:#EEF0EF;">
          <p style="font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#3D4552;">Yorum Tezgahı</p>
          <h2 style="color:#1B1E23;">Giriş doğrulama kodun</h2>
          <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#1B1E23;">${code}</p>
          <p style="color:#3D4552;font-size:13px;">Bu kod 10 dakika içinde geçerliliğini yitirecek.</p>
        </div>
      `,
    }),
  });
}

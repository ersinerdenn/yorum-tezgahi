import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://yorumtezgahi.com"),
  title: {
    default: "Yorum Tezgahı — Gerçek kullanıcılardan gerçek deneyimler",
    template: "%s | Yorum Tezgahı",
  },
  description: "Satın almadan önce tezgaha yatır: doğrulanmış kullanıcılardan ürün ve deneyim yorumları.",
  openGraph: { siteName: "Yorum Tezgahı", type: "website", locale: "tr_TR" },
  verification: { google: "Ew_BUkrSiSzy0rQsg8be1xeLxbFcuM49YzX18T-1wSU" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

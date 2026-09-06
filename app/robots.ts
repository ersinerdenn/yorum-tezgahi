import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/giris", "/urun-ekle", "/admin", "/api/"],
      },
    ],
    sitemap: "https://yorumtezgahi.com/sitemap.xml",
  };
}

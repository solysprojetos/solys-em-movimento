import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { asset } from "@/lib/asset";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solys.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Solys em Movimento | Inscrição",
  description:
    "Faça sua inscrição no Solys em Movimento. Preencha seus dados, escolha o tamanho da camisa e confirme sua participação.",
  applicationName: "Solys em Movimento",
  authors: [{ name: "Solys — Gestão Administrativa" }],
  openGraph: {
    title: "Solys em Movimento | Inscrição",
    description: "Garanta sua vaga no Solys em Movimento.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/solys-movimento-bg.png",
        width: 1536,
        height: 1024,
        alt: "Solys em Movimento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solys em Movimento | Inscrição",
    description: "Garanta sua vaga no Solys em Movimento.",
    images: ["/solys-movimento-bg.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#040c1c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <div className="app-background" aria-hidden="true" />
        <div
          className="movimento-art"
          aria-hidden="true"
          style={{ backgroundImage: `url(${asset("/solys-movimento-watermark.png")})` }}
        />
        {children}
      </body>
    </html>
  );
}

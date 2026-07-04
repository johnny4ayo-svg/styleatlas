import type { Metadata } from "next";
import { fontHeading, fontBody } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { AIChatWidget } from "@/components/chat/ai-chat-widget";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description:
    "STYLEATLAS is Nigeria's trusted online destination for discovering, comparing, reviewing, and contacting fashion designers, brands, stylists, schools, jobs, and events.",
  keywords: ["Nigerian fashion designers", "fashion directory Nigeria", "Aso Ebi designers", "bridal designers Lagos"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Discover Nigeria's best fashion designers, brands, stylists, and schools.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Discover Nigeria's best fashion designers, brands, stylists, and schools.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  );
}

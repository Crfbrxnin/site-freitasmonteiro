import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { getSite } from "@/lib/site";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const sans = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-outfit", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(siteUrl("/")),
    applicationName: site.geral.siteName,
    title: { default: site.geral.siteName, template: `%s | ${site.geral.siteName}` },
    description: site.geral.tagline,
    formatDetection: { telephone: false },
    verification: site.tracking.gscVerification ? { google: site.tracking.gscVerification } : undefined,
  };
}

/** Todo o site lê o banco em tempo real: nenhuma página depende do banco durante a instalação (build). */
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#141112",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

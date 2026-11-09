import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Painel · Bruno Freitas Contabilidade" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="theme-papel min-h-svh">{children}</div>;
}

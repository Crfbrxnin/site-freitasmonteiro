import {
  Briefcase, Buildings, Calculator, CalendarCheck, ChartLineUp, ChartPie, Coins, Compass, FileCheck, FileText,
  FolderCheck, HandHeart, IdCard, LaptopSmartphone, Lightbulb, PiggyBank, Receipt, Rocket, ShieldCheck, Store,
  Users, Wallet, Clock, MessageSquareLines, Scan, Handbag, type IconProps,
} from "@flux-icons/react";
import type { ComponentType } from "react";
import { BRAND_PATHS, type BrandName } from "./brand-paths";

/** Ícones disponíveis para serviços e benefícios (Flux Icons, MIT). */
export const ICONS: Record<string, { label: string; Icon: ComponentType<IconProps> }> = {
  rocket: { label: "Foguete (abertura)", Icon: Rocket },
  building: { label: "Edifícios (empresa)", Icon: Buildings },
  "chart-pie": { label: "Gráfico de pizza (tributos)", Icon: ChartPie },
  chart: { label: "Gráfico de linha (resultado)", Icon: ChartLineUp },
  receipt: { label: "Recibo (fiscal)", Icon: Receipt },
  users: { label: "Pessoas (equipe)", Icon: Users },
  "shield-check": { label: "Escudo (regularização)", Icon: ShieldCheck },
  store: { label: "Loja (MEI)", Icon: Store },
  compass: { label: "Bússola (consultoria)", Icon: Compass },
  calculator: { label: "Calculadora", Icon: Calculator },
  "calendar-check": { label: "Calendário", Icon: CalendarCheck },
  "file-check": { label: "Documento conferido", Icon: FileCheck },
  "file-text": { label: "Documento", Icon: FileText },
  "folder-check": { label: "Pasta organizada", Icon: FolderCheck },
  briefcase: { label: "Maleta", Icon: Briefcase },
  laptop: { label: "Computador e celular", Icon: LaptopSmartphone },
  lightbulb: { label: "Ideia", Icon: Lightbulb },
  "piggy-bank": { label: "Cofrinho", Icon: PiggyBank },
  wallet: { label: "Carteira", Icon: Wallet },
  coins: { label: "Moedas", Icon: Coins },
  "id-card": { label: "Cadastro", Icon: IdCard },
  "hand-heart": { label: "Cuidado", Icon: HandHeart },
  clock: { label: "Relógio", Icon: Clock },
  message: { label: "Conversa", Icon: MessageSquareLines },
  scan: { label: "Análise", Icon: Scan },
  handbag: { label: "Comércio", Icon: Handbag },
};

export function ServiceIcon({ name, className }: { name?: string; className?: string }) {
  const entry = (name && ICONS[name]) || ICONS["file-text"];
  const { Icon } = entry;
  return <Icon className={className} strokeWidth={1.5} aria-hidden />;
}

export function BrandIcon({ name, className }: { name: BrandName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}

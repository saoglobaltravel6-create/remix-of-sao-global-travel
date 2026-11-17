import { Link } from "@tanstack/react-router";
import { BarChart3, History, Radar } from "lucide-react";

const tabs = [
  { to: "/radar", label: "Carte en direct", icon: Radar },
  { to: "/radar/statistiques", label: "Statistiques", icon: BarChart3 },
  { to: "/vols-historiques", label: "Vols observés", icon: History },
] as const;

/** Menu propre au radar SAO, distinct de Suivi (colis) et du menu principal. */
export function RadarTabs() {
  return (
    <nav aria-label="Menu du radar" className="mb-6 flex gap-2 overflow-x-auto rounded-lg border border-border bg-sao-navy p-1.5">
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} activeOptions={{ exact: true }}
          className="inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground/80 hover:text-sao-gold"
          activeProps={{ className: "bg-sao-gold !text-sao-navy" }}>
          <t.icon className="size-4" aria-hidden="true" /> {t.label}
        </Link>
      ))}
    </nav>
  );
}

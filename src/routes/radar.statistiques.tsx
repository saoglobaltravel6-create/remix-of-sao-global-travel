import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, Section } from "@/components/sao/PageShell";
import { RadarTabs } from "@/components/sao/RadarTabs";
import { supabase } from "@/integrations/supabase/client";
import asie from "@/assets/dest-asie.jpg";

type Stat = { month: string; requests: number; successes: number; rate_limited: number; errors: number; success_rate: number | null; avg_interval_sec: number | null; avg_latency_ms: number | null; distinct_aircraft: number };

export const Route = createFileRoute("/radar/statistiques")({
  head: () => ({
    meta: [
      { title: "Statistiques du radar | SAO Global Travel" },
      { name: "description", content: "Avions reçus, fréquence des requêtes et taux de succès OpenSky du radar SAO, mois par mois." },
      { property: "og:title", content: "Statistiques du radar SAO" },
      { property: "og:description", content: "Chiffres mensuels mesurés par le radar SAO Global Travel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatsPage,
});

const monthLabel = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
const fmt = (v: number | null, unit = "") => (v == null ? "—" : `${Number(v).toLocaleString("fr-FR")}${unit}`);

function StatsPage() {
  const [rows, setRows] = useState<Stat[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    supabase.rpc("radar_monthly_stats" as never).then(({ data, error }) => {
      if (error) setError("Statistiques indisponibles pour le moment.");
      else setRows((data as unknown as Stat[]) ?? []);
    });
  }, []);
  return (
    <PageShell kicker="Radar SAO" title="Statistiques du radar" intro="Chiffres calculés uniquement à partir des requêtes réellement envoyées par SAO à OpenSky." image={asie} imageAlt="Ciel et avion">
      <Section>
        <RadarTabs />
        {error && <p role="alert" className="sao-card p-6 text-sm">{error}</p>}
        {!error && rows === null && <p className="text-sm text-muted-foreground">Chargement…</p>}
        {rows && rows.length === 0 && <p className="sao-card p-6 text-sm">Aucune donnée : le radar n'a encore enregistré aucune requête.</p>}
        {rows && rows.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-sao-navy text-left text-primary-foreground">
                <tr>{["Mois", "Avions distincts reçus", "Requêtes", "Intervalle moyen", "Taux de succès", "Limitées / erreurs", "Réponse moyenne"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.month} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold capitalize">{monthLabel(r.month)}</td>
                    <td className="px-4 py-3">{fmt(r.distinct_aircraft)}</td>
                    <td className="px-4 py-3">{fmt(r.requests)}</td>
                    <td className="px-4 py-3">{fmt(r.avg_interval_sec, " s")}</td>
                    <td className="px-4 py-3">{fmt(r.success_rate, " %")}</td>
                    <td className="px-4 py-3">{fmt(r.rate_limited)} / {fmt(r.errors)}</td>
                    <td className="px-4 py-3">{fmt(r.avg_latency_ms, " ms")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </PageShell>
  );
}

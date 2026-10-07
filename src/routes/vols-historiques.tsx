import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Radar } from "lucide-react";
import { PageShell, Section } from "@/components/sao/PageShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import asie from "@/assets/dest-asie.jpg";

export const Route = createFileRoute("/vols-historiques")({
  head: () => ({
    meta: [
      { title: "Vols historiques observés | SAO Global Travel" },
      { name: "description", content: "Retrouvez par date les aéronefs réellement observés par le radar SAO via OpenSky Network." },
      { property: "og:title", content: "Vols observés par le radar SAO" },
      { property: "og:description", content: "Historique des vols enregistrés par le radar SAO Global Travel, recherche par date et indicatif." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

type Row = {
  id: string; icao24: string; callsign: string | null; origin_country: string | null;
  first_seen_at: string; last_seen_at: string; last_baro_altitude: number | null; on_ground: boolean;
  origin_airport: string | null; destination_airport: string | null;
};
const PAGE = 50;
const NA = "Non disponible";

function HistoryPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setPage(0), [date, q]);

  useEffect(() => {
    let cancelled = false;
    const start = new Date(`${date}T00:00:00Z`);
    const end = new Date(start.getTime() + 86400000);
    setLoading(true);
    let req = supabase.from("observed_flights")
      .select("id,icao24,callsign,origin_country,first_seen_at,last_seen_at,last_baro_altitude,on_ground,origin_airport,destination_airport", { count: "exact" })
      .lt("first_seen_at", end.toISOString()).gte("last_seen_at", start.toISOString())
      .order("first_seen_at", { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
    const term = q.trim().replace(/[%,()]/g, "");
    if (term) req = req.or(`icao24.ilike.%${term}%,callsign.ilike.%${term}%`);
    req.then(({ data, count, error }) => {
      if (cancelled) return;
      setError(error ? `Base de données indisponible : ${error.message}` : null);
      setRows((data as Row[]) ?? []);
      setCount(count ?? 0);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [date, q, page]);

  const pages = Math.max(1, Math.ceil(count / PAGE));
  const t = (s: string) => new Date(s).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <PageShell kicker="Radar SAO" title="Vols historiques" intro="Historique des vols observés par le radar SAO — uniquement les aéronefs reçus pendant que le radar était consulté. Ce n'est pas un historique mondial complet." image={asie} imageAlt="Centre logistique">
      <Section>
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-background p-4 shadow-sm">
          <label className="text-xs font-semibold">Date (UTC)
            <input type="date" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="mt-1 block rounded-md border border-border px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-semibold">ICAO24 ou indicatif
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ex. 3c6444 ou AFR" className="mt-1 block rounded-md border border-border px-3 py-2 text-sm" />
          </label>
          <Link to="/suivi" className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-sao-navy hover:underline"><Radar className="size-4" aria-hidden="true" /> Retour au radar</Link>
        </div>
        <p className="mt-4 text-sm" role="status">{loading ? "Chargement…" : error ?? `${count.toLocaleString("fr-FR")} sessions de vol observées par SAO ce jour-là.`}</p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-background">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>{["ICAO", "Indicatif", "Pays", "Origine", "Destination", "Première obs.", "Dernière obs.", "Altitude"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="px-3 py-2 font-mono uppercase">{r.icao24}</td>
                  <td className="px-3 py-2 font-semibold">{r.callsign || NA}</td>
                  <td className="px-3 py-2">{r.origin_country || NA}</td>
                  <td className="px-3 py-2">{r.origin_airport || NA}</td>
                  <td className="px-3 py-2">{r.destination_airport || NA}</td>
                  <td className="px-3 py-2">{t(r.first_seen_at)}</td>
                  <td className="px-3 py-2">{t(r.last_seen_at)}</td>
                  <td className="px-3 py-2">{r.on_ground ? "Au sol" : r.last_baro_altitude == null ? NA : `${Math.round(r.last_baro_altitude)} m`}</td>
                </tr>
              ))}
              {!loading && rows.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">Aucun vol observé par le radar SAO pour cette date.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-xs">
          <Button size="icon" variant="outline" aria-label="Page précédente" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft /></Button>
          <span>Page {page + 1} / {pages}</span>
          <Button size="icon" variant="outline" aria-label="Page suivante" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}><ChevronRight /></Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Source : OpenSky Network, enregistré par SAO Global Travel. Origine et destination ne sont renseignées que lorsqu'OpenSky les a réellement fournies.</p>
      </Section>
    </PageShell>
  );
}

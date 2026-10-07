import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { Activity, ChevronLeft, ChevronRight, Globe2, History, LocateFixed, Maximize, Minimize, Plane, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFlightDetails, getRadarStates, type AircraftTuple, type FlightDetails, type RadarResponse } from "@/lib/opensky.functions";

const POLL_MS = 90_000;
const MANUAL_COOLDOWN_MS = 20_000;
const MAX_MARKERS = 700;
const PAGE = 25;
const NA = "Non disponible";

const fmtNum = (v: number | null, unit: string, digits = 0) => (v == null ? NA : `${v.toFixed(digits)} ${unit}`);
const fmtTime = (s: number | null) => (s ? new Date(s * 1000).toLocaleTimeString("fr-FR") : NA);

const STATUS_LABEL: Record<string, string> = {
  ok: "Connexion OK", rate_limited: "Limite atteinte", unauthorized: "Accès refusé",
  unavailable: "Service indisponible", invalid: "Réponse invalide", network: "Réseau indisponible",
};

function planeIcon(L: typeof Leaflet, track: number | null, ground: boolean, selected: boolean) {
  const color = selected ? "var(--sao-red, #E31B23)" : ground ? "#8a94a8" : "var(--sao-gold, #F6C10D)";
  return L.divIcon({
    className: "sao-plane-icon",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<svg width="22" height="22" viewBox="0 0 24 24" style="transform:rotate(${track ?? 0}deg);filter:drop-shadow(0 0 1px #0B1B45)"><path fill="${color}" stroke="#0B1B45" stroke-width="1" d="M12 2c.8 0 1.3.8 1.3 1.8v5.6l7.7 4.4v2l-7.7-2.3v4.8l2.2 1.7v1.6L12 20.6l-3.5 1v-1.6l2.2-1.7v-4.8L3 15.8v-2l7.7-4.4V3.8C10.7 2.8 11.2 2 12 2z"/></svg>`,
  });
}

export function FlightRadar() {
  const fetchStates = useServerFn(getRadarStates);
  const fetchDetails = useServerFn(getFlightDetails);
  const container = useRef<HTMLElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const layerRef = useRef<Leaflet.LayerGroup | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);

  const [data, setData] = useState<RadarResponse | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<number | null>(null);
  const [nextAttempt, setNextAttempt] = useState<number | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [showGround, setShowGround] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "air" | "ground">("all");
  const [sort, setSort] = useState<{ key: number; dir: 1 | -1 }>({ key: 6, dir: -1 });
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, FlightDetails | "loading">>({});
  const [fullscreen, setFullscreen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapVersion, setMapVersion] = useState(0);
  const [shown, setShown] = useState(0);

  const load = useCallback(async () => {
    setSyncing(true);
    setLastAttempt(Date.now());
    try {
      const r = await fetchStates();
      setData(r);
      setClientError(null);
      const wait = r.retryAfterSec ? Math.max(r.retryAfterSec * 1000, POLL_MS) : POLL_MS;
      setNextAttempt(Date.now() + wait);
      return wait;
    } catch (e) {
      setClientError(`Serveur SAO injoignable : ${e instanceof Error ? e.message : "erreur réseau"}`);
      setNextAttempt(Date.now() + POLL_MS);
      return POLL_MS;
    } finally {
      setSyncing(false);
    }
  }, [fetchStates]);

  // Polling, paused while the tab is hidden.
  useEffect(() => {
    let timer: number | undefined;
    let stop = false;
    const tick = async () => {
      if (document.hidden) { timer = window.setTimeout(tick, 5000); return; }
      const wait = await load();
      if (!stop) timer = window.setTimeout(tick, wait);
    };
    tick();
    return () => { stop = true; window.clearTimeout(timer); };
  }, [load]);

  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t); }, []);

  useEffect(() => {
    const change = () => { setFullscreen(document.fullscreenElement === container.current); setTimeout(() => mapRef.current?.invalidateSize(), 200); };
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);

  // Leaflet loaded only in the browser.
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      if (cancelled || !mapEl.current || mapRef.current) return;
      const L = (mod as unknown as { default?: typeof Leaflet }).default ?? (mod as unknown as typeof Leaflet);
      LRef.current = L;
      const map = L.map(mapEl.current, { center: [15, 10], zoom: 3, minZoom: 2, worldCopyJump: true, preferCanvas: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 12, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Données aéronefs <a href="https://opensky-network.org">OpenSky Network</a>',
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      map.on("moveend", () => setMapVersion((v) => v + 1));
      mapRef.current = map;
      setMapReady(true);
    });
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  const aircraft = data?.aircraft ?? [];
  const q = query.trim().toLowerCase();

  // Markers: only aircraft inside the current view, capped for performance.
  useEffect(() => {
    const L = LRef.current, map = mapRef.current, layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    const b = map.getBounds().pad(0.1);
    let n = 0;
    for (const a of aircraft) {
      if (a[5] == null || a[4] == null) continue;
      if (a[7] && !showGround && a[0] !== selected) continue;
      if (q && !a[0].includes(q) && !a[1].toLowerCase().includes(q)) continue;
      if (!b.contains([a[5], a[4]]) && a[0] !== selected) continue;
      if (n >= MAX_MARKERS && a[0] !== selected) continue;
      n++;
      L.marker([a[5], a[4]], { icon: planeIcon(L, a[9], a[7], a[0] === selected), keyboard: false, title: a[1] || a[0] })
        .on("click", () => setSelected(a[0]))
        .addTo(layer);
    }
    setShown(n);
  }, [aircraft, showGround, q, selected, mapReady, mapVersion]);

  const sel = useMemo(() => aircraft.find((a) => a[0] === selected) ?? null, [aircraft, selected]);

  const rows = useMemo(() => {
    const r = aircraft.filter((a) => (filter === "all" || (filter === "ground") === a[7]) && (!q || a[0].includes(q) || a[1].toLowerCase().includes(q)));
    const k = sort.key;
    return r.sort((x, y) => {
      const a = x[k] ?? -Infinity, b = y[k] ?? -Infinity;
      return (typeof a === "string" ? a.localeCompare(String(b)) : Number(a) - Number(b)) * sort.dir;
    });
  }, [aircraft, filter, q, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const pageRows = rows.slice(Math.min(page, pages - 1) * PAGE, Math.min(page, pages - 1) * PAGE + PAGE);
  useEffect(() => setPage(0), [q, filter, sort]);

  async function loadDetails(icao: string) {
    setDetails((d) => ({ ...d, [icao]: "loading" }));
    try { const v = await fetchDetails({ data: { icao24: icao } }); setDetails((d) => ({ ...d, [icao]: v })); }
    catch { setDetails((d) => ({ ...d, [icao]: { status: "network", message: "Serveur SAO injoignable.", origin: null, destination: null, firstSeen: null, lastSeen: null } })); }
  }

  function focus(a: AircraftTuple) {
    setSelected(a[0]);
    if (a[5] != null && a[4] != null) mapRef.current?.setView([a[5], a[4]], Math.max(mapRef.current.getZoom(), 7));
    mapEl.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function toggleFullscreen() {
    const el = container.current;
    if (!el) return;
    try { if (document.fullscreenElement === el) await document.exitFullscreen(); else await el.requestFullscreen?.(); } catch { /* refused by browser */ }
  }

  function manualRefresh() {
    if (Date.now() < cooldownUntil || syncing) return;
    setCooldownUntil(Date.now() + MANUAL_COOLDOWN_MS);
    load();
  }

  const statusKey = clientError ? "network" : data?.status;
  const statusText = syncing ? "Synchronisation…" : statusKey ? STATUS_LABEL[statusKey] : "En attente de la première réponse";
  const ok = !clientError && data?.status === "ok";
  const cooldown = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const age = data?.dataTime ? Math.round(now / 1000 - data.dataTime) : null;
  const sortBtn = (key: number, label: string) => (
    <button type="button" className="font-semibold hover:text-sao-gold" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : -1 }))} aria-label={`Trier par ${label}`}>
      {label}{sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : ""}
    </button>
  );
  const det = selected ? details[selected] : undefined;

  return (
    <div className="space-y-6">
      <section ref={container} id="sgt-flight-radar" aria-label="Radar aérien SAO Global Travel" className="sao-flight-radar overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 bg-sao-navy px-4 py-4 text-primary-foreground md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Plane className="size-7 shrink-0 text-sao-gold" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold">Radar aérien SAO</h2>
              <p className="text-xs text-primary-foreground/75">Positions ADS-B réelles · source OpenSky Network</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="icon" title="Recentrer sur le monde" aria-label="Recentrer sur le monde" onClick={() => mapRef.current?.setView([15, 10], 2)} className="border border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground"><LocateFixed /></Button>
            <Button variant="ghost" size="icon" title={fullscreen ? "Quitter le plein écran" : "Plein écran"} aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"} onClick={toggleFullscreen} className="border border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground">{fullscreen ? <Minimize /> : <Maximize />}</Button>
            <Button variant="ghost" size="sm" disabled={syncing || cooldown > 0} onClick={manualRefresh} aria-label="Actualiser maintenant" className="border border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <RefreshCw className={syncing ? "animate-spin motion-reduce:animate-none" : ""} /> {cooldown > 0 ? `${cooldown}s` : "Actualiser"}
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border px-4 py-3 text-xs md:px-6" role="status" aria-live="polite">
          <span className="flex items-center gap-2 font-semibold">
            <span className={`size-2 rounded-full ${syncing ? "bg-sao-gold" : ok ? "bg-emerald-500" : "bg-destructive"}`} aria-hidden="true" />
            {statusText}
          </span>
          <span>{data ? `${aircraft.length.toLocaleString("fr-FR")} aéronefs reçus` : "—"}</span>
          <span className="text-muted-foreground">Dernière synchro : {data?.fetchedAt ? new Date(data.fetchedAt).toLocaleTimeString("fr-FR") : "aucune"}</span>
          {data && !ok && data.cached && <span className="rounded bg-sao-gold/15 px-2 py-0.5 font-semibold text-sao-navy">Données mises en cache — pas en direct</span>}
          {(clientError || data?.message) && <span className="text-destructive">{clientError ?? data?.message}{data?.retryAfterSec ? ` · réessai dans ${data.retryAfterSec}s` : ""}</span>}
        </div>

        <div className="relative">
          <div ref={mapEl} className="sao-flight-radar-viewport z-0 h-[460px] w-full bg-muted md:h-[540px]" aria-label="Carte des aéronefs" />
          <div className="pointer-events-none absolute left-3 top-3 z-[400] flex flex-col gap-2">
            <form className="pointer-events-auto flex items-center gap-1 rounded-md border border-border bg-background/95 px-2 py-1 shadow-sm" onSubmit={(e) => { e.preventDefault(); const f = aircraft.find((a) => a[0] === q || a[1].toLowerCase() === q); if (f) focus(f); }}>
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="radar-search" className="sr-only">Rechercher ICAO24 ou indicatif</label>
              <input id="radar-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ICAO24 ou indicatif" className="w-36 bg-transparent py-1 text-sm outline-none sm:w-44" />
            </form>
            <label className="pointer-events-auto flex items-center gap-2 rounded-md border border-border bg-background/95 px-2 py-1 text-xs shadow-sm">
              <input type="checkbox" checked={showGround} onChange={(e) => setShowGround(e.target.checked)} /> Afficher les avions au sol
            </label>
          </div>
          <div className="pointer-events-none absolute bottom-6 left-3 z-[400] rounded-md border border-border bg-background/95 px-3 py-2 text-[11px] shadow-sm">
            <p className="font-semibold">Légende</p>
            <p><span className="text-sao-gold">▲</span> En vol · <span className="text-muted-foreground">▲</span> Au sol · <span className="text-sao-red">▲</span> Sélection</p>
            <p className="text-muted-foreground">{shown} affichés dans la vue (max {MAX_MARKERS})</p>
          </div>
          {!data && !clientError && (
            <div className="absolute inset-0 z-[401] flex items-center justify-center bg-background/80 text-sm" role="status">
              <RefreshCw className="mr-2 size-5 animate-spin text-sao-gold motion-reduce:animate-none" aria-hidden="true" /> Interrogation d'OpenSky…
            </div>
          )}
          {sel && (
            <aside className="absolute right-3 top-3 z-[402] w-[min(300px,calc(100%-1.5rem))] rounded-lg border border-border bg-background p-4 text-sm shadow-lg" aria-label="Détails de l'aéronef">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-bold text-sao-navy">{sel[1] || NA}</p>
                  <p className="text-xs uppercase text-muted-foreground">ICAO24 {sel[0]}</p>
                </div>
                <Button variant="ghost" size="icon" aria-label="Fermer" onClick={() => setSelected(null)}><X /></Button>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <dt className="text-muted-foreground">Pays transpondeur</dt><dd>{sel[2] || NA}</dd>
                <dt className="text-muted-foreground">Latitude</dt><dd>{sel[5]?.toFixed(4) ?? NA}</dd>
                <dt className="text-muted-foreground">Longitude</dt><dd>{sel[4]?.toFixed(4) ?? NA}</dd>
                <dt className="text-muted-foreground">Altitude baro.</dt><dd>{fmtNum(sel[6], "m")}</dd>
                <dt className="text-muted-foreground">Vitesse</dt><dd>{sel[8] == null ? NA : `${Math.round(sel[8] * 3.6)} km/h`}</dd>
                <dt className="text-muted-foreground">Cap</dt><dd>{fmtNum(sel[9], "°")}</dd>
                <dt className="text-muted-foreground">Statut</dt><dd>{sel[7] ? "Au sol" : "En vol"}</dd>
                <dt className="text-muted-foreground">Dernier contact</dt><dd>{fmtTime(sel[3])}</dd>
                <dt className="text-muted-foreground">Origine</dt><dd>{det && det !== "loading" ? det.origin ?? NA : NA}</dd>
                <dt className="text-muted-foreground">Destination</dt><dd>{det && det !== "loading" ? det.destination ?? NA : NA}</dd>
              </dl>
              {det && det !== "loading" && det.message && <p className="mt-2 text-xs text-muted-foreground">{det.message}</p>}
              {!det && <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => loadDetails(sel[0])}>Chercher origine / destination</Button>}
              {det === "loading" && <p className="mt-3 text-xs text-muted-foreground">Interrogation d'OpenSky…</p>}
            </aside>
          )}
        </div>

        <details className="border-t border-border px-4 py-3 text-xs md:px-6">
          <summary className="cursor-pointer font-semibold"><Activity className="mr-1 inline size-3.5" aria-hidden="true" />État technique</summary>
          <dl className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-3">
            <div><dt className="text-muted-foreground">Source</dt><dd>OpenSky Network /states/all ({data?.authenticated ? "authentifié" : "anonyme"})</dd></div>
            <div><dt className="text-muted-foreground">Statut API</dt><dd>{statusKey ? STATUS_LABEL[statusKey] : "—"}</dd></div>
            <div><dt className="text-muted-foreground">Horodatage OpenSky</dt><dd>{fmtTime(data?.dataTime ?? null)}{age != null ? ` (il y a ${age}s)` : ""}</dd></div>
            <div><dt className="text-muted-foreground">Latence serveur→OpenSky</dt><dd>{data?.latencyMs != null ? `${data.latencyMs} ms${data.cached ? " (réponse en cache)" : ""}` : NA}</dd></div>
            <div><dt className="text-muted-foreground">Dernière tentative</dt><dd>{lastAttempt ? new Date(lastAttempt).toLocaleTimeString("fr-FR") : "—"}</dd></div>
            <div><dt className="text-muted-foreground">Prochaine tentative</dt><dd>{nextAttempt ? new Date(nextAttempt).toLocaleTimeString("fr-FR") : "—"}</dd></div>
            <div><dt className="text-muted-foreground">Enregistrement historique</dt><dd>{data?.persisted === "ok" ? "Enregistré" : data?.persisted === "error" ? "Base indisponible" : "Non requis (cache)"}</dd></div>
          </dl>
        </details>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs md:px-6">
          <p className="max-w-xl text-muted-foreground"><Globe2 className="mr-1 inline size-3.5 text-sao-gold" aria-hidden="true" />Source : OpenSky Network (usage non commercial). Couverture selon réception ADS-B.</p>
          <Link to="/vols-historiques" className="inline-flex items-center gap-1 font-semibold text-sao-navy underline-offset-4 hover:underline"><History className="size-4" aria-hidden="true" /> Vols historiques observés</Link>
        </footer>
      </section>

      <section aria-labelledby="suivi-detaille" className="rounded-lg border border-border bg-background p-4 shadow-sm md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="suivi-detaille" className="text-lg font-bold text-sao-navy">Suivi détaillé</h2>
            <p className="text-xs text-muted-foreground">{rows.length.toLocaleString("fr-FR")} aéronefs correspondants · origine/destination non fournies par /states/all</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer">
            {(["all", "air", "ground"] as const).map((f) => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>{f === "all" ? "Tous" : f === "air" ? "En vol" : "Au sol"}</Button>
            ))}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">{sortBtn(0, "ICAO")}</th>
                <th className="py-2 pr-3">{sortBtn(1, "Indicatif")}</th>
                <th className="py-2 pr-3">{sortBtn(2, "Pays")}</th>
                <th className="py-2 pr-3">Destination</th>
                <th className="py-2 pr-3">{sortBtn(6, "Altitude")}</th>
                <th className="py-2 pr-3">{sortBtn(8, "Vitesse")}</th>
                <th className="py-2 pr-3">{sortBtn(9, "Cap")}</th>
                <th className="py-2 pr-3">{sortBtn(3, "Dernier contact")}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((a) => {
                const d = details[a[0]];
                return (
                  <tr key={a[0]} className={`cursor-pointer border-b border-border/60 hover:bg-secondary ${a[0] === selected ? "bg-sao-gold/10" : ""}`} onClick={() => focus(a)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") focus(a); }}>
                    <td className="py-2 pr-3 font-mono uppercase">{a[0]}</td>
                    <td className="py-2 pr-3 font-semibold">{a[1] || NA}</td>
                    <td className="py-2 pr-3">{a[2] || NA}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{d && d !== "loading" && d.destination ? d.destination : NA}</td>
                    <td className="py-2 pr-3">{a[7] ? "Au sol" : fmtNum(a[6], "m")}</td>
                    <td className="py-2 pr-3">{a[8] == null ? NA : `${Math.round(a[8] * 3.6)} km/h`}</td>
                    <td className="py-2 pr-3">{fmtNum(a[9], "°")}</td>
                    <td className="py-2 pr-3">{fmtTime(a[3])}</td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">{data ? "Aucun aéronef ne correspond." : "En attente des données OpenSky."}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-xs">
          <Button size="icon" variant="outline" aria-label="Page précédente" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft /></Button>
          <span>Page {Math.min(page, pages - 1) + 1} / {pages}</span>
          <Button size="icon" variant="outline" aria-label="Page suivante" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}><ChevronRight /></Button>
        </div>
      </section>
    </div>
  );
}

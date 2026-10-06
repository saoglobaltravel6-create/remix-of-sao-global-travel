import { useEffect, useRef, useState } from "react";
import { ExternalLink, Globe2, Maximize, Minimize, Plane, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const RADAR_URL = "https://map.opensky-network.org/";

/** OpenSky owns map navigation and telemetry; iframe load is not a live-data signal. */
export function FlightRadar() {
  const container = useRef<HTMLElement>(null);
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<"loading" | "loaded" | "unavailable">("loading");
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setState((current) => current === "loading" ? "unavailable" : current), 12000);
    return () => window.clearTimeout(timer);
  }, [version]);

  useEffect(() => {
    const change = () => setFullscreen(document.fullscreenElement === container.current);
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);

  async function toggleFullscreen() {
    const element = container.current;
    if (!element) return;
    setNotice("");
    try {
      if (document.fullscreenElement === element) await document.exitFullscreen();
      else if (element.requestFullscreen) await element.requestFullscreen();
      else setNotice("Le plein écran n’est pas disponible sur ce navigateur.");
    } catch {
      setNotice("Le navigateur n’a pas autorisé le plein écran.");
    }
  }

  return (
    <section ref={container} id="sgt-flight-radar" aria-label="Radar aérien SAO Global Travel" className="sao-flight-radar overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-sao-navy px-4 py-4 text-primary-foreground md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Plane className="size-7 shrink-0 text-sao-gold" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-bold">Flight Radar</h2>
            <p className="text-xs text-primary-foreground/75">SAO Global Travel · Carte aérienne OpenSky</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" title={fullscreen ? "Quitter le plein écran" : "Afficher en plein écran"} aria-label={fullscreen ? "Quitter le plein écran" : "Afficher en plein écran"} onClick={toggleFullscreen} className="border border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground">
            {fullscreen ? <Minimize /> : <Maximize />}
          </Button>
          <Button variant="ghost" size="icon" title="Actualiser le radar" aria-label="Actualiser le radar" onClick={() => { setState("loading"); setVersion((value) => value + 1); }} className="border border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <RefreshCw />
          </Button>
        </div>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 text-xs md:px-6">
        <span className="flex items-center gap-2 font-semibold"><Globe2 className="size-4 text-sao-gold" aria-hidden="true" /> Couverture mondiale selon réception ADS-B</span>
        <span role="status" className="text-muted-foreground">{state === "loading" ? "Chargement de la carte…" : state === "unavailable" ? "Accès à la carte non confirmé" : "Actualisation gérée par OpenSky"}</span>
      </div>
      {notice && <p role="status" className="px-4 py-2 text-sm text-muted-foreground">{notice}</p>}
      <div className="sao-flight-radar-viewport relative h-[500px] min-h-0 bg-muted">
        <iframe key={version} src={RADAR_URL} title="Carte des aéronefs — OpenSky Network" className="absolute inset-0 size-full border-0" allow="fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setState("loaded")} onError={() => setState("unavailable")} />
        {state !== "loaded" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/95 px-6 text-center" role="status">
            {state === "loading" && <RefreshCw className="size-7 animate-spin text-sao-gold motion-reduce:animate-none" aria-hidden="true" />}
            <strong>{state === "loading" ? "Initialisation du radar" : "La carte externe ne répond pas"}</strong>
            <p className="max-w-sm text-sm text-muted-foreground">{state === "loading" ? "Chargement de la carte aérienne OpenSky…" : "Vous pouvez réessayer ou ouvrir OpenSky directement."}</p>
            <Button asChild variant="outline"><a href={RADAR_URL} target="_blank" rel="noopener noreferrer"><ExternalLink /> Ouvrir OpenSky</a></Button>
          </div>
        )}
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-4 text-xs md:px-6">
        <p className="max-w-xl text-muted-foreground">Source : OpenSky Network. Couverture et délai variables ; données en direct non vérifiées par SAO.</p>
        <Button asChild variant="link" size="sm"><a href={RADAR_URL} target="_blank" rel="noopener noreferrer">Ouvrir la carte <ExternalLink /></a></Button>
      </footer>
    </section>
  );
}
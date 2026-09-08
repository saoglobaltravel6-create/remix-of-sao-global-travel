import { useState } from "react";
import { DESTINATIONS, type Destination } from "@/lib/destinations";

/**
 * Carte interactive légère (projection équirectangulaire, aucun tuilage externe).
 * Chaque point utilise les coordonnées approximatives de l'aéroport.
 */
export function WorldMap({ filter }: { filter?: (d: Destination) => boolean }) {
  const points = DESTINATIONS.filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng)).filter(
    filter ?? (() => true)
  );
  const missing = DESTINATIONS.filter((d) => !Number.isFinite(d.lat) || !Number.isFinite(d.lng));
  const [active, setActive] = useState<Destination | null>(null);

  return (
    <div>
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-sao-navy">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.706 0.117 79.5 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.706 0.117 79.5 / 0.35) 1px, transparent 1px)",
            backgroundSize: "8.333% 16.666%",
          }}
          aria-hidden="true"
        />
        {points.map((d) => {
          const left = ((d.lng + 180) / 360) * 100;
          const top = ((90 - d.lat) / 180) * 100;
          const on = active?.iata === d.iata;
          return (
            <button
              key={d.iata}
              type="button"
              onClick={() => setActive(on ? null : d)}
              aria-label={`${d.city} (${d.iata})`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span
                className={`block rounded-full transition-all ${
                  on ? "size-4 bg-sao-gold" : "size-2.5 bg-sao-gold/80 hover:size-3.5"
                }`}
              />
            </button>
          );
        })}
        {active && (
          <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-background/95 p-4 shadow-[var(--shadow-float)] sm:max-w-sm">
            <p className="text-sm font-bold text-sao-navy">
              {active.city} · {active.iata}
            </p>
            <p className="text-xs text-muted-foreground">
              {active.airport} — {active.country}
            </p>
            <p className="mt-2 text-xs text-sao-navy/80">{active.description}</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Positions basées sur les coordonnées approximatives des aéroports. Touchez un point pour
        voir la fiche.
        {missing.length > 0 &&
          ` ${missing.length} destination(s) sans coordonnée disponible ne sont pas affichées.`}
      </p>
    </div>
  );
}

import { useState } from "react";
import { Search, Award, CircleDollarSign } from "lucide-react";
import { DemoBadge } from "./DemoBadge";

const TIMELINE = [
  { date: "25/04/2026 10:20", label: "Enregistré", place: "Dakar, Sénégal", done: true },
  { date: "25/04/2026 14:45", label: "Pris en charge", place: "Dakar, Sénégal", done: true },
  { date: "26/04/2026 06:30", label: "En transit", place: "Douala, Cameroun", done: true },
  { date: "27/04/2026 11:15", label: "Contrôlé", place: "N'Djamena, Tchad", done: false },
  { date: "—", label: "En attente de livraison", place: "N'Djamena, Tchad", done: false },
];

export function TrackingMoney() {
  const [ref, setRef] = useState("SAO-COL-1188");

  return (
    <section id="suivi" className="sao-container grid gap-6 py-20 lg:grid-cols-3">
      <div className="sao-card p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight text-sao-navy">Suivi universel</h2>
          <DemoBadge />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Colis, bagage, cargo, bus ou vol : une seule référence, un seul suivi.
        </p>

        <div className="mt-5 flex gap-2">
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="Entrez votre numéro de suivi (ex. SAO-COL-1188)"
            className="h-12 w-full rounded-xl border border-input bg-secondary/60 px-4 text-base text-sao-navy outline-none focus:ring-2 focus:ring-ring"
            aria-label="Numéro de suivi"
          />
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sao-navy px-5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-125"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Suivre</span>
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-sao-ivory p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-sao-navy">SAO-COL-1188</span>
            <span className="rounded-full bg-sao-gold/20 px-3 py-1 text-xs font-semibold text-sao-navy">
              Colis · En transit
            </span>
            <span className="text-sm text-muted-foreground">
              Dakar, Sénégal → N'Djamena, Tchad
            </span>
          </div>

          <ol className="mt-5 space-y-4">
            {TIMELINE.map((t) => (
              <li key={t.label} className="flex gap-4">
                <span className="relative mt-1.5 flex flex-col items-center">
                  <span
                    className={`size-3 rounded-full ${t.done ? "bg-sao-gold" : "bg-border"}`}
                    aria-hidden="true"
                  />
                </span>
                <div className="text-sm">
                  <p className="font-medium text-sao-navy">{t.label}</p>
                  <p className="text-muted-foreground">
                    {t.place} · {t.date}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div id="sao-money" className="sao-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-sao-navy">SAO Money</h2>
            <CircleDollarSign className="size-6 text-sao-gold" aria-hidden="true" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Frais standard</p>
              <p className="text-3xl font-bold text-sao-gold">5%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Parrainage</p>
              <p className="text-lg font-semibold text-sao-navy">5 filleuls</p>
              <p className="text-xs text-muted-foreground">Prochain palier : 10 filleuls</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/2 rounded-full bg-sao-gold" />
          </div>
          <div className="mt-4">
            <DemoBadge />
          </div>
        </div>

        <div className="sao-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-sao-navy">SAO Rewards</h2>
            <Award className="size-6 text-sao-gold" aria-hidden="true" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="font-semibold text-sao-navy">SAO START</p>
            <p className="text-sm font-semibold text-sao-gold">450 pts</p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[90%] rounded-full bg-sao-gold" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Niveaux : Start · Plus · Premium · Elite — prochain niveau à 500 pts.
          </p>
        </div>
      </div>
    </section>
  );
}

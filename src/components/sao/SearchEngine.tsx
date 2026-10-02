import { ScrollEdgeBlur } from "@/components/sao/ScrollEdgeBlur";
import { useState } from "react";
import { Plane, Luggage, Package, Ship, Bus, CircleDollarSign, Search } from "lucide-react";
import { DemoBadge } from "./DemoBadge";

type Field = { label: string; placeholder: string; type?: string };

const TABS: { id: string; label: string; icon: typeof Plane; fields: Field[] }[] = [
  {
    id: "vol",
    label: "VOL",
    icon: Plane,
    fields: [
      { label: "Origine", placeholder: "N'Djamena (NDJ)" },
      { label: "Destination", placeholder: "Paris (CDG)" },
      { label: "Aller", placeholder: "28 Avr. 2026",  },
      { label: "Retour", placeholder: "05 Mai 2026",  },
      { label: "Passagers", placeholder: "1 passager" },
      { label: "Classe", placeholder: "Économique" },
    ],
  },
  {
    id: "bagage",
    label: "BAGAGE",
    icon: Luggage,
    fields: [
      { label: "Poids (kg)", placeholder: "23", type: "number" },
      { label: "Dimensions", placeholder: "55 × 40 × 23 cm" },
      { label: "Quantité", placeholder: "2", type: "number" },
      { label: "Type", placeholder: "Valise soute" },
      { label: "Destination", placeholder: "Dakar, Sénégal" },
    ],
  },
  {
    id: "colis",
    label: "COLIS",
    icon: Package,
    fields: [
      { label: "Expéditeur", placeholder: "Nom complet" },
      { label: "Destinataire", placeholder: "Nom complet" },
      { label: "Origine", placeholder: "Dakar, Sénégal" },
      { label: "Destination", placeholder: "N'Djamena, Tchad" },
      { label: "Poids (kg)", placeholder: "5", type: "number" },
      { label: "Quantité", placeholder: "1", type: "number" },
      { label: "Type", placeholder: "Standard" },
      { label: "Contenu", placeholder: "Vêtements" },
    ],
  },
  {
    id: "cargo",
    label: "CARGO",
    icon: Ship,
    fields: [
      { label: "Origine", placeholder: "Douala, Cameroun" },
      { label: "Destination", placeholder: "N'Djamena, Tchad" },
      { label: "Poids (kg)", placeholder: "1 200", type: "number" },
      { label: "Volume (m³)", placeholder: "4", type: "number" },
      { label: "Nature", placeholder: "Matériel technique" },
      { label: "Documents", placeholder: "Facture, packing list" },
    ],
  },
  {
    id: "bus",
    label: "BUS",
    icon: Bus,
    fields: [
      { label: "Origine", placeholder: "N'Djamena" },
      { label: "Destination", placeholder: "Moundou" },
      { label: "Date", placeholder: "28 Avr. 2026",  },
      { label: "Passagers", placeholder: "2", type: "number" },
    ],
  },
  {
    id: "money",
    label: "SAO MONEY",
    icon: CircleDollarSign,
    fields: [
      { label: "Montant", placeholder: "150 000", type: "number" },
      { label: "Devise", placeholder: "XAF" },
      { label: "Bénéficiaire", placeholder: "Nom complet" },
    ],
  },
];

const DEMO_FLIGHTS = [
  { co: "Demo Air", dep: "NDJ 08:30", arr: "CDG 14:30", dur: "6h00", stop: "Direct", price: "620 €" },
  { co: "Demo Air", dep: "NDJ 10:15", arr: "CDG 17:20", dur: "7h05", stop: "1 escale", price: "580 €" },
  { co: "Demo Air", dep: "NDJ 22:40", arr: "CDG 06:50+1", dur: "7h10", stop: "Direct", price: "610 €" },
];

export function SearchEngine() {
  const [active, setActive] = useState("vol");
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section id="moteur" className="sao-container -mt-16 md:-mt-20 relative z-20">
      <div className="sao-card overflow-hidden">
        <div className="relative">
        <ScrollEdgeBlur side="right" className="w-10 md:hidden" />
        <div className="flex gap-1 overflow-x-auto border-b border-border px-3 pt-3 md:px-6">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = t.id === active;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-[13px] font-semibold tracking-wide transition-colors duration-300 ${
                  on
                    ? "border-sao-gold text-sao-navy"
                    : "border-transparent text-muted-foreground hover:text-sao-navy"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t.label}
              </button>
            );
          })}
        </div>
        </div>

        <div key={active} className="p-5 md:p-6" style={{ animation: "fadeInSoft .35s var(--ease-soft) both" }}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tab.fields.map((f) => (
              <label key={f.label} className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</span>
                <input
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  className="h-11 w-full rounded-xl border border-input bg-secondary/60 px-3 text-base text-sao-navy outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <DemoBadge />
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-sao-gold px-6 py-3 text-sm font-semibold text-sao-navy transition-[filter] duration-200 hover:brightness-105"
            >
              Rechercher <Search className="size-4" aria-hidden="true" />
            </button>
          </div>

          {active === "vol" && (
            <div className="mt-6 rounded-2xl border border-border bg-sao-ivory/60 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-sao-navy">
                  Vols proposés — N'Djamena → Paris
                </h3>
                <span className="text-xs text-muted-foreground">
                  Tri : recommandé · moins cher · plus rapide
                </span>
              </div>
              <ul className="divide-y divide-border">
                {DEMO_FLIGHTS.map((f) => (
                  <li
                    key={f.dep}
                    className="grid grid-cols-2 gap-2 py-3 text-sm text-sao-navy md:grid-cols-6 md:items-center"
                  >
                    <span className="font-medium">{f.co}</span>
                    <span>{f.dep}</span>
                    <span>{f.arr}</span>
                    <span className="text-muted-foreground">{f.dur}</span>
                    <span className="text-muted-foreground">{f.stop}</span>
                    <span className="justify-self-end font-semibold text-sao-gold">{f.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

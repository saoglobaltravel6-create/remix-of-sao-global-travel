import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plane } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { WorldMap } from "@/components/sao/WorldMap";
import { DESTINATIONS, ZONES, ZONE_IMAGE, type Zone } from "@/lib/destinations";
import { Reveal } from "@/components/sao/Reveal";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations — Le réseau SAO Global Travel" },
      {
        name: "description",
        content:
          "Afrique, Europe, Moyen-Orient, Asie : villes, aéroports et codes IATA desservis au départ de N'Djamena et Dakar.",
      },
      { property: "og:title", content: "Destinations — SAO Global Travel" },
      {
        property: "og:description",
        content: "Villes, aéroports et codes IATA du réseau SAO Global Travel, sur carte interactive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DestinationsPage,
});

function DestinationsPage() {
  const [zone, setZone] = useState<Zone | "Toutes">("Toutes");
  const list = DESTINATIONS.filter((d) => zone === "Toutes" || d.zone === zone);

  return (
    <PageShell
      kicker="Réseau"
      title="Destinations"
      intro="Le monde depuis N'Djamena et Dakar : villes, aéroports et codes IATA réels des destinations que nous accompagnons."
      image={ZONE_IMAGE.Europe}
      imageAlt="Panorama urbain européen"
    >
      <Section title="Carte du réseau" lead="Sélectionnez un point pour afficher la fiche de la destination.">
        <WorldMap filter={(d) => zone === "Toutes" || d.zone === zone} />
      </Section>

      <Section tone="ivory" title="Toutes les destinations">
        <div role="tablist" aria-label="Filtrer par zone" className="flex flex-wrap gap-2">
          {(["Toutes", ...ZONES] as const).map((z) => (
            <button
              key={z}
              type="button"
              role="tab"
              aria-selected={zone === z}
              onClick={() => setZone(z)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-[0.12em] transition-colors ${
                zone === z
                  ? "bg-sao-navy text-primary-foreground"
                  : "border border-sao-navy/20 bg-background text-sao-navy hover:bg-sao-gold/20"
              }`}
            >
              {z.toUpperCase()}
            </button>
          ))}
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <Reveal as="li" key={d.iata} className="sao-card overflow-hidden">
              <img
                src={d.image}
                alt={`${d.city}, ${d.country}`}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-sao-navy">{d.city}</h3>
                  <span className="rounded-full bg-sao-gold/20 px-2.5 py-1 text-xs font-bold text-sao-navy">
                    {d.iata}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {d.country} · {d.zone}
                </p>
                <p className="mt-3 text-sm text-sao-navy/80">{d.description}</p>
                <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <Plane className="mt-0.5 size-3.5 shrink-0 text-sao-gold" aria-hidden="true" />
                  {d.airport}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <DemoNote>
          Aucun tarif ni horaire n'est affiché : ces informations dépendent des disponibilités
          réelles et vous sont communiquées par un conseiller lors de la demande.
        </DemoNote>
      </Section>

      <CtaBand
        title="Une destination en tête ?"
        text="Dites-nous où vous voulez aller : nous construisons l'itinéraire, le budget et l'accompagnement visa."
        to="/vols"
        label="Préparer un voyage"
      />
    </PageShell>
  );
}

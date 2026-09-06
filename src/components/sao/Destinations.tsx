import { useState } from "react";
import { ArrowRight, Plane } from "lucide-react";
import { Reveal } from "@/components/sao/Reveal";
import afrique from "@/assets/dest-afrique.jpg";
import europe from "@/assets/dest-europe.jpg";
import moyenOrient from "@/assets/dest-moyen-orient.jpg";
import asie from "@/assets/dest-asie.jpg";

type Zone = {
  id: string;
  img: string;
  title: string;
  desc: string;
  intro: string;
  villes: { ville: string; pays: string; duree: string; apd: string }[];
};

const ZONES: Zone[] = [
  {
    id: "afrique",
    img: afrique,
    title: "AFRIQUE",
    desc: "Explorez la richesse du continent.",
    intro: "Au départ de N'Djamena et de Dakar, un réseau dense vers les grandes capitales africaines.",
    villes: [
      { ville: "Dakar", pays: "Sénégal", duree: "5h10", apd: "310 000 FCFA" },
      { ville: "Abidjan", pays: "Côte d'Ivoire", duree: "4h35", apd: "295 000 FCFA" },
      { ville: "Casablanca", pays: "Maroc", duree: "6h20", apd: "385 000 FCFA" },
      { ville: "Nairobi", pays: "Kenya", duree: "5h45", apd: "420 000 FCFA" },
    ],
  },
  {
    id: "europe",
    img: europe,
    title: "EUROPE",
    desc: "Découvrez les plus belles villes d'Europe.",
    intro: "Correspondances optimisées vers l'Europe de l'Ouest, avec accompagnement visa et bagages suivis.",
    villes: [
      { ville: "Paris", pays: "France", duree: "8h05", apd: "560 000 FCFA" },
      { ville: "Bruxelles", pays: "Belgique", duree: "8h40", apd: "585 000 FCFA" },
      { ville: "Madrid", pays: "Espagne", duree: "7h55", apd: "540 000 FCFA" },
      { ville: "Genève", pays: "Suisse", duree: "8h20", apd: "610 000 FCFA" },
    ],
  },
  {
    id: "moyen-orient",
    img: moyenOrient,
    title: "MOYEN-ORIENT",
    desc: "Voyagez au cœur des cultures.",
    intro: "Hubs rapides vers le Golfe, idéals pour les voyages d'affaires, le cargo et les séjours religieux.",
    villes: [
      { ville: "Dubaï", pays: "Émirats", duree: "6h30", apd: "495 000 FCFA" },
      { ville: "Doha", pays: "Qatar", duree: "6h05", apd: "480 000 FCFA" },
      { ville: "Djeddah", pays: "Arabie saoudite", duree: "5h20", apd: "455 000 FCFA" },
      { ville: "Istanbul", pays: "Turquie", duree: "6h50", apd: "470 000 FCFA" },
    ],
  },
  {
    id: "asie",
    img: asie,
    title: "ASIE",
    desc: "Partez à la découverte de l'Asie.",
    intro: "Longs-courriers et solutions fret pour les importateurs, avec suivi de bout en bout.",
    villes: [
      { ville: "Guangzhou", pays: "Chine", duree: "13h10", apd: "760 000 FCFA" },
      { ville: "Bangkok", pays: "Thaïlande", duree: "12h25", apd: "735 000 FCFA" },
      { ville: "Mumbai", pays: "Inde", duree: "9h40", apd: "640 000 FCFA" },
      { ville: "Kuala Lumpur", pays: "Malaisie", duree: "13h50", apd: "790 000 FCFA" },
    ],
  },
];

export function Destinations() {
  const [activeId, setActiveId] = useState(ZONES[0]!.id);
  const active = ZONES.find((z) => z.id === activeId) ?? ZONES[0]!;

  return (
    <section id="destinations" className="bg-sao-ivory py-20">
      <div className="sao-container">
        <Reveal className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-sao-navy md:text-3xl">
            Destinations populaires
          </h2>
          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-sao-navy">
            4 zones · 16 villes
            <ArrowRight className="size-4 text-sao-gold" aria-hidden="true" />
          </span>
        </Reveal>

        <Reveal delay={60}>
          <div
            role="tablist"
            aria-label="Filtrer par zone"
            className="flex flex-wrap gap-2"
          >
            {ZONES.map((z) => {
              const selected = z.id === activeId;
              return (
                <button
                  key={z.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`zone-panel-${z.id}`}
                  id={`zone-tab-${z.id}`}
                  data-cursor="VOIR"
                  onClick={() => setActiveId(z.id)}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-[0.12em] transition-colors duration-200 ${
                    selected
                      ? "bg-sao-navy text-primary-foreground"
                      : "border border-sao-navy/20 bg-background text-sao-navy hover:bg-sao-gold/20"
                  }`}
                >
                  {z.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          id={`zone-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`zone-tab-${active.id}`}
          className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_1fr]"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
            {ZONES.map((z) => (
              <img
                key={z.id}
                src={z.img}
                alt={`Destination ${z.title}`}
                width={1024}
                height={768}
                loading="lazy"
                className={`h-72 w-full object-cover transition-opacity duration-700 md:h-[26rem] ${
                  z.id === active.id ? "opacity-100" : "absolute inset-0 opacity-0"
                }`}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "var(--scrim-hero)" }}
              aria-hidden="true"
            />
            <div key={active.id} className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground sao-fade-swap">
              <h3 className="text-2xl font-bold tracking-tight">{active.title}</h3>
              <p className="mt-1 max-w-md text-sm text-primary-foreground/85">{active.intro}</p>
            </div>
          </div>

          <ul key={active.id} className="sao-fade-swap grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {active.villes.map((v) => (
              <li
                key={v.ville}
                className="sao-card flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sao-gold/15">
                    <Plane className="size-4 text-sao-gold" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sao-navy">{v.ville}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {v.pays} · {v.duree} de vol
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-right text-xs font-semibold text-sao-navy">
                  dès
                  <br />
                  {v.apd}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Tarifs et durées indicatifs — données de démonstration.
        </p>
      </div>
    </section>
  );
}

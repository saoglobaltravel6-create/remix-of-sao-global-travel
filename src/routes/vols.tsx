import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Plane, ShieldCheck, Wallet } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { SearchEngine } from "@/components/sao/SearchEngine";
import { DESTINATIONS } from "@/lib/destinations";
import heroImg from "@/assets/hero-airport.jpg";

export const Route = createFileRoute("/vols")({
  head: () => ({
    meta: [
      { title: "Vols — Réservez votre itinéraire avec SAO Global Travel" },
      {
        name: "description",
        content:
          "Recherchez un vol au départ de N'Djamena ou Dakar, comparez les itinéraires et faites-vous accompagner jusqu'à l'embarquement.",
      },
      { property: "og:title", content: "Vols — SAO Global Travel" },
      {
        property: "og:description",
        content: "Recherche de vols, accompagnement visa et assistance à chaque étape du voyage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VolsPage,
});

const ETAPES = [
  { icon: Plane, t: "Recherchez", d: "Indiquez origine, destination, dates et passagers." },
  { icon: CheckCircle2, t: "Choisissez", d: "Un conseiller vous propose les itinéraires disponibles." },
  { icon: Wallet, t: "Payez", d: "Réglez en agence, par mobile money ou virement." },
  { icon: ShieldCheck, t: "Voyagez", d: "Assistance visa, bagages et suivi jusqu'à l'arrivée." },
];

function VolsPage() {
  return (
    <PageShell
      kicker="Voyager"
      title="Vols"
      intro="Un seul interlocuteur, du premier itinéraire à l'embarquement. Recherchez, comparez et laissez-nous finaliser."
      image={heroImg}
      imageAlt="Avion au décollage"
    >
      <Section title="Rechercher un vol">
        <SearchEngine />
        <DemoNote>
          Le moteur transmet votre demande à nos conseillers. Tant qu'aucune source de
          disponibilités en temps réel n'est connectée, aucun tarif affiché ne constitue une offre
          confirmée.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Comment ça se passe">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map(({ icon: Icon, t, d }, i) => (
            <li key={t} className="sao-card p-6">
              <span className="text-xs font-bold text-sao-gold">0{i + 1}</span>
              <Icon className="mt-3 size-6 text-sao-navy" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Départs fréquents" lead="Les aéroports les plus demandés sur notre réseau.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.slice(0, 9).map((d) => (
            <li key={d.iata} className="sao-card flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-sao-navy">
                  N'Djamena (NDJ) → {d.city}
                </p>
                <p className="truncate text-xs text-muted-foreground">{d.airport}</p>
              </div>
              <span className="rounded-full bg-sao-gold/20 px-2.5 py-1 text-xs font-bold text-sao-navy">
                {d.iata}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Une destination absente de cette liste ?{" "}
          <Link to="/contact" className="font-semibold text-sao-navy underline">
            Demandez-la à un conseiller
          </Link>
          .
        </p>
      </Section>

      <CtaBand
        title="Besoin d'un itinéraire sur mesure ?"
        text="Groupes, familles, missions professionnelles : nous construisons le trajet le plus simple et le plus économique."
      />
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Plane, ShieldCheck, Wallet } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { ServiceRequestForm } from "@/components/sao/ServiceRequestForm";
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
      <Section title="Rechercher un vol" lead="Prêt à réserver ? Utilisez la réservation guidée en 4 étapes (lien ci-dessous).">
        <SearchEngine />
        <DemoNote>
          Le moteur transmet votre demande à nos conseillers. Tant qu'aucune source de
          disponibilités en temps réel n'est connectée, aucun tarif affiché ne constitue une offre
          confirmée.
        </DemoNote>
      </Section>

      <section className="relative overflow-hidden bg-sao-navy py-20 text-primary-foreground">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-[22rem] rounded-full opacity-30 blur-3xl" style={{ background: "color-mix(in oklch, var(--sao-gold) 30%, transparent)" }} />
        <div className="sao-container relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sao-gold">Parcours voyageur</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight tracking-tight md:text-5xl">Comment ça se passe</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map(({ icon: Icon, t, d }, i) => (
              <li key={t} className="relative rounded-3xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-6">
                <span className="absolute right-5 top-4 font-display text-4xl font-bold text-primary-foreground/15" aria-hidden="true">0{i + 1}</span>
                <span className="inline-flex rounded-2xl border border-sao-gold/40 bg-sao-gold/15 p-3 text-sao-gold">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section title="Départs fréquents" lead="Les aéroports les plus demandés sur notre réseau.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.slice(0, 9).map((d) => (
            <li key={d.iata} className="group sao-card flex items-center gap-4 p-4 transition-[border-color,transform] duration-300 hover:border-sao-gold/60 motion-safe:hover:-translate-y-0.5">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sao-navy font-display text-base font-bold tracking-wide text-sao-gold">
                {d.iata}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">NDJ → {d.iata}</p>
                <p className="truncate font-semibold text-sao-navy">{d.city}</p>
                <p className="truncate text-xs text-muted-foreground">{d.airport}</p>
              </div>
              <Plane className="ml-auto size-4 shrink-0 text-sao-gold transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
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

      <Section id="demande" tone="ivory" title="Votre demande">
        <ServiceRequestForm service="vols" />
      </Section>

      <CtaBand
        title="Besoin d'un itinéraire sur mesure ?"
        text="Groupes, familles, missions professionnelles : nous construisons le trajet le plus simple et le plus économique."
      />
    </PageShell>
  );
}

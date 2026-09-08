import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, CalendarRange, Plane, Users } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import moyenOrient from "@/assets/dest-moyen-orient.jpg";

export const Route = createFileRoute("/sejours")({
  head: () => ({
    meta: [
      { title: "Séjours — Vol + hébergement sur mesure | SAO Global Travel" },
      {
        name: "description",
        content:
          "Séjours SAO Global Travel : vol, hébergement, transferts et assistance réunis dans une formule construite avec un conseiller.",
      },
      { property: "og:title", content: "Séjours — SAO Global Travel" },
      {
        property: "og:description",
        content: "Des formules complètes vol + hébergement, construites sur mesure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SejoursPage,
});

function SejoursPage() {
  return (
    <PageShell
      kicker="Découvrir"
      title="Séjours"
      intro="Vol, hébergement, transferts et assistance : une formule complète, construite avec vous plutôt que vendue sur catalogue."
      image={moyenOrient}
      imageAlt="Séjour à l'étranger"
    >
      <Section title="Ce que comprend un séjour SAO">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Plane, t: "Le vol", d: "Itinéraire choisi avec vous selon votre budget et vos dates." },
            { icon: BedDouble, t: "L'hébergement", d: "Hôtel ou appartement réservé et confirmé avant le départ." },
            { icon: CalendarRange, t: "Le programme", d: "Transferts, visites et temps libres organisés à votre rythme." },
            { icon: Users, t: "L'assistance", d: "Un conseiller joignable pendant toute la durée du séjour." },
          ].map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <DemoNote>
          Aucun prix de séjour n'est publié ici : chaque formule dépend des dates, de la durée et de
          la disponibilité réelle des vols et des hébergements.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Construire votre séjour">
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            "Vous nous donnez destination, dates approximatives et budget.",
            "Nous proposons une ou plusieurs formules chiffrées.",
            "Vous validez, nous réservons et confirmons chaque prestation.",
          ].map((s, i) => (
            <li key={s} className="sao-card p-5">
              <span className="text-xs font-bold text-sao-gold">0{i + 1}</span>
              <p className="mt-2 text-sm text-muted-foreground">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="Envie de partir ?"
        text="Parlez-nous de votre projet : nous construisons la formule qui vous correspond."
        to="/contact"
        label="Demander une proposition"
      />
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Luggage, ShieldCheck, Tag } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { ServiceRequestForm } from "@/components/sao/ServiceRequestForm";
import heroImg from "@/assets/hero-airport.jpg";

export const Route = createFileRoute("/bagages")({
  head: () => ({
    meta: [
      { title: "Bagages — Règles, franchises et préparation | SAO Global Travel" },
      {
        name: "description",
        content:
          "Cabine ou soute : préparez vos bagages, connaissez les objets interdits et voyagez sereinement avec SAO Global Travel.",
      },
      { property: "og:title", content: "Bagages — SAO Global Travel" },
      {
        property: "og:description",
        content: "Franchises, objets interdits, conseils de préparation et assistance bagages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BagagesPage,
});

const INTERDITS = [
  "Explosifs, munitions, articles pyrotechniques",
  "Gaz comprimés, bonbonnes et briquets à recharge",
  "Liquides inflammables, peintures, solvants",
  "Produits corrosifs, acides, batteries endommagées",
  "Batteries lithium hors appareil au-delà des seuils autorisés",
  "Objets tranchants en cabine (couteaux, cutters, ciseaux longs)",
];

const CONSEILS = [
  "Pesez vos bagages avant le départ pour éviter les frais d'excédent.",
  "Gardez papiers, médicaments, argent et électronique en cabine.",
  "Photographiez le contenu de votre valise avant l'enregistrement.",
  "Étiquetez chaque bagage avec nom, téléphone et adresse de destination.",
  "Retirez les anciennes étiquettes de vol pour éviter les erreurs de tri.",
];

const FAQ = [
  {
    q: "Quelle est ma franchise bagages ?",
    a: "Elle dépend de la compagnie aérienne, de la classe et de la route. Elle figure sur votre billet ; nos conseillers la vérifient avec vous avant l'émission.",
  },
  {
    q: "Puis-je acheter du poids supplémentaire ?",
    a: "Oui, dans la plupart des cas, avant le départ et à un tarif plus avantageux qu'à l'aéroport. Contactez-nous avec votre référence de réservation.",
  },
  {
    q: "Mon bagage n'est pas arrivé, que faire ?",
    a: "Déclarez-le immédiatement au comptoir de la compagnie à l'arrivée et conservez le reçu. Transmettez-nous la référence : nous assurons le suivi avec la compagnie.",
  },
];

function BagagesPage() {
  return (
    <PageShell
      kicker="Voyager"
      title="Bagages"
      intro="Cabine, soute, franchises et objets interdits : tout ce qu'il faut savoir avant de fermer votre valise."
      image={heroImg}
      imageAlt="Bagages dans un aéroport"
    >
      <Section title="Cabine et soute">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="sao-card p-6">
            <Luggage className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-sao-navy">Bagage cabine</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Il reste avec vous. Réservez-le aux documents, appareils électroniques, médicaments et
              objets de valeur. Les liquides y sont limités et doivent être présentés séparément au
              contrôle.
            </p>
          </article>
          <article className="sao-card p-6">
            <Tag className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-sao-navy">Bagage en soute</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enregistré au comptoir, il voyage en soute et vous est restitué à l'arrivée. Poids et
              dimensions dépendent de la compagnie et du billet émis.
            </p>
          </article>
        </div>
        <DemoNote>
          Les franchises exactes (poids, nombre de pièces, dimensions) sont fixées par chaque
          compagnie aérienne. Nous ne publions pas de chiffres génériques : votre conseiller vous
          confirme ceux de votre billet.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Objets interdits ou restreints">
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="sao-card space-y-3 p-6">
            {INTERDITS.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-sao-navy">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sao-red" aria-hidden="true" />
                {i}
              </li>
            ))}
          </ul>
          <ul className="sao-card space-y-3 p-6">
            {CONSEILS.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-sao-navy">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sao-gold" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Questions fréquentes">
        <div className="grid gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="sao-card p-5">
              <summary className="cursor-pointer font-semibold text-sao-navy">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section id="demande" tone="ivory" title="Votre demande">
        <ServiceRequestForm service="bagages" />
      </Section>

      <CtaBand
        title="Un doute sur vos bagages ?"
        text="Envoyez-nous votre référence de réservation : nous vérifions votre franchise et vos options avant le départ."
      />
    </PageShell>
  );
}

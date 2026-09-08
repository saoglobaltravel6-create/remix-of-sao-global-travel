import { createFileRoute } from "@tanstack/react-router";
import { Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import { PageShell, Section, CtaBand } from "@/components/sao/PageShell";
import hero from "@/assets/hero-airport.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Une marque africaine, ouverte sur le monde | SAO" },
      {
        name: "description",
        content:
          "SAO Global Travel : notre ADN, notre mission et notre manière d'accompagner les voyages, les envois et les transferts entre l'Afrique et le monde.",
      },
      { property: "og:title", content: "À propos — SAO Global Travel" },
      {
        property: "og:description",
        content: "L'ADN, la mission et les engagements de SAO Global Travel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALEURS = [
  { icon: Compass, t: "Proximité", d: "Un interlocuteur identifié, joignable, qui connaît vos itinéraires et vos contraintes." },
  { icon: ShieldCheck, t: "Fiabilité", d: "Des informations vérifiées avant d'être annoncées : pas de promesse que nous ne pouvons pas tenir." },
  { icon: HeartHandshake, t: "Ouverture", d: "Une marque africaine qui relie les diasporas, les familles et les entreprises au reste du monde." },
];

function AboutPage() {
  return (
    <PageShell
      kicker="SAO"
      title="À propos"
      intro="Une marque africaine, ouverte sur le monde. Voyager, expédier, transférer, découvrir : quatre métiers, un même exigence d'accompagnement."
      image={hero}
      imageAlt="Voyageurs dans un aéroport"
    >
      <Section title="Notre mission">
        <p className="max-w-3xl text-muted-foreground">
          SAO Global Travel accompagne les voyageurs et les expéditeurs entre le Tchad, le Sénégal et
          le reste du monde. Nous réunissons dans une même maison la réservation de vols, le
          transport routier régional, l'envoi de colis et de fret, les séjours et les circuits, ainsi
          que les services SAO Money. Notre rôle est de simplifier des démarches souvent complexes,
          en restant joignables du premier échange jusqu'à l'arrivée.
        </p>
      </Section>

      <Section tone="ivory" title="Nos engagements">
        <div className="grid gap-4 md:grid-cols-3">
          {VALEURS.map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Envie d'en savoir plus ?"
        text="Nos conseillers présentent volontiers nos services et étudient votre besoin, particulier ou professionnel."
        to="/contact"
        label="Nous contacter"
      />
    </PageShell>
  );
}

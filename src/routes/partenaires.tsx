import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Network, Sparkles } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import moyenOrient from "@/assets/dest-moyen-orient.jpg";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Partenaires — Notre écosystème | SAO Global Travel" },
      {
        name: "description",
        content:
          "Compagnies, transporteurs, hôteliers et acteurs financiers : comment SAO Global Travel construit son réseau de partenaires.",
      },
      { property: "og:title", content: "Partenaires — SAO Global Travel" },
      {
        property: "og:description",
        content: "Notre écosystème de partenaires et les conditions pour nous rejoindre.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartenairesPage,
});

function PartenairesPage() {
  return (
    <PageShell
      kicker="Découvrir"
      title="Partenaires"
      intro="Notre force vient d'un réseau : compagnies aériennes, transporteurs routiers, agents de fret, hôteliers et acteurs financiers."
      image={moyenOrient}
      imageAlt="Poignée de main entre partenaires"
    >
      <Section title="Notre approche">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Network, t: "Un réseau multi-métiers", d: "Aérien, routier, fret, hébergement et services financiers réunis autour d'un même parcours client." },
            { icon: Handshake, t: "Des accords vérifiés", d: "Nous n'annonçons un partenaire qu'une fois l'accord formalisé des deux côtés." },
            { icon: Sparkles, t: "Une exigence commune", d: "Ponctualité, transparence et qualité de service : nos critères de sélection." },
          ].map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <DemoNote>
          La liste nominative des partenaires et leurs logos ne sont pas affichés ici tant que les
          autorisations d'utilisation ne nous ont pas été transmises.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Devenir partenaire">
        <p className="max-w-2xl text-muted-foreground">
          Vous êtes transporteur, hôtelier, agent de fret ou acteur financier et souhaitez travailler
          avec SAO Global Travel ? Présentez-nous votre activité, vos zones couvertes et vos
          références : nous étudions chaque candidature.
        </p>
      </Section>

      <CtaBand
        title="Proposer un partenariat"
        text="Envoyez-nous votre présentation et vos zones d'intervention."
        to="/contact"
        label="Écrire à l'équipe"
      />
    </PageShell>
  );
}

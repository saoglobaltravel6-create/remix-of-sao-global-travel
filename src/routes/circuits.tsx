import { createFileRoute } from "@tanstack/react-router";
import { Compass, Map as MapIcon, Tent, UsersRound } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import afrique from "@/assets/dest-afrique.jpg";

export const Route = createFileRoute("/circuits")({
  head: () => ({
    meta: [
      { title: "Circuits — Itinéraires guidés au Tchad et ailleurs | SAO" },
      {
        name: "description",
        content:
          "Circuits accompagnés SAO Global Travel : itinéraires guidés au Tchad et dans la région, avec guides locaux et logistique prise en charge.",
      },
      { property: "og:title", content: "Circuits — SAO Global Travel" },
      {
        property: "og:description",
        content: "Des itinéraires guidés, encadrés par des guides locaux.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CircuitsPage,
});

function CircuitsPage() {
  return (
    <PageShell
      kicker="Découvrir"
      title="Circuits"
      intro="Des itinéraires guidés pour découvrir le Tchad et la région, avec des guides locaux et une logistique entièrement prise en charge."
      image={afrique}
      imageAlt="Paysage de circuit au Tchad"
    >
      <Section title="Notre manière d'organiser un circuit">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapIcon, t: "Itinéraire", d: "Étapes, distances et temps de route étudiés avant le départ." },
            { icon: UsersRound, t: "Guides locaux", d: "Des accompagnateurs qui connaissent le terrain et les communautés." },
            { icon: Tent, t: "Logistique", d: "Véhicules, hébergements et repas organisés de bout en bout." },
            { icon: Compass, t: "Sécurité", d: "Itinéraires ajustés selon les conditions réelles du moment." },
          ].map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <DemoNote>
          Les circuits programmés, leurs dates et leurs tarifs ne sont pas encore publiés : ils
          dépendent de la saison et des conditions d'accès. Chaque circuit est confirmé au cas par cas.
        </DemoNote>
      </Section>

      <CtaBand
        title="Un circuit à imaginer ?"
        text="Dites-nous ce que vous souhaitez découvrir et sur combien de jours : nous proposons un itinéraire."
        to="/contact"
        label="Demander un itinéraire"
      />
    </PageShell>
  );
}

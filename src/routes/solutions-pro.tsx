import { createFileRoute } from "@tanstack/react-router";
import { Building2, FileSpreadsheet, Plane, Truck } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { ServiceRequestForm } from "@/components/sao/ServiceRequestForm";
import europe from "@/assets/dest-europe.jpg";

export const Route = createFileRoute("/solutions-pro")({
  head: () => ({
    meta: [
      { title: "Solutions professionnelles — Entreprises et ONG | SAO" },
      {
        name: "description",
        content:
          "Voyages d'affaires, fret, transport de groupe et facturation centralisée pour les entreprises, ONG et institutions.",
      },
      { property: "og:title", content: "Solutions professionnelles — SAO Global Travel" },
      {
        property: "og:description",
        content: "Un accompagnement dédié aux entreprises, ONG et institutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProPage,
});

const OFFRES = [
  { icon: Plane, t: "Voyages d'affaires", d: "Réservation des missions, changements de dernière minute et suivi des voyageurs." },
  { icon: Truck, t: "Fret et logistique", d: "Envois récurrents, groupage et acheminement de matériel de terrain." },
  { icon: Building2, t: "Transport de groupe", d: "Déplacements d'équipes, séminaires et missions terrain sur devis." },
  { icon: FileSpreadsheet, t: "Facturation centralisée", d: "Un récapitulatif unique par entité, projet ou centre de coût." },
];

function ProPage() {
  return (
    <PageShell
      kicker="Expédier"
      title="Solutions professionnelles"
      intro="Entreprises, ONG et institutions : un interlocuteur unique pour vos déplacements, vos envois et vos missions terrain."
      image={europe}
      imageAlt="Équipe professionnelle en déplacement"
    >
      <Section title="Ce que nous prenons en charge">
        <div className="grid gap-4 sm:grid-cols-2">
          {OFFRES.map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <DemoNote>
          Chaque offre professionnelle est établie sur devis, après analyse de vos volumes et de vos
          destinations. Aucun tarif type n'est publié ici.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Comment démarrer">
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            "Vous décrivez vos besoins : destinations, fréquence, volumes.",
            "Nous construisons une proposition chiffrée et un mode de fonctionnement.",
            "Un conseiller dédié suit vos demandes au quotidien.",
          ].map((s, i) => (
            <li key={s} className="sao-card p-5">
              <span className="text-xs font-bold text-sao-gold">0{i + 1}</span>
              <p className="mt-2 text-sm text-muted-foreground">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="demande" tone="ivory" title="Votre demande">
        <ServiceRequestForm service="solutions-pro" />
      </Section>

      <CtaBand
        title="Demander une proposition"
        text="Décrivez votre activité et vos flux : nous revenons vers vous avec une offre adaptée."
        to="/contact"
        label="Contacter l'équipe pro"
      />
    </PageShell>
  );
}

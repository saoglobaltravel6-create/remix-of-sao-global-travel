import { createFileRoute } from "@tanstack/react-router";
import { Boxes, FileCheck2, Plane, Warehouse } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { ServiceRequestForm } from "@/components/sao/ServiceRequestForm";
import asie from "@/assets/dest-asie.jpg";

export const Route = createFileRoute("/cargo")({
  head: () => ({
    meta: [
      { title: "Cargo — Fret aérien et solutions volume | SAO Global Travel" },
      {
        name: "description",
        content:
          "Fret aérien, groupage, dédouanement et livraison : les solutions cargo de SAO Global Travel pour importateurs et entreprises.",
      },
      { property: "og:title", content: "Cargo — SAO Global Travel" },
      {
        property: "og:description",
        content: "Groupage, dédouanement, entreposage et livraison finale, sur devis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CargoPage,
});

const OFFRES = [
  { icon: Plane, t: "Fret aérien", d: "Envois urgents et marchandises à forte valeur, au départ des principaux hubs." },
  { icon: Boxes, t: "Groupage", d: "Mutualisez un volume avec d'autres expéditeurs pour réduire le coût unitaire." },
  { icon: FileCheck2, t: "Dédouanement", d: "Préparation documentaire et accompagnement des formalités douanières." },
  { icon: Warehouse, t: "Entreposage & livraison", d: "Stockage temporaire puis remise à l'adresse finale." },
];

function CargoPage() {
  return (
    <PageShell
      kicker="Expédier"
      title="Cargo"
      intro="Le fret professionnel sans friction : de l'enlèvement au dédouanement, jusqu'à la livraison finale."
      image={asie}
      imageAlt="Zone de fret"
    >
      <Section title="Nos solutions">
        <ul className="grid gap-4 sm:grid-cols-2">
          {OFFRES.map(({ icon: Icon, t, d }) => (
            <li key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ivory" title="Documents généralement demandés">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Facture commerciale",
            "Liste de colisage",
            "Identité ou registre de commerce de l'expéditeur",
            "Certificat d'origine lorsqu'il est exigé",
            "Autorisations spécifiques selon la marchandise",
            "Coordonnées complètes du destinataire",
          ].map((d) => (
            <li key={d} className="sao-card p-4 text-sm text-sao-navy">
              {d}
            </li>
          ))}
        </ul>
        <DemoNote>
          Les exigences varient selon le pays de destination et la nature de la marchandise. Nous
          établissons la liste définitive et le devis après étude de votre dossier.
        </DemoNote>
      </Section>

      <Section id="demande" tone="ivory" title="Votre demande">
        <ServiceRequestForm service="cargo" />
      </Section>

      <CtaBand
        title="Demandez une étude cargo"
        text="Indiquez nature, poids, volume, origine et destination : nous revenons avec un plan d'acheminement chiffré."
        to="/solutions-pro"
        label="Solutions professionnelles"
      />
    </PageShell>
  );
}

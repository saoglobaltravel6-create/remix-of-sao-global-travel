import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/sao/PageShell";
import { FlightRadar } from "@/components/sao/FlightRadar";
import { RadarTabs } from "@/components/sao/RadarTabs";
import asie from "@/assets/dest-asie.jpg";

export const Route = createFileRoute("/radar/")({
  head: () => ({
    meta: [
      { title: "Radar aérien en direct | SAO Global Travel" },
      { name: "description", content: "Carte des aéronefs reçus en temps réel depuis OpenSky Network par le radar SAO." },
      { property: "og:title", content: "Radar aérien SAO en direct" },
      { property: "og:description", content: "Positions réelles des avions reçues d'OpenSky Network, par région." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell kicker="Radar SAO" title="Radar aérien" intro="Les positions affichées viennent uniquement des réponses réelles d'OpenSky Network." image={asie} imageAlt="Ciel et avion">
      <Section><RadarTabs /><FlightRadar /></Section>
    </PageShell>
  ),
});

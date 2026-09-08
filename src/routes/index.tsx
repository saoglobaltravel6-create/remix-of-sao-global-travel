import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sao/Navbar";
import { Preloader } from "@/components/sao/Preloader";
import { ScrollProgress } from "@/components/sao/ScrollProgress";
import { Hero } from "@/components/sao/Hero";
import { AircraftCinematic } from "@/components/sao/AircraftCinematic";
import { GlobeExperience } from "@/components/sao/GlobeExperience";
import { SearchEngine } from "@/components/sao/SearchEngine";
import { Services } from "@/components/sao/Services";
import { Destinations } from "@/components/sao/Destinations";
import { TrackingMoney } from "@/components/sao/TrackingMoney";
import { Adn } from "@/components/sao/Adn";
import { Footer } from "@/components/sao/Footer";
import { GoldCursor } from "@/components/sao/GoldCursor";
import { Reveal } from "@/components/sao/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAO Global Travel — Vols, colis, cargo et SAO Money" },
      {
        name: "description",
        content:
          "Réservez vos vols, expédiez colis et cargo, suivez vos envois et transférez de l'argent depuis N'Djamena et Dakar avec SAO Global Travel.",
      },
      { property: "og:title", content: "SAO Global Travel — Voyagez. Découvrez. Connectez le monde." },
      {
        property: "og:description",
        content:
          "Vols, bagages, colis, cargo, bus, SAO Money, hébergements et circuits : une seule plateforme africaine ouverte sur le monde.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Preloader />
      <ScrollProgress />
      <Navbar />

      <GoldCursor />

      <main>
        <Hero />
        <Reveal><SearchEngine /></Reveal>
        <AircraftCinematic />
        <Reveal><Services /></Reveal>
        <GlobeExperience />
        <Destinations />
        <Reveal><TrackingMoney /></Reveal>
        <Reveal><Adn /></Reveal>
      </main>
      <Footer />
    </div>
  );
}

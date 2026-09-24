import { createFileRoute } from "@tanstack/react-router";
import { CinematicNavbar } from "@/components/sao/CinematicNavbar";
import { Preloader } from "@/components/sao/Preloader";
import { ScrollProgress } from "@/components/sao/ScrollProgress";
import { HeroVideoScroll } from "@/components/sao/HeroVideoScroll";
import { AircraftCinematic } from "@/components/sao/AircraftCinematic";
import { GlobeExperience } from "@/components/sao/GlobeExperience";
import { SearchEngine } from "@/components/sao/SearchEngine";
import { ServicesGlass } from "@/components/sao/ServicesGlass";
import { Services } from "@/components/sao/Services";
import { Destinations } from "@/components/sao/Destinations";
import { TrackingMoney } from "@/components/sao/TrackingMoney";
import { Adn } from "@/components/sao/Adn";
import { Footer } from "@/components/sao/Footer";
import { GoldCursor } from "@/components/sao/GoldCursor";
import { Reveal } from "@/components/sao/Reveal";
import { TravelAdvisor } from "@/components/sao/TravelAdvisor";

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
      <CinematicNavbar />

      <GoldCursor />

      <main>
        <HeroVideoScroll />
        <div className="h-[40vh] md:h-[80vh]" aria-hidden="true" />
        <Reveal><SearchEngine /></Reveal>
        <AircraftCinematic />
        <ServicesGlass />
        <Reveal><TravelAdvisor /></Reveal>
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

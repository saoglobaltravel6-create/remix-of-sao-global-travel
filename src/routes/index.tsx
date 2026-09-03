import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sao/Navbar";
import { Preloader } from "@/components/sao/Preloader";
import { ScrollProgress } from "@/components/sao/ScrollProgress";
import { Hero } from "@/components/sao/Hero";
import { SearchEngine } from "@/components/sao/SearchEngine";
import { Services } from "@/components/sao/Services";
import { Destinations } from "@/components/sao/Destinations";
import { TrackingMoney } from "@/components/sao/TrackingMoney";
import { Adn } from "@/components/sao/Adn";
import { Footer } from "@/components/sao/Footer";

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

      <main>
        <Hero />
        <SearchEngine />
        <Services />
        <Destinations />
        <TrackingMoney />
        <Adn />
      </main>
      <Footer />
    </div>
  );
}

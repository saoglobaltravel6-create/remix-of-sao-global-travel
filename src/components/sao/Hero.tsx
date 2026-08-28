import { ArrowRight, PackageSearch } from "lucide-react";
import heroImg from "@/assets/hero-airport.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[86svh] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Voyageur observant un avion au décollage depuis un terminal d'aéroport"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-background/55 md:bg-gradient-to-r md:from-background/90 md:via-background/70 md:to-transparent" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--scrim-hero)" }}
        aria-hidden="true"
      />

      <div className="sao-container relative z-10 flex min-h-[86svh] flex-col justify-end pb-28 pt-40 md:pb-36">
        <div className="reveal-up max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sao-navy">
            <span
              className="size-[7px] rounded-full bg-sao-gold shadow-[0_0_10px_var(--sao-gold)]"
              style={{ animation: "dotPulse 1.8s infinite" }}
              aria-hidden="true"
            />
            Voyage · Transport · Logistique
          </span>
          <h1 className="mt-5 font-display text-6xl leading-none tracking-tighter text-sao-navy md:text-7xl lg:text-8xl">
            LE MONDE
            <span className="-mt-3 block text-sao-gold">COMMENCE ICI.</span>
          </h1>
        </div>

        <div className="reveal-right mt-7 max-w-2xl" style={{ animationDelay: "0.06s" }}>
          <p className="text-lg text-sao-navy/80 md:text-xl">
            Voyagez, envoyez, transportez et connectez-vous depuis une seule plateforme.
          </p>
        </div>

        <div className="reveal-right mt-8 flex flex-wrap gap-4" style={{ animationDelay: "0.14s" }}>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-full bg-sao-navy px-7 py-4 text-sm font-semibold tracking-wide text-primary-foreground transition-[filter] duration-200 hover:brightness-125"
          >
            EXPLORER LES SERVICES <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#suivi"
            className="inline-flex items-center gap-2 rounded-full border border-sao-navy/30 bg-background/40 px-7 py-4 text-sm font-semibold tracking-wide text-sao-navy backdrop-blur transition-colors duration-200 hover:bg-sao-gold hover:text-sao-navy"
          >
            SUIVRE MON ENVOI <PackageSearch className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

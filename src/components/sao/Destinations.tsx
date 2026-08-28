import { ArrowRight } from "lucide-react";
import afrique from "@/assets/dest-afrique.jpg";
import europe from "@/assets/dest-europe.jpg";
import moyenOrient from "@/assets/dest-moyen-orient.jpg";
import asie from "@/assets/dest-asie.jpg";

const ZONES = [
  { img: afrique, title: "AFRIQUE", desc: "Explorez la richesse du continent." },
  { img: europe, title: "EUROPE", desc: "Découvrez les plus belles villes d'Europe." },
  { img: moyenOrient, title: "MOYEN-ORIENT", desc: "Voyagez au cœur des cultures." },
  { img: asie, title: "ASIE", desc: "Partez à la découverte de l'Asie." },
];

export function Destinations() {
  return (
    <section id="destinations" className="bg-sao-ivory py-20">
      <div className="sao-container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-sao-navy md:text-3xl">
            Destinations populaires
          </h2>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-sao-navy">
            Voir toutes les destinations
            <ArrowRight className="size-4 text-sao-gold" aria-hidden="true" />
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ZONES.map((z) => (
            <article
              key={z.title}
              className="group relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)]"
            >
              <img
                src={z.img}
                alt={`Destination ${z.title}`}
                width={1024}
                height={768}
                loading="lazy"
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 xl:h-80"
              />
              <div
                className="absolute inset-0"
                style={{ background: "var(--scrim-hero)" }}
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <h3 className="text-xl font-bold tracking-tight">{z.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/85">{z.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

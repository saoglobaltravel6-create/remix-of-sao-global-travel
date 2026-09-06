import { CinematicVideo } from "@/components/sao/CinematicVideo";
import { useSectionProgress } from "@/hooks/use-scroll-progress";
import { VIDEOS } from "@/lib/media";

/**
 * Séquence B — Le départ.
 * Section épinglée : la vidéo d'avion progresse avec le scroll (desktop),
 * les textes se révèlent par paliers. Sur mobile : vidéo en boucle simple.
 */
export function AircraftCinematic() {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();

  const steps = [
    { at: 0.06, kicker: "N'DJAMENA", title: "LE DÉPART" },
    { at: 0.42, kicker: "AFRIQUE", title: "L'ENVOL" },
    { at: 0.74, kicker: "INTERNATIONAL", title: "LE MONDE S'OUVRE" },
  ];
  const activeIndex = steps.reduce((acc, s, i) => (progress >= s.at ? i : acc), 0);
  const active = steps[activeIndex]!;

  return (
    <section
      id="envol"
      aria-label="Séquence cinématique : le départ"
      ref={ref}
      className="relative h-[260svh] bg-sao-navy md:h-[300svh]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <CinematicVideo
          asset={VIDEOS.aircraft}
          progress={progress}
          className="absolute inset-0 size-full"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.221 0.052 262.5 / 0.7) 0%, oklch(0.221 0.052 262.5 / 0.25) 45%, oklch(0.221 0.052 262.5 / 0.85) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="sao-container relative flex h-full flex-col justify-center">
          <div
            key={active.title}
            className="sao-fade-swap max-w-2xl"
            style={{
              transform: `translate3d(0, ${(0.5 - progress) * 40}px, 0)`,
            }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sao-gold">
              {active.kicker}
            </span>
            <h2 className="mt-4 font-display text-5xl leading-none tracking-tighter text-primary-foreground md:text-7xl">
              {active.title}
            </h2>
            <p className="mt-5 max-w-md text-base text-primary-foreground/80 md:text-lg">
              Voyagez, envoyez, transportez et connectez-vous depuis une seule
              plateforme.
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-8">
            <div className="sao-container flex items-center gap-3">
              {steps.map((s, i) => (
                <span
                  key={s.title}
                  className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
                    i <= activeIndex ? "bg-sao-gold" : "bg-primary-foreground/25"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { CinematicVideo } from "@/components/sao/CinematicVideo";
import { useSectionProgress } from "@/hooks/use-scroll-progress";
import { VIDEOS } from "@/lib/media";

/**
 * Séquence C — Le monde dans votre main.
 * Narration en 4 paliers pilotée par le scroll, section épinglée,
 * plusieurs plans (vidéo / texte / signature SAO) à vitesses différentes.
 */
export function GlobeExperience() {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();

  const p = progress;
  const show = (from: number, to = 1) => (p >= from && p < to ? 1 : 0);

  return (
    <section
      id="globe"
      aria-label="Le monde dans votre main"
      ref={ref}
      className="relative h-[300svh] bg-sao-navy"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Plan 1 — vidéo */}
        <CinematicVideo
          asset={VIDEOS.globe}
          progress={p}
          className="absolute inset-0 size-full"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 45%, transparent 30%, oklch(0.221 0.052 262.5 / 0.75) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Plan 4 — atmosphère */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.221 0.052 262.5 / 0.55) 0%, transparent 35%, oklch(0.221 0.052 262.5 / 0.7) 100%)",
            transform: `translate3d(0, ${p * -30}px, 0)`,
          }}
          aria-hidden="true"
        />

        {/* Plan 2 — texte */}
        <div className="sao-container relative flex h-full flex-col items-start justify-center">
          <div style={{ transform: `translate3d(0, ${(0.5 - p) * 70}px, 0)` }}>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tighter text-primary-foreground md:text-7xl">
              <span
                className="block transition-all duration-700"
                style={{
                  opacity: p < 0.85 ? 1 : 0.35,
                  transform: `scale(${1 + p * 0.04})`,
                  transformOrigin: "left",
                }}
              >
                LE MONDE
              </span>
              <span
                className="block text-sao-gold transition-all duration-700"
                style={{
                  opacity: p > 0.22 ? 1 : 0,
                  transform: `translate3d(0, ${p > 0.22 ? 0 : 24}px, 0)`,
                }}
              >
                DANS VOTRE MAIN.
              </span>
            </h2>

            <p
              className="mt-6 max-w-md text-base text-primary-foreground/85 transition-all duration-700 md:text-lg"
              style={{
                opacity: show(0.48, 0.88),
                transform: `translate3d(0, ${p > 0.48 ? 0 : 20}px, 0)`,
              }}
            >
              Voyagez. Découvrez. Connectez le monde.
            </p>

            <p
              className="mt-6 font-display text-3xl tracking-tighter text-primary-foreground transition-all duration-700 md:text-5xl"
              style={{
                opacity: p >= 0.86 ? 1 : 0,
                transform: `translate3d(0, ${p >= 0.86 ? 0 : 24}px, 0)`,
              }}
            >
              LE MONDE <span className="text-sao-gold">COMMENCE ICI.</span>
            </p>
          </div>
        </div>

        {/* Plan 3 — repère de progression SAO */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8">
          <div className="sao-container flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-primary-foreground/70">
            <span className="text-sao-gold">◆</span>
            <span className="h-px flex-1 bg-primary-foreground/20">
              <span
                className="block h-px bg-sao-gold"
                style={{ width: `${Math.round(p * 100)}%` }}
              />
            </span>
            <span>{String(Math.round(p * 99)).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

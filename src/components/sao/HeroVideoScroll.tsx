import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroVideo from "@/assets/video/sao-hero-airport.mp4.asset.json";
import heroPoster from "@/assets/video/sao-hero-airport-poster.jpg.asset.json";

/**
 * Héro cinématique : vidéo réelle SAO pilotée par le scroll (lerp fluide).
 * Mobile / prefers-reduced-motion : boucle simple ou image fixe, jamais de scrub.
 */
export function HeroVideoScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    setLight(reduced || small);

    let raf = 0;
    let target = 0;
    let current = 0;

    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      target = p;
      setProgress(p);
    };

    const loop = () => {
      current += (target - current) * 0.09;
      const v = videoRef.current;
      if (v && v.duration && !reduced && !small) {
        const t = current * (v.duration - 0.05);
        if (Math.abs(v.currentTime - t) > 0.015) v.currentTime = t;
      }
      raf = requestAnimationFrame(loop);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (!reduced && !small) raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const block = (from: number, to: number) => {
    const visible = progress >= from && progress < to;
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: "opacity 600ms var(--ease-soft), transform 700ms var(--ease-soft)",
      pointerEvents: (visible ? "auto" : "none") as "auto" | "none",
    };
  };

  return (
    <div
      ref={wrapRef}
      data-nav-tone={progress >= 0.62 ? "dark" : "light"}
      className="relative h-[340vh] md:h-[380vh]"
    >
      <section className="sticky top-0 h-svh w-full overflow-hidden">
        {light ? (
          <img
            src={heroPoster.url}
            alt="Avion SAO Global Travel sur l'aire de l'aéroport international Hassan Djamous"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={heroVideo.url}
            poster={heroPoster.url}
            muted
            playsInline
            preload="auto"
            aria-label="Séquence aérienne SAO Global Travel"
            className="absolute inset-0 size-full object-cover"
          />
        )}

        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background:
              progress >= 0.62
                ? "linear-gradient(to top, color-mix(in oklch, var(--sao-navy) 92%, transparent), color-mix(in oklch, var(--sao-navy) 55%, transparent))"
                : "linear-gradient(to top, color-mix(in oklch, var(--background) 88%, transparent), color-mix(in oklch, var(--background) 18%, transparent))",
          }}
          aria-hidden="true"
        />

        <div className="sao-container relative z-10 flex h-svh flex-col justify-center">
          {/* Bloc 1 */}
          <div className="absolute inset-x-0 px-6 md:px-10" style={block(0, 0.33)}>
            <div className="max-w-2xl">
              <h1 className="font-display text-6xl leading-none tracking-tighter text-sao-navy md:text-8xl">
                LE MONDE<span className="block text-sao-gold">COMMENCE ICI.</span>
              </h1>
              <p className="mt-5 text-lg text-sao-navy/80">
                Connecter l'Afrique, ouvrir le monde.
              </p>
              <Link
                to="/vols"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-sao-navy px-7 py-4 text-sm font-semibold text-primary-foreground"
              >
                Réserver un vol <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Bloc 2 */}
          <div className="absolute inset-x-0 px-6 text-center md:px-10" style={block(0.33, 0.64)}>
            <p className="mx-auto max-w-3xl font-display text-3xl leading-tight tracking-tight text-sao-navy md:text-5xl">
              Voyagez, <span className="text-sao-gold">envoyez</span>, transportez et{" "}
              <span className="text-sao-red">connectez-vous</span> — depuis une seule plateforme.
            </p>
            <ArrowDown className="mx-auto mt-8 size-5 text-sao-navy/60" aria-hidden="true" />
            <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full"
                  style={{
                    background:
                      progress * 3 >= i + 1 ? "var(--sao-gold)" : "color-mix(in oklch, var(--sao-navy) 25%, transparent)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bloc 3 */}
          <div className="absolute inset-x-0 px-6 text-right md:px-10" style={block(0.64, 1.01)}>
            <div className="ml-auto max-w-2xl">
              <p className="font-display text-5xl leading-none tracking-tighter text-sao-ivory md:text-7xl">
                SAO GLOBAL TRAVEL
              </p>
              <p className="mt-4 text-lg text-sao-ivory/80">Voyagez. Connectez. Découvrez.</p>
              <Link
                to="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-sao-gold px-7 py-4 text-sm font-semibold text-sao-navy"
              >
                Nous contacter <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

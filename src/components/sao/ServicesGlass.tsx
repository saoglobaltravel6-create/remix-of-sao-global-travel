import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plane, Package, CircleDollarSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CAPABILITIES = [
  {
    icon: Plane,
    title: "Voyager",
    desc: "Vols au départ de N'Djamena et Dakar, bagages suivis, séjours et circuits.",
    to: "/vols",
    cta: "Voir les vols",
  },
  {
    icon: Package,
    title: "Expédier",
    desc: "Colis vers vos proches, cargo professionnel et transport régional par bus.",
    to: "/colis",
    cta: "Envoyer un colis",
  },
  {
    icon: CircleDollarSign,
    title: "Transférer",
    desc: "SAO Money : envoyez et recevez de l'argent entre l'Afrique et le monde.",
    to: "/saomoney",
    cta: "Découvrir SAO Money",
  },
] as const;

/** Scène navy en verre dépoli : trois capacités révélées en décalé. */
export function ServicesGlass() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.18 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-nav-tone="dark"
      className="relative overflow-hidden bg-sao-navy py-24 text-primary-foreground"
      aria-labelledby="capacites-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "color-mix(in oklch, var(--sao-gold) 28%, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 size-[24rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "color-mix(in oklch, var(--sao-red) 22%, transparent)" }}
      />

      <div className="sao-container relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-sao-gold" aria-hidden="true" />
          Une seule plateforme
        </span>

        <h2
          id="capacites-title"
          className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl"
        >
          Tout ce qui relie <span className="text-sao-gold">l'Afrique</span> au reste du monde.
        </h2>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, desc, to, cta }, index) => (
            <li
              key={title}
              className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-8 backdrop-blur-xl motion-reduce:!transform-none motion-reduce:!transition-none"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(26px)",
                transition: `opacity 700ms var(--ease-soft) ${index * 130}ms, transform 800ms var(--ease-soft) ${index * 130}ms`,
              }}
            >
              <span className="inline-flex rounded-2xl border border-sao-gold/40 bg-sao-gold/15 p-3 text-sao-gold">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">{desc}</p>
              <Link
                to={to}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-sao-gold hover:underline"
              >
                {cta}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

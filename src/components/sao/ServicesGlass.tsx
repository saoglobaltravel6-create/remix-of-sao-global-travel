import { Link } from "@tanstack/react-router";
import { ArrowRight, Plane, Package, CircleDollarSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SubLink = { label: string; to: "/vols" | "/bagages" | "/sejours" | "/circuits" | "/colis" | "/cargo" | "/bus" | "/suivi" };

const CAPABILITIES: ReadonlyArray<{
  icon: typeof Plane; title: string; desc: string; to: "/reservation" | "/colis" | "/saomoney"; cta: string; hint: string; links: SubLink[];
}> = [
  { icon: Plane, title: "Voyager", desc: "Vols au départ de N'Djamena et Dakar, bagages suivis, séjours et circuits.", to: "/reservation", cta: "Réserver un voyage", hint: "Parcours voyageur",
    links: [{ label: "Vols", to: "/vols" }, { label: "Bagages", to: "/bagages" }, { label: "Séjours", to: "/sejours" }, { label: "Circuits", to: "/circuits" }] },
  { icon: Package, title: "Expédier", desc: "Colis vers vos proches, cargo professionnel et transport régional par bus.", to: "/colis", cta: "Envoyer un colis", hint: "Parcours expédition",
    links: [{ label: "Colis", to: "/colis" }, { label: "Cargo", to: "/cargo" }, { label: "Bus", to: "/bus" }, { label: "Suivre un envoi", to: "/suivi" }] },
  { icon: CircleDollarSign, title: "Transférer", desc: "SAO Money : envoyez et recevez de l'argent entre l'Afrique et le monde.", to: "/saomoney", cta: "Envoyer de l'argent", hint: "Parcours SAO Money", links: [] },
];

type MotionMode = "full" | "lite" | "none";

function detectMotion(): MotionMode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const weak =
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4 ||
    nav.connection?.saveData === true ||
    window.matchMedia("(max-width: 767px)").matches;
  return weak ? "lite" : "full";
}

/** Scène navy en verre dépoli : trois parcours révélés en décalé, allégés selon l'appareil. */
export function ServicesGlass() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [mode, setMode] = useState<MotionMode>("full");

  useEffect(() => {
    const m = detectMotion();
    setMode(m);
    const node = ref.current;
    if (!node || m === "none") { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setShown(true); io.disconnect(); } },
      { threshold: 0.18 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const cardStyle = (i: number): React.CSSProperties => {
    if (mode === "none") return {};
    if (mode === "lite")
      return { opacity: shown ? 1 : 0, transition: `opacity 400ms ease-out ${i * 60}ms` };
    return {
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 700ms var(--ease-soft) ${i * 130}ms, transform 800ms var(--ease-soft) ${i * 130}ms`,
      willChange: shown ? "auto" : "opacity, transform",
    };
  };

  const glass = mode === "full" ? "backdrop-blur-xl" : "";

  return (
    <section ref={ref} data-nav-tone="dark" className="relative overflow-hidden bg-sao-navy py-24 text-primary-foreground" aria-labelledby="capacites-title">
      {mode === "full" && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 size-[28rem] rounded-full opacity-40 blur-3xl" style={{ background: "color-mix(in oklch, var(--sao-gold) 28%, transparent)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 size-[24rem] rounded-full opacity-30 blur-3xl" style={{ background: "color-mix(in oklch, var(--sao-red) 22%, transparent)" }} />
        </>
      )}

      <div className="sao-container relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
          <span className="size-1.5 rounded-full bg-sao-gold" aria-hidden="true" />
          Une seule plateforme
        </span>
        <h2 id="capacites-title" className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          Tout ce qui relie <span className="text-sao-gold">l'Afrique</span> au reste du monde.
        </h2>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, desc, to, cta, hint, links }, i) => (
            <li key={title} className={`group relative flex flex-col overflow-hidden rounded-3xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-8 transition-[border-color,transform] duration-300 hover:border-sao-gold/50 motion-safe:hover:-translate-y-1 ${glass}`} style={cardStyle(i)}>
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-sao-gold transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
              <div className="flex items-start justify-between">
                <span className="inline-flex w-fit rounded-2xl border border-sao-gold/40 bg-sao-gold/15 p-3 text-sao-gold">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="font-display text-4xl font-bold text-primary-foreground/15" aria-hidden="true">0{i + 1}</span>
              </div>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">{hint}</p>
              <h3 className="mt-1 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-primary-foreground/75">{desc}</p>
              {links.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Services ${title}`}>
                  {links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1.5 text-xs font-medium text-primary-foreground/85 transition-colors hover:border-sao-gold/60 hover:text-sao-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sao-gold">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to={to}
                aria-label={`${cta} — ${title}`}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy transition-[filter] duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sao-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sao-navy"
              >
                {cta}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

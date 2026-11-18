import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, Send, Users } from "lucide-react";
import { Navbar } from "@/components/sao/Navbar";
import { Footer } from "@/components/sao/Footer";
import { DESTINATIONS, ZONE_IMAGE } from "@/lib/destinations";
import hero from "@/assets/hero-airport.jpg";

export const Route = createFileRoute("/decouvrir")({
  head: () => ({
    meta: [
      { title: "Découvrir le monde avec SAO | SAO Global Travel" },
      { name: "description", content: "Une entrée cinématique vers les destinations SAO : Afrique, Europe, Moyen-Orient et Asie, au départ de N'Djamena." },
      { property: "og:title", content: "Découvrir le monde avec SAO Global Travel" },
      { property: "og:description", content: "Choisissez une destination SAO, vos dates et vos voyageurs, puis réservez." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Decouvrir,
});

const SLIDES = [
  { img: hero, words: ["LE MONDE", "COMMENCE ICI"], cap: "Départ N'Djamena", text: "Vols, bagages et séjours organisés par SAO depuis l'aéroport Hassan Djamous." },
  { img: ZONE_IMAGE.Afrique, words: ["EXPLOREZ", "L'AFRIQUE"], cap: "Afrique", text: "Les grandes capitales du continent, reliées par nos partenaires aériens." },
  { img: ZONE_IMAGE.Europe, words: ["CAP SUR", "L'EUROPE"], cap: "Europe", text: "Paris, Bruxelles, Istanbul et d'autres villes desservies sur demande." },
  { img: ZONE_IMAGE["Moyen-Orient"], words: ["HORIZON", "MOYEN-ORIENT"], cap: "Moyen-Orient", text: "Dubaï, Djeddah, Le Caire : voyages d'affaires, pèlerinages et découvertes." },
];
const WIPE_MS = 1250, AUTO_MS = 5200;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Decouvrir() {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [reduced, setReduced] = useState(false);
  const incRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const on = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  function go(next: number) {
    if (busy.current || next === active) return;
    if (reduced) { setActive(next); return; }
    busy.current = true;
    setIncoming(next);
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / WIPE_MS), p = ease(t);
      const edge = p * 135;
      const mask = `linear-gradient(to left, #000 ${edge - 35}%, rgba(0,0,0,.6) ${edge - 17}%, transparent ${edge}%)`;
      if (incRef.current) { incRef.current.style.maskImage = mask; incRef.current.style.webkitMaskImage = mask; }
      if (mistRef.current) { mistRef.current.style.opacity = String(Math.sin(Math.PI * t) * 0.9); mistRef.current.style.right = `${edge - 17}%`; }
      if (t < 1) requestAnimationFrame(step);
      else { setActive(next); setIncoming(null); busy.current = false; }
    };
    requestAnimationFrame(step);
  }

  useEffect(() => {
    const id = window.setTimeout(() => go((active + 1) % SLIDES.length), AUTO_MS);
    return () => window.clearTimeout(id);
  });

  const s = SLIDES[active]!;
  return (
    <div className="min-h-svh overflow-x-hidden bg-sao-ivory">
      <Navbar />
      <section className="relative h-svh min-h-[640px] overflow-hidden bg-sao-navy" aria-label="Destinations SAO">
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.42}px)` }}>
          <Slide i={active} />
          {incoming !== null && <div ref={incRef} className="absolute inset-0" style={{ maskImage: "linear-gradient(to left, transparent 0%, transparent 100%)" }}><Slide i={incoming} /></div>}
        </div>
        <div ref={mistRef} aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[34vw] opacity-0 blur-[10px]"
          style={{ background: "radial-gradient(ellipse at center, color-mix(in oklab, var(--sao-ivory) 75%, transparent), transparent 70%)" }} />
        {/* Brume basse : dégradés seulement, aucun bord rectangulaire */}
        <div aria-hidden="true" className="sao-mist pointer-events-none absolute inset-x-[-4%] bottom-[-6%] h-[60%]" style={{ transform: `translateY(${-scrollY * 0.38}px) scale(${1 + scrollY / 2500})` }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]" style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--sao-ivory) 45%, transparent) 45%, color-mix(in oklab, var(--sao-ivory) 92%, transparent) 82%, var(--sao-ivory))" }} />

        {/* Colonne de vignettes */}
        <div className="absolute right-[4vw] top-[calc(74px+8vh)] z-10 flex flex-col items-center gap-3" style={{ transform: `translateY(${scrollY * 0.2}px)`, opacity: Math.max(0, 1 - scrollY / 400) }}>
          {SLIDES.map((sl, i) => {
            const on = (incoming ?? active) === i;
            return (
              <button key={i} type="button" onClick={() => go(i)} aria-label={sl.cap} aria-pressed={on}
                className="relative overflow-hidden rounded-full border-[3px] border-sao-ivory/90 shadow-lg transition-all duration-700 hover:scale-105"
                style={{ width: on ? "clamp(80px,9vw,150px)" : "clamp(44px,4.5vw,76px)", height: on ? "clamp(80px,9vw,150px)" : "clamp(44px,4.5vw,76px)", outline: on ? "1.5px solid var(--sao-gold)" : "none", outlineOffset: 8 }}>
                <img src={sl.img} alt="" className="size-full object-cover" />
              </button>
            );
          })}
        </div>
        <div key={active} className="sao-cap-in absolute right-[calc(4vw+clamp(110px,12vw,190px))] top-[calc(74px+12vh)] z-10 hidden max-w-[260px] border-l-[3px] border-sao-gold pl-4 text-right text-primary-foreground sm:block">
          <p className="font-display text-[clamp(24px,2.6vw,38px)] font-light">{s.cap}</p>
          <p className="mt-1 text-sm opacity-90">{s.text}</p>
        </div>

        <SearchBar />
      </section>

      <section className="relative z-20 -mt-[10vh] px-[clamp(20px,9.5vw,170px)] pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(26px,2.45vw,36px)] text-sao-navy">Destinations recommandées</h2>
          <Link to="/destinations" className="rounded-full border border-sao-navy px-4 py-1.5 text-sm font-semibold text-sao-navy transition hover:bg-sao-navy hover:text-primary-foreground">Tout voir</Link>
        </div>
        <div className="grid grid-cols-2 gap-[clamp(14px,2.2vw,30px)] lg:grid-cols-4">
          {DESTINATIONS.slice(0, 8).map((d) => (
            <Link key={d.iata} to="/reservation" className="group relative aspect-[203/268] overflow-hidden rounded-xl shadow-lg transition duration-500 hover:-translate-y-1.5">
              <img src={d.image} alt={`${d.city}, ${d.country}`} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-sao-navy/85 via-sao-navy/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-md bg-sao-ivory/85 px-2 py-1 text-[11.5px] font-semibold text-sao-navy backdrop-blur">Tarif sur demande</span>
              <span className="absolute right-3 top-3 rounded-md bg-sao-gold px-2 py-1 text-[11.5px] font-bold text-sao-navy">{d.iata}</span>
              <div className="absolute inset-x-3 bottom-3 text-primary-foreground">
                <p className="text-[15.5px] font-semibold">{d.city}</p>
                <p className="flex items-center gap-1 text-xs opacity-85"><MapPin className="size-3" aria-hidden="true" />{d.airport}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Slide({ i }: { i: number }) {
  const s = SLIDES[i]!;
  return (
    <div className="absolute inset-0">
      <img src={s.img} alt="" className="absolute inset-[-3%] size-[106%] scale-[1.04] object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--sao-navy) 55%, transparent), color-mix(in oklab, var(--sao-navy) 10%, transparent) 26%, transparent 46%)" }} />
      <h1 className="sao-giant absolute left-[3vw] top-[calc(74px+4vh)] max-w-[80vw] font-display text-[clamp(44px,8.6vw,150px)] font-bold uppercase leading-[0.92]">
        {s.words.map((w) => <span key={w} className="block">{w}</span>)}
      </h1>
    </div>
  );
}

const fmtDay = (d: Date | null) => (d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "Ajouter");

function SearchBar() {
  const nav = useNavigate();
  const [dest, setDest] = useState("");
  const [open, setOpen] = useState<"cal" | "guests" | null>(null);
  const [inD, setIn] = useState<Date | null>(null);
  const [outD, setOut] = useState<Date | null>(null);
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  function pick(d: Date) {
    if (!inD || outD || d <= inD) { setIn(d); setOut(null); }
    else { setOut(d); setOpen("guests"); }
  }
  const field = "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-background hover:shadow-md";
  return (
    <div ref={box} className="absolute bottom-[16vh] left-1/2 z-20 w-[min(900px,calc(100%-40px))] -translate-x-1/2 sm:bottom-[20vh]">
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/reservation" }); }}
        className="grid grid-cols-2 gap-1 rounded-3xl bg-background/95 p-2 shadow-2xl sm:flex sm:items-center">
        <label className={`${field} col-span-2 sm:flex-[1.35]`}>
          <MapPin className="size-4 shrink-0 text-sao-navy" aria-hidden="true" />
          <span className="min-w-0"><span className="block text-base font-semibold text-sao-navy">Destination</span>
            <select value={dest} onChange={(e) => setDest(e.target.value)} className="w-full bg-transparent text-xs text-muted-foreground outline-none" aria-label="Destination">
              <option value="">Choisir la destination</option>
              {DESTINATIONS.map((d) => <option key={d.iata} value={d.iata}>{d.city} ({d.iata})</option>)}
            </select></span>
        </label>
        {(["Départ", "Retour"] as const).map((l, k) => (
          <button key={l} type="button" className={field} onClick={() => setOpen(open === "cal" ? null : "cal")}>
            <CalendarDays className="size-4 shrink-0 text-sao-navy" aria-hidden="true" />
            <span><span className="block text-base font-semibold text-sao-navy">{l}</span><span className="text-xs text-muted-foreground">{fmtDay(k ? outD : inD)}</span></span>
          </button>
        ))}
        <button type="button" className={field} onClick={() => setOpen(open === "guests" ? null : "guests")}>
          <Users className="size-4 shrink-0 text-sao-navy" aria-hidden="true" />
          <span><span className="block text-base font-semibold text-sao-navy">Voyageurs</span><span className="text-xs text-muted-foreground">{adults + kids} voyageur{adults + kids > 1 ? "s" : ""}</span></span>
        </button>
        <button type="submit" aria-label="Réserver" className="col-span-2 grid h-10 place-items-center rounded-xl bg-sao-navy text-sao-gold transition hover:-rotate-6 hover:scale-110 sm:w-10">
          <Send className="size-4" aria-hidden="true" />
        </button>
      </form>
      {open === "cal" && (
        <div className="absolute bottom-full mb-3 rounded-2xl bg-background p-4 shadow-2xl sm:left-1/4">
          <div className="mb-2 flex items-center justify-between font-semibold text-sao-navy">
            <button type="button" aria-label="Mois précédent" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
            <span className="capitalize">{month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
            <button type="button" aria-label="Mois suivant" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <span key={i} className="py-1 text-muted-foreground">{d}</span>)}
            {Array.from({ length: first }, (_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
              const end = (inD && +d === +inD) || (outD && +d === +outD);
              const mid = inD && outD && d > inD && d < outD;
              return <button key={i} type="button" disabled={d < today} onClick={() => pick(d)}
                className={`size-[34px] rounded-lg disabled:opacity-30 ${end ? "bg-sao-navy text-sao-gold" : mid ? "bg-sao-gold-soft" : "hover:bg-muted"}`}>{i + 1}</button>;
            })}
          </div>
        </div>
      )}
      {open === "guests" && (
        <div className="absolute bottom-full right-0 mb-3 w-64 space-y-3 rounded-2xl bg-background p-4 shadow-2xl">
          {([["Adultes (12 ans et +)", adults, setAdults, 1], ["Enfants (2–11 ans)", kids, setKids, 0]] as const).map(([l, v, set, min]) => (
            <div key={l} className="flex items-center justify-between text-sm text-sao-navy">
              <span>{l}</span>
              <span className="flex items-center gap-2">
                <button type="button" aria-label={`Moins ${l}`} className="size-7 rounded-full border" onClick={() => set(Math.max(min, v - 1))}>−</button>
                <span className="w-4 text-center">{v}</span>
                <button type="button" aria-label={`Plus ${l}`} className="size-7 rounded-full border" onClick={() => set(v + 1)}>+</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

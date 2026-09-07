import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Info } from "lucide-react";
import { Navbar } from "@/components/sao/Navbar";
import { Footer } from "@/components/sao/Footer";
import { ScrollProgress } from "@/components/sao/ScrollProgress";
import { GoldCursor } from "@/components/sao/GoldCursor";
import { Reveal } from "@/components/sao/Reveal";

type Props = {
  kicker: string;
  title: string;
  intro: string;
  image?: string;
  imageAlt?: string;
  children: ReactNode;
};

/** Enveloppe commune à toutes les pages internes : nav, hero de page, contenu, footer. */
export function PageShell({ kicker, title, intro, image, imageAlt, children }: Props) {
  return (
    <div className="min-h-svh bg-background">
      <ScrollProgress />
      <Navbar solid />
      <GoldCursor />

      <main>
        <section className="relative overflow-hidden bg-sao-navy">
          {image && (
            <img
              src={image}
              alt={imageAlt ?? ""}
              className="absolute inset-0 size-full object-cover opacity-45"
              loading="eager"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, oklch(0.221 0.052 262.5 / 0.92) 25%, oklch(0.221 0.052 262.5 / 0.55) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="sao-container relative py-16 md:py-24">
            <nav aria-label="Fil d'Ariane" className="flex items-center gap-1 text-xs text-primary-foreground/70">
              <Link to="/" className="hover:text-sao-gold">Accueil</Link>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <span className="text-sao-gold">{title}</span>
            </nav>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-sao-gold">{kicker}</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[0.95] tracking-tighter text-primary-foreground md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-primary-foreground/85 md:text-lg">{intro}</p>
          </div>
        </section>

        {children}
      </main>

      <Footer />
    </div>
  );
}

export function Section({
  title,
  lead,
  children,
  tone = "light",
  id,
}: {
  title?: string;
  lead?: string;
  children: ReactNode;
  tone?: "light" | "ivory";
  id?: string;
}) {
  return (
    <section id={id} className={tone === "ivory" ? "bg-sao-ivory py-16" : "py-16"}>
      <div className="sao-container">
        {title && (
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight text-sao-navy md:text-3xl">{title}</h2>
            {lead && <p className="mt-3 max-w-2xl text-muted-foreground">{lead}</p>}
          </Reveal>
        )}
        <div className={title ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}

/** Mention explicite quand une information n'est pas encore reliée à une source réelle. */
export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 flex items-start gap-2 rounded-2xl border border-sao-gold/40 bg-sao-gold/10 p-4 text-sm text-sao-navy">
      <Info className="mt-0.5 size-4 shrink-0 text-sao-gold" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function CtaBand({
  title,
  text,
  to = "/contact",
  label = "Parler à un conseiller",
}: {
  title: string;
  text: string;
  to?: string;
  label?: string;
}) {
  return (
    <section className="bg-sao-navy py-16">
      <div className="sao-container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-tighter text-primary-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-primary-foreground/80">{text}</p>
        </div>
        <Link
          to={to as "/"}
          className="inline-flex shrink-0 items-center rounded-full bg-sao-gold px-6 py-3.5 text-sm font-semibold text-sao-navy transition-[filter] hover:brightness-105"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}

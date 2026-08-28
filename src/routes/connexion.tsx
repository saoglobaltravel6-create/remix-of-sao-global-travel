import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-airport.jpg";
import logo from "@/assets/sao-logo.png.asset.json";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Espace client — SAO Global Travel" },
      {
        name: "description",
        content:
          "Connectez-vous à votre espace client SAO Global Travel pour suivre vos envois, réservations, SAO Money et SAO Rewards.",
      },
      { property: "og:title", content: "Espace client — SAO Global Travel" },
      {
        property: "og:description",
        content: "Suivez vos envois, réservations et transferts depuis votre espace client SAO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Connexion,
});

const step = (delay: number) => ({
  animation: `fadeInSoft .62s var(--ease-spring) both`,
  animationDelay: `${delay}ms`,
});

function Connexion() {
  return (
    <div className="min-h-svh bg-sao-ivory lg:grid lg:grid-cols-[57%_43%]">
      <section className="relative h-[38svh] overflow-hidden lg:h-svh">
        <img
          src={heroImg}
          alt="Avion au décollage au coucher du soleil"
          width={1920}
          height={1088}
          className="size-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--scrim-hero)" }} aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
          <span
            className="inline-flex rounded-2xl bg-background p-2"
            style={step(120)}
          >
            <img src={logo.url} alt="SAO Global Travel" width={160} height={106} className="h-10 w-auto" />
          </span>
          <h2 className="mt-5 font-display text-4xl leading-none tracking-tighter text-primary-foreground lg:text-6xl">
            <span className="block" style={step(240)}>
              Votre voyage,
            </span>
            <span className="block text-sao-gold" style={step(330)}>
              simplifié.
            </span>
          </h2>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 lg:py-0">
        <div
          className="-mt-10 w-full max-w-[440px] rounded-[28px] bg-card p-7 shadow-[var(--shadow-float)] lg:mt-0 lg:rounded-3xl lg:p-10"
          style={step(40)}
        >
          <h1
            className="text-[34px] font-bold leading-none tracking-tighter text-sao-navy lg:text-[42px]"
            style={step(470)}
          >
            Bon retour !
          </h1>
          <p className="mt-3 text-base text-muted-foreground" style={step(570)}>
            Connectez-vous pour suivre vos envois et réservations.
          </p>

          <div className="mt-8 space-y-4">
            <label className="block" style={step(720)}>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
              <input
                type="email"
                placeholder="Ex. prenom.nom@email.com"
                className="h-12 w-full rounded-xl border border-input bg-secondary/60 px-4 text-base text-sao-navy outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block" style={step(790)}>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Mot de passe
              </span>
              <input
                type="password"
                placeholder="Mot de passe"
                className="h-12 w-full rounded-xl border border-input bg-secondary/60 px-4 text-base text-sao-navy outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-125"
            style={{ background: "var(--gradient-navy)", ...step(930) }}
          >
            Se connecter <ArrowRight className="size-4" aria-hidden="true" />
          </button>

          <div className="my-6 flex items-center gap-3" style={step(1060)}>
            <span className="h-px flex-1 bg-sao-gold/40" aria-hidden="true" />
            <span className="text-xs font-semibold text-muted-foreground">OU</span>
            <span className="h-px flex-1 bg-sao-gold/40" aria-hidden="true" />
          </div>

          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-sao-navy transition-colors hover:bg-secondary"
            style={step(1150)}
          >
            Continuer avec Google
          </button>

          <p className="mt-7 text-center text-sm text-muted-foreground" style={step(1260)}>
            Pas encore de compte ?{" "}
            <span className="font-semibold text-sao-navy underline decoration-sao-gold underline-offset-4">
              Créer un compte
            </span>
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground" style={step(1260)}>
            <Link to="/" className="underline underline-offset-4">
              Retour à l'accueil
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

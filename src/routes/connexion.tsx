import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import heroImg from "@/assets/hero-airport.jpg";
import travelLogo from "@/assets/sao-global-travel-official.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion et inscription — Espace client | SAO Global Travel" },
      {
        name: "description",
        content:
          "Créez votre compte SAO Global Travel ou connectez-vous pour suivre vos demandes de vols, colis, cargo, séjours et vos opérations SAO Money.",
      },
      { property: "og:title", content: "Espace client — SAO Global Travel" },
      {
        property: "og:description",
        content: "Suivez vos demandes, vos envois et vos opérations depuis votre espace client SAO.",
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

const inputCls =
  "h-12 w-full rounded-xl border border-input bg-secondary/60 px-4 text-base text-sao-navy outline-none focus:ring-2 focus:ring-ring";

function Connexion() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/espace-client", replace: true });
  }, [loading, user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    if (mode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/espace-client",
          data: { full_name: fullName, phone },
        },
      });
      if (err) setError(err.message);
      else if (!data.session)
        setNotice("Compte créé. Ouvrez l'e-mail de confirmation pour activer votre accès.");
    }
    setBusy(false);
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError("Connexion Google indisponible pour le moment.");
  }

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
          <span className="inline-flex rounded-2xl bg-background p-2" style={step(120)}>
            <img
              src={travelLogo.url}
              alt="SAO Global Travel"
              width={1087}
              height={585}
              className="h-10 w-auto object-contain"
            />
          </span>
          <h2 className="mt-5 font-display text-4xl leading-none tracking-tighter text-primary-foreground lg:text-6xl">
            <span className="block" style={step(240)}>Votre voyage,</span>
            <span className="block text-sao-gold" style={step(330)}>simplifié.</span>
          </h2>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 lg:py-0">
        <div
          className="-mt-10 w-full max-w-[440px] rounded-[28px] bg-card p-7 shadow-[var(--shadow-float)] lg:mt-0 lg:rounded-3xl lg:p-10"
          style={step(40)}
        >
          <div className="flex gap-1 rounded-full bg-secondary p-1" role="tablist">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => { setMode(m); setError(null); setNotice(null); }}
                className={`h-10 flex-1 rounded-full text-sm font-semibold transition-colors ${
                  mode === m ? "bg-sao-navy text-primary-foreground" : "text-sao-navy"
                }`}
              >
                {m === "login" ? "Connexion" : "Créer un compte"}
              </button>
            ))}
          </div>

          <h1 className="mt-7 text-[32px] font-bold leading-none tracking-tighter text-sao-navy">
            {mode === "login" ? "Bon retour !" : "Bienvenue chez SAO"}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {mode === "login"
              ? "Connectez-vous pour suivre vos demandes et vos envois."
              : "Créez votre espace pour envoyer vos demandes et les suivre."}
          </p>

          <form className="mt-7 space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Nom complet</span>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Téléphone</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+235 …" />
                </label>
              </>
            )}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex. prenom.nom@email.com"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Mot de passe</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-sao-navy">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-125 disabled:opacity-60"
              style={{ background: "var(--gradient-navy)" }}
            >
              {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-sao-gold/40" aria-hidden="true" />
            <span className="text-xs font-semibold text-muted-foreground">OU</span>
            <span className="h-px flex-1 bg-sao-gold/40" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={google}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-sao-navy transition-colors hover:bg-secondary"
          >
            Continuer avec Google
          </button>

          <p className="mt-7 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4">Retour à l'accueil</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

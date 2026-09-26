import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2, LogIn } from "lucide-react";
import { PageShell, Section, DemoNote } from "@/components/sao/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DESTINATIONS } from "@/lib/destinations";
import heroImg from "@/assets/hero-airport.jpg";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Réserver un voyage — Destination, date, classe | SAO Global Travel" },
      { name: "description", content: "Préparez votre réservation de vol en quatre étapes : destination, date, classe et mode de paiement. Un conseiller confirme ensuite tarif et disponibilité." },
      { property: "og:title", content: "Réserver un voyage — SAO Global Travel" },
      { property: "og:description", content: "Réservation guidée en quatre étapes, suivie dans votre espace client." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReservationPage,
});

const STEPS = ["Destination", "Date", "Classe", "Paiement", "Confirmation"];
const CLASSES = ["Économique", "Premium économique", "Affaires", "Première"];
const PAYMENTS = ["En agence (N'Djamena ou Dakar)", "Mobile money", "Virement bancaire"];

function ReservationPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [v, setV] = useState({ depart: "N'Djamena (NDJ)", destination: "", aller: "", retour: "", passagers: "1", classe: CLASSES[0]!, paiement: PAYMENTS[0]! });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));

  const canNext = [v.destination, v.aller && Number(v.passagers) > 0, v.classe, v.paiement][step];
  const input = "h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-sao-navy outline-none focus:ring-2 focus:ring-ring";

  async function submit() {
    if (!user) return;
    setSending(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("service_requests")
      .insert({ user_id: user.id, service: "vols", details: { ...v, origine: "reservation", history: [{ status: "recue", at: new Date().toISOString() }] } })
      .select("reference")
      .single();
    setSending(false);
    if (err) return setError(err.message);
    setRef(data.reference);
    setStep(4);
  }

  return (
    <PageShell kicker="Voyager" title="Réserver un voyage" intro="Quatre étapes pour préparer votre vol. Un conseiller vérifie ensuite tarif et disponibilité auprès des compagnies." image={heroImg} imageAlt="Avion au départ">
      <Section title="Votre réservation">
        <ol className="mb-6 flex flex-wrap gap-2" aria-label="Étapes">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${i === step ? "bg-sao-navy text-primary-foreground" : i < step ? "bg-sao-gold/30 text-sao-navy" : "bg-secondary text-muted-foreground"}`}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        {loading ? (
          <div className="sao-card p-6 text-sm text-muted-foreground">Chargement…</div>
        ) : !user ? (
          <div className="sao-card p-6">
            <p className="text-sm text-muted-foreground">Connectez-vous pour enregistrer votre réservation dans votre espace client.</p>
            <Link to="/connexion" className="mt-4 inline-flex items-center gap-2 rounded-full bg-sao-navy px-5 py-3 text-sm font-semibold text-primary-foreground">
              <LogIn className="size-4" aria-hidden="true" /> Se connecter / créer un compte
            </Link>
          </div>
        ) : step === 4 ? (
          <div className="sao-card p-6">
            <Check className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Demande de réservation enregistrée</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Référence <strong>{ref}</strong> — {v.depart} → {v.destination}, le {v.aller}, {v.passagers} passager(s), classe {v.classe}, paiement : {v.paiement}.
              Le billet n'est pas encore émis : un conseiller vous contacte avec le tarif réel avant tout paiement.
            </p>
            <Link to="/espace-client" className="mt-4 inline-flex rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy">Suivre dans mon espace client</Link>
          </div>
        ) : (
          <div className="sao-card p-6">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-medium text-muted-foreground">Départ
                  <select className={`${input} mt-1.5`} value={v.depart} onChange={set("depart")}>
                    <option>N'Djamena (NDJ)</option><option>Dakar (DSS)</option>
                  </select>
                </label>
                <label className="block text-xs font-medium text-muted-foreground">Destination
                  <select className={`${input} mt-1.5`} value={v.destination} onChange={set("destination")}>
                    <option value="">Choisir…</option>
                    {DESTINATIONS.map((d) => <option key={d.iata} value={`${d.city} (${d.iata})`}>{d.city} ({d.iata})</option>)}
                  </select>
                </label>
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-xs font-medium text-muted-foreground">Aller<input type="date" className={`${input} mt-1.5`} value={v.aller} onChange={set("aller")} /></label>
                <label className="block text-xs font-medium text-muted-foreground">Retour (facultatif)<input type="date" className={`${input} mt-1.5`} value={v.retour} onChange={set("retour")} /></label>
                <label className="block text-xs font-medium text-muted-foreground">Passagers<input type="number" min={1} className={`${input} mt-1.5`} value={v.passagers} onChange={set("passagers")} /></label>
              </div>
            )}
            {step === 2 && (
              <fieldset className="grid gap-3 sm:grid-cols-2"><legend className="sr-only">Classe</legend>
                {CLASSES.map((c) => (
                  <label key={c} className={`cursor-pointer rounded-xl border p-4 text-sm font-semibold text-sao-navy ${v.classe === c ? "border-sao-gold bg-sao-gold/10" : "border-border"}`}>
                    <input type="radio" name="classe" className="mr-2" checked={v.classe === c} onChange={() => setV((s) => ({ ...s, classe: c }))} />{c}
                  </label>
                ))}
              </fieldset>
            )}
            {step === 3 && (
              <fieldset className="grid gap-3"><legend className="sr-only">Paiement</legend>
                {PAYMENTS.map((p) => (
                  <label key={p} className={`cursor-pointer rounded-xl border p-4 text-sm font-semibold text-sao-navy ${v.paiement === p ? "border-sao-gold bg-sao-gold/10" : "border-border"}`}>
                    <input type="radio" name="paiement" className="mr-2" checked={v.paiement === p} onChange={() => setV((s) => ({ ...s, paiement: p }))} />{p}
                  </label>
                ))}
                <DemoNote>Le paiement en ligne n'est pas encore activé : vous réglez après confirmation du tarif par un conseiller.</DemoNote>
              </fieldset>
            )}
            {error && <p className="mt-4 text-sm text-destructive">Envoi impossible : {error}</p>}
            <div className="mt-6 flex gap-3">
              {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-sao-navy">Retour</button>}
              {step < 3 ? (
                <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className="rounded-full bg-sao-navy px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">Continuer</button>
              ) : (
                <button type="button" disabled={sending} onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-sao-gold px-6 py-3 text-sm font-semibold text-sao-navy disabled:opacity-60">
                  {sending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}Confirmer ma demande
                </button>
              )}
            </div>
          </div>
        )}
      </Section>
    </PageShell>
  );
}

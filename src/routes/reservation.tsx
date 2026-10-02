import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2, LogIn } from "lucide-react";
import { PageShell, Section, DemoNote } from "@/components/sao/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DESTINATIONS } from "@/lib/destinations";
import { useServerFn } from "@tanstack/react-start";
import { parseBooking } from "@/lib/booking-assistant.functions";
import { quote, fcfa, FARE_SOURCE } from "@/lib/fares";
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
const PAYMENTS = ["SAO Money", "En agence (N'Djamena ou Dakar)", "Mobile money", "Virement bancaire"];

function ReservationPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [v, setV] = useState({ depart: "N'Djamena (NDJ)", destination: "", aller: "", retour: "", passagers: "1", nuits: "0", classe: CLASSES[0]!, paiement: PAYMENTS[0]! });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));

  const iata = v.destination.match(/\(([A-Z]{3})\)/)?.[1] ?? "";
  const q = iata ? quote(iata, v.classe, Number(v.passagers) || 1, Number(v.nuits) || 0) : null;
  const askAI = useServerFn(parseBooking);
  const [aiText, setAiText] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState<string | null>(null);
  async function runAI() {
    setAiBusy(true); setAiMsg(null);
    const r = await askAI({ data: { text: aiText, iatas: DESTINATIONS.map((d) => d.iata) } });
    setAiBusy(false);
    if (!r.ok) return setAiMsg(r.error);
    const f = r.fields; const d = DESTINATIONS.find((x) => x.iata === f.iata);
    setV((s) => ({ ...s,
      depart: f.depart === "DSS" ? "Dakar (DSS)" : "N'Djamena (NDJ)",
      destination: d ? `${d.city} (${d.iata})` : s.destination,
      aller: f.aller || s.aller, retour: f.retour || s.retour,
      passagers: String(f.passagers || s.passagers),
      classe: CLASSES.includes(f.classe ?? "") ? f.classe! : s.classe }));
    setAiMsg("Champs pré-remplis : vérifiez chaque étape.");
  }
  const canNext = [v.destination, v.aller && Number(v.passagers) > 0, v.classe, v.paiement][step];
  const input = "h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-sao-navy outline-none focus:ring-2 focus:ring-ring";

  async function submit() {
    if (!user) return;
    setSending(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("service_requests")
      .insert({ user_id: user.id, service: "vols", details: { ...v, tarif_vol: q?.vol ?? null, tarif_hotel: q?.hotel ?? null, total_fcfa: q?.total ?? null, origine: "reservation", history: [{ status: "recue", at: new Date().toISOString() }] } })
      .select("reference")
      .single();
    setSending(false);
    if (err) return setError(err.message);
    if (v.paiement === "SAO Money" && q) {
      await supabase.from("wallet_transactions").insert({ user_id: user.id, kind: "paiement_reservation", amount: q.total, currency: "XAF", beneficiary: `Réservation ${data.reference}`, status: "en_attente" });
    }
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
              Référence <strong>{ref}</strong> — {v.depart} → {v.destination}, le {v.aller}, {v.passagers} passager(s), classe {v.classe}, paiement : {v.paiement}{q ? ` — total estimé ${fcfa(q.total)}` : ""}.
              Le billet n'est pas encore émis : un conseiller vous contacte avec le tarif réel avant tout paiement.
            </p>
            <Link to="/espace-client" className="mt-4 inline-flex rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy">Suivre dans mon espace client</Link>
          </div>
        ) : (
          <div className="sao-card p-6">
            {step === 0 && (
              <div className="mb-5 rounded-xl bg-secondary/60 p-4">
                <p className="text-xs font-semibold text-sao-navy">Assistant réservation — décrivez votre voyage en une phrase</p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input className={input} value={aiText} onChange={(e) => setAiText(e.target.value)} placeholder="Ex : 2 personnes Dakar → Paris le 15 décembre, en affaires" />
                  <button type="button" disabled={aiBusy || aiText.trim().length < 3} onClick={runAI} className="inline-flex items-center justify-center gap-2 rounded-full bg-sao-navy px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{aiBusy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}Remplir</button>
                </div>
                {aiMsg && <p className="mt-2 text-xs text-muted-foreground">{aiMsg}</p>}
              </div>
            )}
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
              <div className="grid gap-4 sm:grid-cols-4">
                <label className="block text-xs font-medium text-muted-foreground">Aller<input type="date" className={`${input} mt-1.5`} value={v.aller} onChange={set("aller")} /></label>
                <label className="block text-xs font-medium text-muted-foreground">Retour (facultatif)<input type="date" className={`${input} mt-1.5`} value={v.retour} onChange={set("retour")} /></label>
                <label className="block text-xs font-medium text-muted-foreground">Nuits d'hôtel<input type="number" min={0} className={`${input} mt-1.5`} value={v.nuits} onChange={set("nuits")} /></label>
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
                <DemoNote>Avec SAO Money, un paiement « en attente » est créé dans votre portefeuille puis validé par l'équipe SAO. Aucune carte bancaire n'est débitée en ligne.</DemoNote>
              </fieldset>
            )}
            {q && step >= 1 && (
              <div className="mt-5 rounded-xl border border-sao-gold/50 bg-sao-gold/10 p-4 text-sm text-sao-navy">
                <p>Vol ({v.classe}, {v.passagers} pax) : <strong>{fcfa(q.vol)}</strong></p>
                {q.hotel > 0 && <p>Hôtel ({v.nuits} nuit·s) : <strong>{fcfa(q.hotel)}</strong></p>}
                <p className="mt-1 text-base font-bold">Total estimé : {fcfa(q.total)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{FARE_SOURCE} Frais de service SAO inclus.</p>
              </div>
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

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Loader2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Field = { name: string; label: string; type?: string; placeholder?: string; textarea?: boolean };

const FIELDS: Record<string, Field[]> = {
  vols: [
    { name: "depart", label: "Ville de départ", placeholder: "N'Djamena" },
    { name: "arrivee", label: "Ville d'arrivée", placeholder: "Paris" },
    { name: "date", label: "Date souhaitée", type: "date" },
    { name: "passagers", label: "Nombre de passagers", type: "number", placeholder: "1" },
    { name: "message", label: "Précisions", textarea: true, placeholder: "Bagages, classe, flexibilité…" },
  ],
  colis: [
    { name: "depart", label: "Ville de départ", placeholder: "N'Djamena" },
    { name: "arrivee", label: "Ville de destination", placeholder: "Dakar" },
    { name: "poids", label: "Poids estimé (kg)", type: "number", placeholder: "12" },
    { name: "contenu", label: "Contenu du colis", placeholder: "Vêtements, documents…" },
    { name: "message", label: "Précisions", textarea: true },
  ],
  cargo: [
    { name: "depart", label: "Origine", placeholder: "N'Djamena" },
    { name: "arrivee", label: "Destination", placeholder: "Dubaï" },
    { name: "volume", label: "Volume / poids", placeholder: "2 palettes, 800 kg" },
    { name: "nature", label: "Nature de la marchandise" },
    { name: "message", label: "Précisions", textarea: true },
  ],
  bus: [
    { name: "depart", label: "Départ", placeholder: "N'Djamena" },
    { name: "arrivee", label: "Arrivée", placeholder: "Moundou" },
    { name: "date", label: "Date souhaitée", type: "date" },
    { name: "passagers", label: "Nombre de places", type: "number" },
  ],
  sejours: [
    { name: "destination", label: "Destination souhaitée", placeholder: "Dubaï" },
    { name: "date", label: "Date de départ", type: "date" },
    { name: "duree", label: "Durée (nuits)", type: "number" },
    { name: "voyageurs", label: "Nombre de voyageurs", type: "number" },
    { name: "message", label: "Vos attentes", textarea: true },
  ],
  circuits: [
    { name: "destination", label: "Région à découvrir", placeholder: "Ennedi" },
    { name: "date", label: "Période souhaitée", type: "date" },
    { name: "duree", label: "Nombre de jours", type: "number" },
    { name: "participants", label: "Nombre de participants", type: "number" },
    { name: "message", label: "Vos envies", textarea: true },
  ],
  bagages: [
    { name: "vol", label: "Vol ou trajet concerné" },
    { name: "message", label: "Votre question bagages", textarea: true },
  ],
  "solutions-pro": [
    { name: "societe", label: "Société / organisation" },
    { name: "besoin", label: "Besoin principal", placeholder: "Fret régulier, missions, ONG…" },
    { name: "message", label: "Détail du besoin", textarea: true },
  ],
};

const LABELS: Record<string, string> = {
  vols: "un devis de vol",
  colis: "un envoi de colis",
  cargo: "un devis cargo",
  bus: "un trajet en bus",
  sejours: "un séjour",
  circuits: "un circuit",
  bagages: "une question bagages",
  "solutions-pro": "une solution professionnelle",
};

/** Formulaire de demande réelle, enregistré dans l'espace client de la personne connectée. */
export function ServiceRequestForm({ service, title }: { service: keyof typeof FIELDS | string; title?: string }) {
  const { user, loading } = useAuth();
  const fields = FIELDS[service] ?? FIELDS.colis!;
  const [values, setValues] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <div className="sao-card p-6 text-sm text-muted-foreground">Chargement…</div>;
  }

  if (!user) {
    return (
      <div className="sao-card p-6">
        <h3 className="font-bold text-sao-navy">Demander {LABELS[service] ?? "un devis"}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Connectez-vous ou créez votre compte : votre demande est enregistrée dans votre espace
          client et vous en suivez l'avancement.
        </p>
        <Link
          to="/connexion"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-sao-navy px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <LogIn className="size-4" aria-hidden="true" /> Se connecter / créer un compte
        </Link>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="sao-card p-6">
        <Check className="size-6 text-sao-gold" aria-hidden="true" />
        <h3 className="mt-3 font-bold text-sao-navy">Demande enregistrée</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Référence <strong>{reference}</strong>. Elle est enregistrée avec le statut « reçue ».
          Aucun tarif, disponibilité ni réservation n'est confirmé à ce stade : un conseiller revient
          vers vous après vérification.
        </p>
        <Link
          to="/espace-client"
          className="mt-4 inline-flex items-center rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy"
        >
          Voir dans mon espace client
        </Link>
      </div>
    );
  }

  return (
    <form
      className="sao-card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        setError(null);
        const { data, error: err } = await supabase
          .from("service_requests")
          .insert({ user_id: user.id, service, details: values })
          .select("reference")
          .single();
        if (err) {
          setError(err.message);
          setState("error");
          return;
        }
        setReference(data.reference);
        setState("done");
      }}
    >
      <h3 className="font-bold text-sao-navy">{title ?? `Demander ${LABELS[service] ?? "un devis"}`}</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className={f.textarea ? "sm:col-span-2 block" : "block"}>
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</span>
            {f.textarea ? (
              <textarea
                rows={4}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-sao-navy outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <input
                type={f.type ?? "text"}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className="h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-sao-navy outline-none focus:ring-2 focus:ring-ring"
              />
            )}
          </label>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-destructive">Envoi impossible : {error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-sao-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {state === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Envoyer ma demande
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        Votre demande n'est ni une réservation ni une confirmation : elle est vérifiée par un conseiller.
      </p>
    </form>
  );
}

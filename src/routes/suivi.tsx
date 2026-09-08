import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Radar, Search } from "lucide-react";
import { PageShell, Section, DemoNote, CtaBand } from "@/components/sao/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import asie from "@/assets/dest-asie.jpg";

export const Route = createFileRoute("/suivi")({
  head: () => ({
    meta: [
      { title: "Suivi d'envoi — Colis et cargo | SAO Global Travel" },
      {
        name: "description",
        content:
          "Suivez un colis ou un envoi cargo SAO Global Travel à partir de sa référence : statut, origine, destination et étapes enregistrées.",
      },
      { property: "og:title", content: "Suivi d'envoi — SAO Global Travel" },
      {
        property: "og:description",
        content: "Retrouvez l'état d'un envoi avec sa référence de suivi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuiviPage,
});

type Step = { date?: string; label?: string; lieu?: string };
type Shipment = {
  reference: string;
  status: string;
  origin: string | null;
  destination: string | null;
  updated_at: string;
  is_demo: boolean;
  history: Step[] | null;
};

const PROGRESS: Record<string, number> = {
  en_preparation: 15,
  collecte: 35,
  en_transit: 65,
  arrive: 85,
  livre: 100,
};

function SuiviPage() {
  const { user } = useAuth();
  const [ref, setRef] = useState("");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState<string | null>(null);
  const [result, setResult] = useState<Shipment | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const value = ref.trim().toUpperCase();
    setSearching(true);
    setResult(null);
    if (user) {
      const { data } = await supabase
        .from("shipments")
        .select("reference,status,origin,destination,updated_at,is_demo,history")
        .eq("user_id", user.id)
        .eq("reference", value)
        .maybeSingle();
      setResult((data as Shipment | null) ?? null);
    }
    setSearched(value);
    setSearching(false);
  }

  const progress = result ? (PROGRESS[result.status] ?? 10) : 0;

  return (
    <PageShell
      kicker="Expédier"
      title="Suivi"
      intro="Chaque envoi SAO reçoit une référence unique. Saisissez-la pour afficher son état enregistré."
      image={asie}
      imageAlt="Centre logistique"
    >
      <Section title="Rechercher un envoi">
        <form className="sao-card flex flex-col gap-3 p-6 sm:flex-row" onSubmit={search}>
          <label className="sr-only" htmlFor="ref">Référence de suivi</label>
          <input
            id="ref"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            required
            placeholder="Référence de suivi (ex. SAO-XXXXXXXX)"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={searching}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-sao-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Search className="size-4" aria-hidden="true" /> Rechercher
          </button>
        </form>

        {!user && (
          <p className="mt-4 text-sm text-muted-foreground">
            Le suivi est rattaché à votre compte.{" "}
            <Link to="/connexion" className="font-semibold text-sao-navy underline underline-offset-4">
              Connectez-vous
            </Link>{" "}
            pour retrouver vos envois.
          </p>
        )}

        {searched && !searching && !result && (
          <div className="sao-card mt-6 p-6">
            <Radar className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Aucun envoi pour la référence {searched}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Aucun envoi enregistré ne correspond à cette référence sur votre compte. Nous
              n'affichons pas d'étape tant qu'aucune donnée réelle n'existe : transmettez-nous la
              référence et un conseiller vérifie le point d'étape.
            </p>
            <a
              href={`mailto:contact@saoglobaltravel.com?subject=${encodeURIComponent(`Suivi envoi ${searched}`)}`}
              className="mt-4 inline-flex items-center rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy"
            >
              Demander le point d'étape
            </a>
          </div>
        )}

        {result && (
          <article className="sao-card mt-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-sao-navy">Réf. {result.reference}</h3>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-sao-navy">
                {result.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.origin ?? "—"} → {result.destination ?? "—"} · dernière mise à jour{" "}
              {new Date(result.updated_at).toLocaleString("fr-FR")}
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-secondary" aria-hidden="true">
              <div className="h-full rounded-full bg-sao-gold" style={{ width: `${progress}%` }} />
            </div>
            {result.history && result.history.length > 0 ? (
              <ol className="mt-6 space-y-4 border-l border-sao-gold/40 pl-5">
                {result.history.map((s, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-sao-gold" aria-hidden="true" />
                    <p className="text-sm font-semibold text-sao-navy">{s.label ?? "Étape"}</p>
                    <p className="text-xs text-muted-foreground">
                      {[s.lieu, s.date].filter(Boolean).join(" · ")}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Aucune étape détaillée n'a encore été enregistrée pour cet envoi.
              </p>
            )}
            {result.is_demo && (
              <p className="mt-4 rounded-xl bg-sao-gold/10 p-3 text-xs font-semibold text-sao-navy">
                Envoi en mode démonstration : les étapes affichées ne proviennent pas encore du
                système d'expédition réel.
              </p>
            )}
          </article>
        )}

        <DemoNote>
          Le suivi affiche uniquement les envois réellement enregistrés sur votre compte. Aucun colis
          ni statut n'est inventé pour remplir l'écran.
        </DemoNote>
      </Section>

      <CtaBand
        title="Un envoi à préparer ?"
        text="Découvrez les conditions d'emballage, de déclaration et de dépôt de vos colis."
        to="/colis"
        label="Voir la page Colis"
      />
    </PageShell>
  );
}

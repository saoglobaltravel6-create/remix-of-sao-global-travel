import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radar, Search } from "lucide-react";
import { PageShell, Section, DemoNote, CtaBand } from "@/components/sao/PageShell";
import asie from "@/assets/dest-asie.jpg";

export const Route = createFileRoute("/suivi")({
  head: () => ({
    meta: [
      { title: "Suivi d'envoi — Colis et cargo | SAO Global Travel" },
      {
        name: "description",
        content:
          "Suivez un colis ou un envoi cargo SAO Global Travel à partir de sa référence, ou demandez le point d'étape à un conseiller.",
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

function SuiviPage() {
  const [ref, setRef] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <PageShell
      kicker="Expédier"
      title="Suivi"
      intro="Chaque envoi SAO reçoit une référence unique. Saisissez-la pour demander son point d'étape."
      image={asie}
      imageAlt="Centre logistique"
    >
      <Section title="Rechercher un envoi">
        <form
          className="sao-card flex flex-col gap-3 p-6 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(ref.trim());
          }}
        >
          <label className="sr-only" htmlFor="ref">Référence de suivi</label>
          <input
            id="ref"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            required
            placeholder="Référence de suivi (ex. SAO-XXXXXX)"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-sao-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            <Search className="size-4" aria-hidden="true" /> Rechercher
          </button>
        </form>

        {submitted && (
          <div className="sao-card mt-6 p-6">
            <Radar className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Référence {submitted}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Le suivi en ligne n'est pas encore relié au système d'expédition. Envoyez-nous cette
              référence et un conseiller vous communique le point d'étape réel de votre envoi.
            </p>
            <a
              href={`mailto:contact@saoglobaltravel.com?subject=${encodeURIComponent(`Suivi envoi ${submitted}`)}`}
              className="mt-4 inline-flex items-center rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy"
            >
              Demander le point d'étape
            </a>
          </div>
        )}

        <DemoNote>
          Aucun statut d'envoi n'est affiché automatiquement : nous préférons ne rien annoncer plutôt
          que d'afficher une information non vérifiée.
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

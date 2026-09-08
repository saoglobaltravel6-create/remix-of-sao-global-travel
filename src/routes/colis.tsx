import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, PackageCheck, ShieldCheck } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { ServiceRequestForm } from "@/components/sao/ServiceRequestForm";
import afrique from "@/assets/dest-afrique.jpg";

export const Route = createFileRoute("/colis")({
  head: () => ({
    meta: [
      { title: "Colis — Envoyez à vos proches | SAO Global Travel" },
      {
        name: "description",
        content:
          "Préparer, déclarer, expédier, suivre, recevoir : l'envoi de colis simplifié entre le Tchad, le Sénégal et le monde.",
      },
      { property: "og:title", content: "Colis — SAO Global Travel" },
      {
        property: "og:description",
        content: "Un parcours d'envoi clair, du dépôt du colis à la remise au destinataire.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ColisPage,
});

const ETAPES = [
  { t: "Préparer", d: "Emballez solidement, listez le contenu et pesez le colis." },
  { t: "Déclarer", d: "Déclarez le contenu et la valeur : c'est obligatoire en douane." },
  { t: "Expédier", d: "Déposez en agence ou demandez un enlèvement." },
  { t: "Suivre", d: "Chaque envoi reçoit une référence de suivi." },
  { t: "Recevoir", d: "Le destinataire retire le colis avec une pièce d'identité." },
];

const RESTRICTIONS = [
  "Espèces, bijoux et objets de très grande valeur",
  "Produits inflammables, corrosifs ou sous pression",
  "Denrées périssables sans emballage adapté",
  "Médicaments sans ordonnance ni autorisation",
  "Tout bien interdit à l'import dans le pays de destination",
];

function ColisPage() {
  return (
    <PageShell
      kicker="Expédier"
      title="Colis"
      intro="Envoyez à vos proches en toute confiance : un parcours clair, une référence de suivi, un interlocuteur identifié."
      image={afrique}
      imageAlt="Colis prêts à l'expédition"
    >
      <Section title="Le parcours d'un colis SAO">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ETAPES.map((e, i) => (
            <li key={e.t} className="sao-card p-5">
              <span className="text-xs font-bold text-sao-gold">0{i + 1}</span>
              <h3 className="mt-2 font-bold text-sao-navy">{e.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="ivory" title="Conditions et restrictions">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="sao-card p-6">
            <PackageCheck className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Emballage</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Carton double cannelure, calage interne, scellage complet. Les colis mal emballés
              peuvent être refusés au départ.
            </p>
          </article>
          <article className="sao-card p-6">
            <ShieldCheck className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Déclaration</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Une déclaration exacte du contenu et de la valeur accélère le dédouanement et protège
              vos droits en cas de litige.
            </p>
          </article>
          <article className="sao-card p-6">
            <AlertTriangle className="size-6 text-sao-red" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Non acceptés</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {RESTRICTIONS.map((r) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          </article>
        </div>
        <DemoNote>
          Les tarifs dépendent du poids, du volume et de la destination. Ils sont établis au dépôt
          ou sur devis — nous n'affichons pas de grille tarifaire non validée.
        </DemoNote>
      </Section>

      <Section title="Suivre un envoi">
        <p className="text-muted-foreground">
          Chaque colis reçoit une référence unique remise au dépôt.
        </p>
        <Link
          to="/suivi"
          className="mt-5 inline-flex items-center rounded-full bg-sao-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Ouvrir le suivi
        </Link>
      </Section>

      <Section id="demande" tone="ivory" title="Votre demande">
        <ServiceRequestForm service="colis" />
      </Section>

      <CtaBand
        title="Un envoi régulier ou volumineux ?"
        text="Au-delà d'un certain volume, notre offre cargo est plus adaptée et plus économique."
        to="/cargo"
        label="Découvrir le cargo"
      />
    </PageShell>
  );
}

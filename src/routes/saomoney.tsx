import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSign, Lock, Smartphone, Wallet } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import { WalletPanel } from "@/components/sao/WalletPanel";
import afrique from "@/assets/dest-afrique.jpg";

export const Route = createFileRoute("/saomoney")({
  head: () => ({
    meta: [
      { title: "SAO Money — Transferts et portefeuille | SAO Global Travel" },
      {
        name: "description",
        content:
          "SAO Money : le volet transfert d'argent et portefeuille de l'écosystème SAO Global Travel, pensé pour les familles et les voyageurs.",
      },
      { property: "og:title", content: "SAO Money — SAO Global Travel" },
      {
        property: "og:description",
        content: "Transferts, portefeuille et paiement des services SAO.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SaoMoneyPage,
});

function SaoMoneyPage() {
  return (
    <PageShell
      kicker="Découvrir"
      title="SAO Money"
      intro="Le volet financier de l'écosystème SAO : transferts vers vos proches, portefeuille et règlement de vos services de voyage."
      image={afrique}
      imageAlt="Paiement mobile en Afrique"
    >
      <Section title="Le principe">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CircleDollarSign, t: "Transferts", d: "Envoyer de l'argent à un proche depuis nos villes de base." },
            { icon: Wallet, t: "Portefeuille", d: "Un solde unique pour régler vos services SAO." },
            { icon: Smartphone, t: "Mobile d'abord", d: "Un parcours pensé pour le téléphone, simple et lisible." },
            { icon: Lock, t: "Sécurité", d: "Identification du bénéficiaire et traçabilité de chaque opération." },
          ].map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <DemoNote>
          SAO Money n'est pas encore ouvert en ligne : aucun transfert, solde ni frais réel n'est
          affiché ou traité sur ce site. Les opérations se font aujourd'hui avec un conseiller.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Mon portefeuille" lead="Solde, dépôt, transfert et historique de vos opérations.">
        <WalletPanel />
      </Section>

      <CtaBand
        title="Être informé de l'ouverture"
        text="Laissez-nous vos coordonnées : nous vous préviendrons dès que le service sera disponible en ligne."
        to="/contact"
        label="Me tenir informé"
      />
    </PageShell>
  );
}

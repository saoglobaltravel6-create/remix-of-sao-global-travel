import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Handshake, Hotel, Network, Plane, Search, Ship, Sparkles, WalletCards } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import moyenOrient from "@/assets/dest-moyen-orient.jpg";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Partenaires — Notre écosystème | SAO Global Travel" },
      {
        name: "description",
        content:
          "Compagnies, transporteurs, hôteliers et acteurs financiers : comment SAO Global Travel construit son réseau de partenaires.",
      },
      { property: "og:title", content: "Partenaires — SAO Global Travel" },
      {
        property: "og:description",
        content: "Notre écosystème de partenaires et les conditions pour nous rejoindre.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartenairesPage,
});

function PartenairesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const categories = [
    { name: "Aérien", icon: Plane, detail: "Compagnies et opérateurs aériens" },
    { name: "Fret", icon: Ship, detail: "Transitaires et transporteurs" },
    { name: "Hébergement", icon: Hotel, detail: "Hôtels et résidences" },
    { name: "Finance", icon: WalletCards, detail: "Acteurs financiers et paiement" },
    { name: "Institutionnel", icon: Building2, detail: "Entreprises et institutions" },
  ];
  const visible = useMemo(() => categories.filter((item) => (category === "Tous" || item.name === category) && `${item.name} ${item.detail}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return (
    <PageShell
      kicker="Découvrir"
      title="Partenaires"
      intro="Notre force vient d'un réseau : compagnies aériennes, transporteurs routiers, agents de fret, hôteliers et acteurs financiers."
      image={moyenOrient}
      imageAlt="Poignée de main entre partenaires"
    >
      <Section title="Notre approche">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Network, t: "Un réseau multi-métiers", d: "Aérien, routier, fret, hébergement et services financiers réunis autour d'un même parcours client." },
            { icon: Handshake, t: "Des accords vérifiés", d: "Nous n'annonçons un partenaire qu'une fois l'accord formalisé des deux côtés." },
            { icon: Sparkles, t: "Une exigence commune", d: "Ponctualité, transparence et qualité de service : nos critères de sélection." },
          ].map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <DemoNote>
          La liste nominative des partenaires et leurs logos ne sont pas affichés ici tant que les
          autorisations d'utilisation ne nous ont pas été transmises.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Devenir partenaire">
        <p className="max-w-2xl text-muted-foreground">
          Vous êtes transporteur, hôtelier, agent de fret ou acteur financier et souhaitez travailler
          avec SAO Global Travel ? Présentez-nous votre activité, vos zones couvertes et vos
          références : nous étudions chaque candidature.
        </p>
      </Section>

      <Section title="Annuaire par secteur" lead="Explorez les métiers recherchés par SAO. Les entreprises ne sont nommées qu'après accord formalisé.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Secteurs partenaires">
            {["Tous", ...categories.map((item) => item.name)].map((name) => (
              <button key={name} type="button" role="tab" aria-selected={category === name} onClick={() => setCategory(name)} className={`rounded-full px-4 py-2 text-xs font-semibold ${category === name ? "bg-sao-navy text-primary-foreground" : "border border-border text-sao-navy"}`}>{name}</button>
            ))}
          </div>
          <label className="relative block min-w-64">
            <span className="sr-only">Rechercher un secteur</span>
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un secteur" className="h-10 w-full rounded-lg border border-border pl-10 pr-3 text-sm" />
          </label>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ name, icon: Icon, detail }) => (
            <article key={name} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-4 font-bold text-sao-navy">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-sao-gold">Candidatures ouvertes</p>
            </article>
          ))}
        </div>
        <DemoNote>Aucun nom ni logo commercial n'est présenté comme partenaire confirmé sans autorisation écrite.</DemoNote>
      </Section>

      <CtaBand
        title="Proposer un partenariat"
        text="Envoyez-nous votre présentation et vos zones d'intervention."
        to="/contact"
        label="Écrire à l'équipe"
      />
    </PageShell>
  );
}

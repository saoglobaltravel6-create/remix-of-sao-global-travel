import { createFileRoute } from "@tanstack/react-router";
import { Bus, Clock, MapPin, Ticket } from "lucide-react";
import { PageShell, Section, CtaBand, DemoNote } from "@/components/sao/PageShell";
import afrique from "@/assets/dest-afrique.jpg";

export const Route = createFileRoute("/bus")({
  head: () => ({
    meta: [
      { title: "Bus — Mobilité régionale | SAO Global Travel" },
      {
        name: "description",
        content:
          "Transport routier régional et interurbain avec SAO Global Travel : liaisons, réservation et informations pratiques.",
      },
      { property: "og:title", content: "Bus — SAO Global Travel" },
      {
        property: "og:description",
        content: "Liaisons régionales, réservation accompagnée et conseils pratiques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BusPage,
});

function BusPage() {
  return (
    <PageShell
      kicker="Voyager"
      title="Bus"
      intro="La mobilité régionale, simplifiée : liaisons routières au départ de nos villes de base, réservées avec un conseiller."
      image={afrique}
      imageAlt="Route régionale africaine"
    >
      <Section title="Le service">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: MapPin, t: "Liaisons régionales", d: "Trajets interurbains au départ de N'Djamena et de Dakar, selon la demande." },
            { icon: Ticket, t: "Réservation accompagnée", d: "Nous réservons votre place et vous transmettons le point de départ exact." },
            { icon: Clock, t: "Départs confirmés", d: "L'horaire vous est confirmé avant le jour du voyage." },
          ].map(({ icon: Icon, t, d }) => (
            <article key={t} className="sao-card p-6">
              <Icon className="size-6 text-sao-gold" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-sao-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <DemoNote>
          Nous ne publions aucun horaire ni tarif de bus tant qu'ils ne sont pas confirmés par les
          opérateurs partenaires. Faites une demande : un conseiller vous répond avec les départs
          réellement disponibles.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Demander un trajet">
        <form
          className="sao-card grid gap-4 p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget;
            const data = new FormData(f);
            const body = `Départ: ${data.get("from")}\nArrivée: ${data.get("to")}\nDate: ${data.get("date")}\nPassagers: ${data.get("pax")}`;
            window.location.href = `mailto:contact@saoglobaltravel.com?subject=${encodeURIComponent("Demande de trajet bus")}&body=${encodeURIComponent(body)}`;
          }}
        >
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            Ville de départ
            <input name="from" required className="rounded-xl border border-border px-4 py-3 text-sm" placeholder="N'Djamena" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            Ville d'arrivée
            <input name="to" required className="rounded-xl border border-border px-4 py-3 text-sm" placeholder="Moundou" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            Date souhaitée
            <input name="date" type="date" required className="rounded-xl border border-border px-4 py-3 text-sm" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            Passagers
            <input name="pax" type="number" min={1} defaultValue={1} className="rounded-xl border border-border px-4 py-3 text-sm" />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sao-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground sm:col-span-2"
          >
            <Bus className="size-4" aria-hidden="true" /> Envoyer la demande
          </button>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Ce formulaire ouvre votre messagerie avec la demande pré-remplie. Aucune place n'est
            réservée tant qu'un conseiller ne l'a pas confirmée.
          </p>
        </form>
      </Section>

      <CtaBand
        title="Un groupe à transporter ?"
        text="Écoles, entreprises, associations : nous organisons le transport routier de groupe sur devis."
        to="/solutions-pro"
        label="Voir les solutions pro"
      />
    </PageShell>
  );
}

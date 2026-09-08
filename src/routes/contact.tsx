import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageShell, Section, DemoNote } from "@/components/sao/PageShell";
import europe from "@/assets/dest-europe.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Parlez à un conseiller | SAO Global Travel" },
      {
        name: "description",
        content:
          "Contactez SAO Global Travel à N'Djamena et à Dakar : téléphone, e-mail et demande écrite pour vos voyages et envois.",
      },
      { property: "og:title", content: "Contact — SAO Global Travel" },
      {
        property: "og:description",
        content: "Téléphone, e-mail et formulaire de contact des équipes SAO Global Travel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell
      kicker="SAO"
      title="Contact"
      intro="Une question sur un vol, un colis, un envoi cargo ou un séjour ? Nos conseillers répondent depuis N'Djamena et Dakar."
      image={europe}
      imageAlt="Équipe SAO Global Travel"
    >
      <Section title="Nous joindre">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="sao-card p-6">
            <Phone className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Téléphone</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              <a href="tel:+23566288649" className="hover:text-sao-navy">+235 66 28 86 49</a> — Tchad
              <br />
              <a href="tel:+221777308535" className="hover:text-sao-navy">+221 77 730 85 35</a> — Sénégal
            </p>
          </article>
          <article className="sao-card p-6">
            <Mail className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">E-mail</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              <a href="mailto:contact@saoglobaltravel.com" className="hover:text-sao-navy">
                contact@saoglobaltravel.com
              </a>
            </p>
          </article>
          <article className="sao-card p-6">
            <MapPin className="size-6 text-sao-gold" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-sao-navy">Nos villes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              N'Djamena, Tchad · Dakar, Sénégal
            </p>
          </article>
        </div>
        <DemoNote>
          Les horaires d'ouverture précis des agences ne sont pas encore publiés ici : transmettez-nous
          les vôtres et nous les afficherons.
        </DemoNote>
      </Section>

      <Section tone="ivory" title="Écrire à un conseiller">
        <form
          className="sao-card grid gap-4 p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const body = `Nom: ${data.get("name")}\nE-mail: ${data.get("email")}\nTéléphone: ${data.get("phone")}\n\n${data.get("message")}`;
            window.location.href = `mailto:contact@saoglobaltravel.com?subject=${encodeURIComponent("Demande via le site SAO Global Travel")}&body=${encodeURIComponent(body)}`;
          }}
        >
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            Nom complet
            <input name="name" required className="rounded-xl border border-border px-4 py-3 text-sm" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            E-mail
            <input name="email" type="email" required className="rounded-xl border border-border px-4 py-3 text-sm" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            Téléphone
            <input name="phone" className="rounded-xl border border-border px-4 py-3 text-sm" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy">
            Sujet
            <input name="subject" className="rounded-xl border border-border px-4 py-3 text-sm" placeholder="Vol, colis, cargo…" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-sao-navy sm:col-span-2">
            Message
            <textarea name="message" rows={5} required className="rounded-xl border border-border px-4 py-3 text-sm" />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-sao-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground sm:col-span-2"
          >
            Envoyer le message
          </button>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Ce formulaire ouvre votre messagerie avec le message pré-rempli.
          </p>
        </form>
      </Section>
    </PageShell>
  );
}

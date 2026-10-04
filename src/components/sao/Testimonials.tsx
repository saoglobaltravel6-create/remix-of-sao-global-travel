import { MessageCircleMore } from "lucide-react";
import { DemoBadge } from "@/components/sao/DemoBadge";

const TESTIMONIALS = [
  { profile: "Voyageur", text: "Un accompagnement clair, de la demande jusqu’au suivi du voyage." },
  { profile: "Famille", text: "Les étapes sont regroupées au même endroit et faciles à retrouver." },
  { profile: "Entreprise", text: "Un interlocuteur unique pour coordonner voyage et expédition." },
];

export function Testimonials() {
  return (
    <section className="bg-sao-ivory py-20" aria-labelledby="testimonials-title">
      <div className="sao-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <DemoBadge />
            <h2 id="testimonials-title" className="mt-4 text-3xl font-bold text-sao-navy md:text-5xl">Témoignages de démonstration</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">Ces textes illustrent la future présentation. Ils ne sont attribués à aucun client réel.</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article key={item.profile} className="sao-card p-6">
              <MessageCircleMore className="size-6 text-sao-gold" aria-hidden="true" />
              <blockquote className="mt-5 text-lg leading-relaxed text-sao-navy">« {item.text} »</blockquote>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Profil fictif · {item.profile}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
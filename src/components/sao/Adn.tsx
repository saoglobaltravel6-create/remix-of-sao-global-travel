import { Award, ShieldCheck, Lightbulb, Scale, Heart, Briefcase, ArrowRight } from "lucide-react";

const VALUES = [
  { icon: Award, title: "Excellence", desc: "Un service constant, du premier appel à l'arrivée." },
  { icon: ShieldCheck, title: "Confiance", desc: "Transparence sur les tarifs, les délais et les conditions." },
  { icon: Lightbulb, title: "Innovation", desc: "Des outils simples pour réserver, expédier et suivre." },
  { icon: Scale, title: "Intégrité", desc: "Des engagements tenus, une conformité respectée." },
  { icon: Heart, title: "Passion", desc: "L'amour de l'Afrique et de ses voyageurs." },
];

export function Adn() {
  return (
    <section id="adn" className="bg-sao-navy py-20 text-primary-foreground">
      <div className="sao-container grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sao-gold">
            Notre ADN
          </h2>
          <p className="mt-4 max-w-lg text-2xl font-bold leading-tight tracking-tight md:text-3xl">
            Une marque africaine, ouverte sur le monde.
          </p>
          <ul className="mt-8 space-y-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-4">
                <span className="mt-0.5 rounded-xl bg-primary-foreground/10 p-2">
                  <Icon className="size-5 text-sao-gold" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-sao-gold">{title}</p>
                  <p className="text-sm text-primary-foreground/75">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5 p-8">
          <span className="inline-flex rounded-xl bg-sao-gold/20 p-3">
            <Briefcase className="size-6 text-sao-gold" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-xl font-bold tracking-tight">Solutions professionnelles</h3>
          <p className="mt-3 text-sm text-primary-foreground/75">
            Voyage corporate, groupes, cargo, transit, logistique et déplacements pro : nous
            construisons l'offre autour de vos flux réels, au Tchad, au Sénégal et à l'international.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-primary-foreground/85">
            {["Voyage corporate", "Groupes", "Cargo & transit", "Logistique", "Déplacements pro", "Comptes dédiés"].map(
              (i) => (
                <li key={i} className="rounded-xl bg-primary-foreground/5 px-3 py-2">
                  {i}
                </li>
              ),
            )}
          </ul>
          <a
            href="mailto:contact@saoglobaltravel.com"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-sao-gold px-6 py-3 text-sm font-semibold text-sao-navy transition-[filter] hover:brightness-105"
          >
            Demander une solution pro <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

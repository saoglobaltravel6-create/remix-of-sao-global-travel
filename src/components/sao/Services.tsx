import { Plane, Luggage, Package, Ship, Bus, CircleDollarSign, Building2, Palmtree } from "lucide-react";

const SERVICES = [
  { icon: Plane, title: "VOLS", desc: "Le monde, au départ de N'Djamena." },
  { icon: Luggage, title: "BAGAGES", desc: "Vos bagages, suivis à chaque étape." },
  { icon: Package, title: "COLIS", desc: "Envoyez à vos proches, en confiance." },
  { icon: Ship, title: "CARGO", desc: "Le fret professionnel, sans friction." },
  { icon: Bus, title: "BUS", desc: "La mobilité régionale, simplifiée." },
  { icon: CircleDollarSign, title: "SAO MONEY", desc: "Envoyez. Recevez. Restez connectés." },
  { icon: Building2, title: "HÉBERGEMENTS", desc: "Séjours confortables, partout où vous allez." },
  { icon: Palmtree, title: "SÉJOURS & CIRCUITS", desc: "Découvrez le Tchad et le monde autrement." },
];

export function Services() {
  return (
    <section id="services" className="sao-container py-20">
      <div className="mb-10 flex items-center justify-center gap-4">
        <span className="h-px w-12 bg-sao-gold" aria-hidden="true" />
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-sao-navy">
          Nos services
        </h2>
        <span className="h-px w-12 bg-sao-gold" aria-hidden="true" />
      </div>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="sao-card group flex flex-col items-center gap-3 p-6 text-center transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="rounded-2xl bg-sao-ivory p-3 text-sao-navy transition-colors duration-300 group-hover:bg-sao-gold/20">
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold tracking-wide text-sao-navy">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
            <span className="mt-1 h-0.5 w-8 bg-sao-gold" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  );
}

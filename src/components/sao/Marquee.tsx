const ITEMS = [
  "VOYAGEZ",
  "DÉCOUVREZ",
  "CONNECTEZ LE MONDE",
  "VOLS",
  "BAGAGES",
  "COLIS",
  "CARGO",
  "BUS",
  "SAO MONEY",
  "HÉBERGEMENTS",
  "SÉJOURS & CIRCUITS",
];

/** Bandeau défilant en boucle parfaite (deux copies translatées de -50%). */
export function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-primary-foreground/15 bg-sao-navy py-4"
      aria-hidden="true"
    >
      <div className="sao-marquee-track flex w-max gap-8 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-8">
            {ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="inline-flex items-center gap-8 text-sm font-bold tracking-[0.22em] text-primary-foreground/85"
              >
                {item}
                <span className="text-sao-gold">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

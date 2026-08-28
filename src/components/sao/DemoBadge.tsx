import { Info } from "lucide-react";

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-sao-gold/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sao-navy ${className}`}
    >
      <Info className="size-3 text-sao-gold" aria-hidden="true" />
      Données de démonstration
    </span>
  );
}
